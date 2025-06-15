import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/api';

// Ação assíncrona para buscar perfil do usuário
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar perfil do usuário'
      );
    }
  }
);

// Ação assíncrona para atualizar perfil do usuário
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar perfil do usuário'
      );
    }
  }
);

// Ação assíncrona para alterar senha do usuário
export const changeUserPassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao alterar senha'
      );
    }
  }
);

