import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

  // support
  help: async (credentials) => {
    const response = await api.post('/auth/help', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

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
  },

  logout: () => {
    // Remove o token do armazenamento local
    localStorage.removeItem('token');
    // Opcional, mas recomendado: remove o header de autorização da instância do axios
    // para que requisições futuras não usem o token antigo.
    delete api.defaults.headers.common['Authorization'];
  }
};

// Serviço de usuário
export const userService = {
  // Buscar perfil do usuário
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  // Atualizar perfil do usuário
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  // Alterar senha do usuário
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
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

  // Importa todos os convidados de um csv
  importGuests: async (formData) => {
    const response = await api.post(`/guest/import-csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Buscar todos os convidados de um evento
  getGuests: async (eventId) => {
    const response = await api.get(`/guest/event/${eventId}`);
    return response.data;
  },
  
  // Buscar um convidado específico
  getGuest: async (id) => {
    const response = await api.get(`/guest/${id}`);
    return response.data;
  },

  // Buscar um convidado específico publico
  getGuestPublic: async (id) => {
    const response = await api.get(`/guest/${id}/public`);
    return response.data;
  },

  // Criar um convidado
  createGuest: async (guestData) => {
    const response = await api.post('/guest', guestData);
    return response.data;
  },
  
  // Atualizar um convidado
  updateGuest: async (id, guestData) => {
    const response = await api.put(`/guest/${id}`, guestData);
    return response.data;
  },
  
  // Excluir um convidado
  deleteGuest: async (id) => {
    const response = await api.delete(`/guest/${id}`);
    return response.data;
  },
  
  // Atualizar status de um convidado (RSVP)
  updateGuestStatus: async (id, statusData) => {
    const response = await api.put(`/guest/${id}/rsvp`, statusData);
    return response.data;
  },
  
  // Buscar histórico de RSVP de um convidado
  getGuestRsvpHistory: async (id) => {
    const response = await api.get(`/guest/${id}/rsvp-history`);
    return response.data;
  },
  
  // Vincular múltiplos convidados a um convite
  linkGuestsToInvite: async (inviteId, guestIds) => {
    const response = await api.post(`/invites/link-guests/${inviteId}`, { guestIds });
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
