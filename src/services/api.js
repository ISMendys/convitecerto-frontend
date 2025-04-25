import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erro de autenticação
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Serviços de eventos
export const eventService = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  deleteEvent: async (id) => {
    await api.delete(`/events/${id}`);
    return true;
  }
};

// Serviços de convites
export const inviteService = {
  getInvites: async (eventId) => {
    const response = await api.get(`/invites/event/${eventId}`);
    return response.data;
  },
  
  getInvite: async (id) => {
    const response = await api.get(`/invites/${id}`);
    return response.data;
  },
  
  createInvite: async (inviteData) => {
    const response = await api.post('/invites', inviteData);
    return response.data;
  },
  
  updateInvite: async (id, inviteData) => {
    const response = await api.put(`/invites/${id}`, inviteData);
    return response.data;
  },
  
  deleteInvite: async (id) => {
    await api.delete(`/invites/${id}`);
    return true;
  },
  
  getPublicInvite: async (id) => {
    const response = await api.get(`/invites/public/${id}`);
    return response.data;
  }
};

// Serviços de convidados
export const guestService = {
  getGuests: async (eventId) => {
    const response = await api.get(`/guests/event/${eventId}`);
    return response.data;
  },
  
  getGuest: async (id) => {
    const response = await api.get(`/guests/${id}`);
    return response.data;
  },
  
  addGuest: async (guestData) => {
    const response = await api.post('/guests', guestData);
    return response.data;
  },
  
  updateGuest: async (id, guestData) => {
    const response = await api.put(`/guests/${id}`, guestData);
    return response.data;
  },
  
  deleteGuest: async (id) => {
    await api.delete(`/guests/${id}`);
    return true;
  },
  
  importGuests: async (eventId, guests) => {
    const response = await api.post('/guests/import', { eventId, guests });
    return response.data;
  },
  
  submitRsvp: async (id, rsvpData) => {
    const response = await api.post(`/guests/rsvp/${id}`, rsvpData);
    return response.data;
  },
  
  // Novo método para buscar histórico de RSVP de um convidado
  getGuestRsvpHistory: async (id) => {
    const response = await api.get(`/guests/${id}/messages`);
    return response.data;
  }
};

// Serviços de WhatsApp
export const whatsappService = {
  sendInvite: async (guestId, message, inviteLink) => {
    const response = await api.post('/whatsapp/send-invite', {
      guestId,
      message,
      inviteLink
    });
    return response.data;
  },
  
  sendReminder: async (guestId, message) => {
    const response = await api.post('/whatsapp/send-reminder', {
      guestId,
      message
    });
    return response.data;
  },
  
  sendBulk: async (eventId, message, filter) => {
    const response = await api.post('/whatsapp/send-bulk', {
      eventId,
      message,
      filter
    });
    return response.data;
  }
};

export default api;
