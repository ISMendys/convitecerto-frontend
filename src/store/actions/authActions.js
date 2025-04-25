import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

// Ação assíncrona para login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao fazer login'
      );
    }
  }
);

// Ação assíncrona para registro
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao registrar usuário'
      );
    }
  }
);

// Ação assíncrona para obter usuário atual
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao obter usuário'
      );
    }
  }
);

// Ação para logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
    return null;
  }
);
