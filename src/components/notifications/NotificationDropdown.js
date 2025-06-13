import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Snackbar
} from '@mui/material';
import {
  NotificationsOutlined,
  CheckCircle,
  Cancel,
  Send,
  Schedule,
  Update,
  Warning,
  MarkEmailRead,
  Clear,
  Refresh
} from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import { useWebSocket } from '../../contexts/WebSocketContext';

const NotificationDropdown = () => {
  const theme = useTheme();
  const { connected, notifications: wsNotifications, markNotificationAsRead } = useWebSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newNotificationSnackbar, setNewNotificationSnackbar] = useState({
    open: false,
    notification: null
  });
  
  const intervalRef = useRef(null);
  const open = Boolean(anchorEl);

  // Ícones para cada tipo de notificação
  const getIcon = (type) => {
    const icons = {
      'GUEST_CONFIRMED': CheckCircle,
      'GUEST_DECLINED': Cancel,
      'INVITE_SENT': Send,
      'EVENT_REMINDER': Schedule,
      'EVENT_UPDATED': Update,
      'SYSTEM_ALERT': Warning
    };
    
    const IconComponent = icons[type] || NotificationsOutlined;
    return <IconComponent />;
  };

  // Cores para cada tipo de notificação
  const getColor = (type) => {
    const colors = {
      'GUEST_CONFIRMED': theme.palette.success.main,
      'GUEST_DECLINED': theme.palette.error.main,
      'INVITE_SENT': theme.palette.info.main,
      'EVENT_REMINDER': theme.palette.warning.main,
      'EVENT_UPDATED': theme.palette.primary.main,
      'SYSTEM_ALERT': theme.palette.warning.main
    };
    
    return colors[type] || theme.palette.grey[500];
  };

  // Buscar notificações
  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications({
        page: pageNum,
        limit: 20
      });
      
      if (append) {
        setNotifications(prev => [...prev, ...response.notifications]);
      } else {
        setNotifications(response.notifications);
      }
      
      setUnreadCount(response.unreadCount);
      setHasMore(response.pagination.page < response.pagination.pages);
      setPage(pageNum);
      
    } catch (err) {
      setError('Erro ao carregar notificações');
      console.error('Erro ao buscar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Marcar via WebSocket se conectado
      if (connected) {
        markNotificationAsRead(notificationId);
      }
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err);
    }
  };

  // Carregar mais notificações
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  };

  // Abrir dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      fetchNotifications();
    }
  };

  // Fechar dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Polling para novas notificações (fallback se WebSocket não estiver conectado)
  useEffect(() => {
    // Buscar notificações iniciais
    fetchNotifications();
    
    // Se WebSocket não estiver conectado, usar polling como fallback
    if (!connected) {
      intervalRef.current = setInterval(() => {
        fetchNotifications();
      }, 30000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [connected]);

  // Integrar notificações do WebSocket
  useEffect(() => {
    if (wsNotifications.length > 0) {
      // Mesclar notificações do WebSocket com as existentes
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifications = wsNotifications.filter(n => !existingIds.has(n.id));
        
        if (newNotifications.length > 0) {
          // Atualizar contagem de não lidas
          const newUnreadCount = newNotifications.filter(n => !n.read).length;
          setUnreadCount(prevCount => prevCount + newUnreadCount);
          
          return [...newNotifications, ...prev];
        }
        
        return prev;
      });
    }
  }, [wsNotifications]);

  // Listener para eventos de notificação customizados
  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      
      // Mostrar snackbar apenas se o dropdown não estiver aberto
      if (!open && !notification.read) {
        setNewNotificationSnackbar({
          open: true,
          notification: notification
        });
      }
    };

    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [open]);

  return (
    <>
      {/* Botão de notificações */}
      <Tooltip title={connected ? "Notificações (Tempo Real)" : "Notificações"}>
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          sx={{
            borderRadius: '50%',
            p: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)' },
                  '70%': { transform: 'scale(1)' },
                  '100%': { transform: 'scale(0.95)' }
                }
              }
            }}
          >
            <NotificationsOutlined 
              sx={{ 
                color: connected ? theme.palette.success.main : theme.palette.primary.main 
              }} 
            />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Dropdown de notificações */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 1
          }
        }}
      >
        <Box>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.primary.main, 0.02)
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Notificações
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Indicador de status de conexão */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: connected 
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.warning.main, 0.1)
                }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: connected 
                      ? theme.palette.success.main 
                      : theme.palette.warning.main
                  }} />
                  <Typography variant="caption" color={connected ? 'success.main' : 'warning.main'}>
                    {connected ? 'Tempo Real' : 'Offline'}
                  </Typography>
                </Box>
                
                <Tooltip title="Atualizar">
                  <IconButton 
                    size="small" 
                    onClick={() => fetchNotifications()}
                    disabled={loading}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
                {unreadCount > 0 && (
                  <Tooltip title="Marcar todas como lidas">
                    <IconButton 
                      size="small" 
                      onClick={handleMarkAllAsRead}
                    >
                      <MarkEmailRead fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            {unreadCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          {/* Conteúdo */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {loading && notifications.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            ) : notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <NotificationsOutlined sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Nenhuma notificação
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItemButton
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        backgroundColor: notification.read 
                          ? 'transparent' 
                          : alpha(theme.palette.primary.main, 0.04),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{ 
                          color: getColor(notification.type),
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {getIcon(notification.type)}
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={notification.read ? 400 : 600}
                              sx={{ flex: 1, mr: 1 }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: theme.palette.primary.main,
                                flexShrink: 0
                              }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip 
                                label={notificationService.formatNotificationType(notification.type)}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20,
                                  borderColor: getColor(notification.type),
                                  color: getColor(notification.type)
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {notificationService.formatRelativeTime(notification.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItemButton>
                    
                    {index < notifications.length - 1 && (
                      <Divider sx={{ mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
                
                {/* Botão carregar mais */}
                {hasMore && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button 
                      onClick={loadMore}
                      disabled={loading}
                      size="small"
                      startIcon={loading ? <CircularProgress size={16} /> : null}
                    >
                      {loading ? 'Carregando...' : 'Carregar mais'}
                    </Button>
                  </Box>
                )}
              </List>
            )}
          </Box>
        </Box>
      </Popover>

      {/* Snackbar para novas notificações */}
      <Snackbar
        open={newNotificationSnackbar.open}
        autoHideDuration={5000}
        onClose={() => setNewNotificationSnackbar({ open: false, notification: null })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={() => setNewNotificationSnackbar({ open: false, notification: null })}
          severity="info"
          variant="filled"
          sx={{ 
            minWidth: 300,
            '& .MuiAlert-icon': {
              color: getColor(newNotificationSnackbar.notification?.type)
            }
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {newNotificationSnackbar.notification?.title}
          </Typography>
          <Typography variant="body2">
            {newNotificationSnackbar.notification?.message}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationDropdown;

