import api from './api';

class NotificationService {
  /**
   * Busca notificações do usuário
   */
  async getNotifications(params = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false, type } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString(),
        ...(type && { type })
      });

      const response = await api.get(`/notifications?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead() {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  /**
   * Busca configurações de notificação
   */
  async getSettings() {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações de notificação:', error);
      throw error;
    }
  }

  /**
   * Atualiza configurações de notificação
   */
  async updateSettings(settings) {
    try {
      const { id, userId, createdAt, updatedAt, ...configData } = settings;
      const response = await api.put('/notifications/settings', configData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de notificação:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de notificações
   */
  async getStats() {
    try {
      const response = await api.get('/notifications/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de notificação:', error);
      throw error;
    }
  }

  /**
   * Envia notificação de teste (apenas desenvolvimento)
   */
  async sendTestNotification(data = {}) {
    try {
      const response = await api.post('/notifications/test', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      throw error;
    }
  }

  /**
   * Formata o tipo de notificação para exibição
   */
  formatNotificationType(type) {
    const types = {
      'GUEST_CONFIRMED': 'Confirmação de Presença',
      'GUEST_DECLINED': 'Recusa de Convite',
      'INVITE_SENT': 'Convite Enviado',
      'EVENT_REMINDER': 'Lembrete de Evento',
      'EVENT_UPDATED': 'Evento Atualizado',
      'SYSTEM_ALERT': 'Alerta do Sistema'
    };
    
    return types[type] || type;
  }

  /**
   * Retorna ícone para o tipo de notificação
   */
  getNotificationIcon(type) {
    const icons = {
      'GUEST_CONFIRMED': 'CheckCircle',
      'GUEST_DECLINED': 'Cancel',
      'INVITE_SENT': 'Send',
      'EVENT_REMINDER': 'Schedule',
      'EVENT_UPDATED': 'Update',
      'SYSTEM_ALERT': 'Warning'
    };
    
    return icons[type] || 'Notifications';
  }

  /**
   * Retorna cor para o tipo de notificação
   */
  getNotificationColor(type) {
    const colors = {
      'GUEST_CONFIRMED': 'success',
      'GUEST_DECLINED': 'error',
      'INVITE_SENT': 'info',
      'EVENT_REMINDER': 'warning',
      'EVENT_UPDATED': 'primary',
      'SYSTEM_ALERT': 'warning'
    };
    
    return colors[type] || 'default';
  }

  /**
   * Formata data relativa (ex: "há 2 horas")
   */
  formatRelativeTime(date) {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    }

    // Para datas mais antigas, mostrar data formatada
    return notificationDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

export default new NotificationService();

