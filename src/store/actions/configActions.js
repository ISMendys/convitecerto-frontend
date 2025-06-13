import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Ação assíncrona para buscar as configurações do usuário
export const fetchUserConfig = createAsyncThunk(
  'config/fetchUserConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/config');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar configurações'
      );
    }
  }
);

// Ação assíncrona para atualizar as configurações do usuário
export const updateUserConfig = createAsyncThunk(
  'config/updateUserConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const { id, updatedAt, createdAt,userId, ...dataToSend } = configData;
      const response = await api.put('/users/config', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar configurações'
      );
    }
  }
);

// Ação assíncrona para buscar todos os eventos
export const help = createAsyncThunk(
  'config/help',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/help', payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao enviar mensagem de ajuda'
      );
    }
  }
);
