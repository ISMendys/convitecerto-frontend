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
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Serviço de eventos
export const eventService = {
  // Buscar todos os eventos do usuário
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  
  // Buscar um evento específico
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  // Criar um evento
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  // Atualizar um evento
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  // Excluir um evento
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

// Serviço de convidados
export const guestService = {
  // Buscar todos os convidados de um evento
  getGuests: async (eventId) => {
    const response = await api.get(`/guests/event/${eventId}`);
    return response.data;
  },
  
  // Buscar um convidado específico
  getGuest: async (id) => {
    const response = await api.get(`/guests/${id}`);
    return response.data;
  },
  
  // Criar um convidado
  createGuest: async (guestData) => {
    const response = await api.post('/guests', guestData);
    return response.data;
  },
  
  // Atualizar um convidado
  updateGuest: async (id, guestData) => {
    const response = await api.put(`/guests/${id}`, guestData);
    return response.data;
  },
  
  // Excluir um convidado
  deleteGuest: async (id) => {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
  },
  
  // Atualizar status de um convidado (RSVP)
  updateGuestStatus: async (id, statusData) => {
    const response = await api.put(`/guests/${id}/status`, statusData);
    return response.data;
  },
  
  // Buscar histórico de RSVP de um convidado
  getGuestRsvpHistory: async (id) => {
    const response = await api.get(`/guests/${id}/rsvp-history`);
    return response.data;
  },
  
  // Vincular múltiplos convidados a um convite
  linkGuestsToInvite: async (inviteId, guestIds) => {
    const response = await api.post(`/guests/link-invite`, { inviteId, guestIds });
    return response.data;
  }
};

// Serviço de convites
export const inviteService = {
  // Buscar todos os convites de um evento
  getInvites: async (eventId) => {
    const response = await api.get(`/invites/event/${eventId}`);
    return response.data;
  },
  
  // Buscar um convite específico
  getInvite: async (id) => {
    const response = await api.get(`/invites/${id}`);
    return response.data;
  },
  
  // Criar um convite
  createInvite: async (inviteData) => {
    const response = await api.post('/invites', inviteData);
    return response.data;
  },
  
  // Atualizar um convite
  updateInvite: async (id, inviteData) => {
    const response = await api.put(`/invites/${id}`, inviteData);
    return response.data;
  },
  
  // Excluir um convite
  deleteInvite: async (id) => {
    const response = await api.delete(`/invites/${id}`);
    return response.data;
  },
  
  // Buscar um convite público (para convidados)
  getPublicInvite: async (id) => {
    const response = await api.get(`/invites/public/${id}`);
    return response.data;
  },
  
  // Buscar o convite padrão de um evento
  getDefaultInvite: async (eventId) => {
    const response = await api.get(`/invites/default/${eventId}`);
    return response.data;
  }
};

export default api;
