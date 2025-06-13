import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket deve ser usado dentro de WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useSelector(state => state.auth);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Configuração do WebSocket
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    // URL do backend - ajuste conforme necessário
    const SOCKET_URL = process.env.REACT_APP_API_URL.replace('api/', '') || 'http://localhost:5000/';
    console.log(SOCKET_URL, 'SOCKET_URL')
    console.log(process.env.REACT_APP_API_URL, 'REACT_APP_API_URL')
    console.log('Conectando ao WebSocket...', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Eventos de conexão
    newSocket.on('connect', () => {
      console.log('WebSocket conectado:', newSocket.id);
      setConnected(true);
      reconnectAttemptsRef.current = 0;

      // Autenticar usuário
      newSocket.emit('authenticate', {
        userId: user.id,
        token: token
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
      setConnected(false);
      
      // Tentar reconectar se a desconexão não foi intencional
      if (reason !== 'io client disconnect') {
        handleReconnect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
      setConnected(false);
      handleReconnect();
    });

    // Eventos de autenticação
    newSocket.on('authenticated', (data) => {
      if (data.success) {
        console.log('Usuário autenticado no WebSocket');
      } else {
        console.error('Erro na autenticação WebSocket:', data.error);
      }
    });

    // Eventos de notificação
    newSocket.on('notification', (notification) => {
      console.log('Nova notificação recebida:', notification);
      
      // Adicionar notificação à lista
      setNotifications(prev => [notification, ...prev]);
      
      // Disparar evento customizado para outros componentes
      window.dispatchEvent(new CustomEvent('newNotification', { 
        detail: notification 
      }));
    });

    newSocket.on('notification_marked_read', (data) => {
      console.log('Notificação marcada como lida:', data.notificationId);
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === data.notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    });

    newSocket.on('system_message', (message) => {
      console.log('Mensagem do sistema:', message);
      // Você pode implementar tratamento de mensagens do sistema aqui
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newSocket.close();
    };
  }, [user, token]);

  // Função para tentar reconectar
  const handleReconnect = () => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('Máximo de tentativas de reconexão atingido');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(`Tentando reconectar em ${delay}ms (tentativa ${reconnectAttemptsRef.current + 1})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      if (socket) {
        socket.connect();
      }
    }, delay);
  };

  // Função para marcar notificação como lida
  const markNotificationAsRead = (notificationId) => {
    if (socket && connected) {
      socket.emit('mark_notification_read', { notificationId });
    }
  };

  // Função para enviar evento customizado
  const emitEvent = (eventName, data) => {
    if (socket && connected) {
      socket.emit(eventName, data);
    }
  };

  const value = {
    socket,
    connected,
    notifications,
    markNotificationAsRead,
    emitEvent,
    setNotifications
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;

