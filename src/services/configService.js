import api from './api';

// Serviço de configurações do usuário
export const configService = {
  // Buscar configurações do usuário
  getUserConfig: async () => {
    const response = await api.get('/users/config');
    return response.data;
  },
  
  // Atualizar configurações do usuário
  updateUserConfig: async (configData) => {
    const response = await api.put('/users/config', configData);
    return response.data;
  },

  // Buscar configurações do usuário
  getHelp: async () => {
    const response = await api.post('/users/help');
    return response.data;
  },
};

export default configService;
