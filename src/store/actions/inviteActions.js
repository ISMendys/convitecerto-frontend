import { createAsyncThunk } from '@reduxjs/toolkit';
import { inviteService } from '../../services/api';

// Ação assíncrona para buscar todos os convites de um evento
export const fetchInvites = createAsyncThunk(
  'invites/fetchInvites',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await inviteService.getInvites(eventId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convites'
      );
    }
  }
);

// Ação assíncrona para buscar um convite específico
export const fetchInvite = createAsyncThunk(
  'invites/fetchInvite',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inviteService.getInvite(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convite'
      );
    }
  }
);

// Ação assíncrona para criar um convite
export const createInvite = createAsyncThunk(
  'invites/createInvite',
  async (inviteData, { rejectWithValue }) => {
    try {
      const response = await inviteService.createInvite(inviteData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao criar convite'
      );
    }
  }
);

// Ação assíncrona para atualizar um convite
export const updateInvite = createAsyncThunk(
  'invites/updateInvite',
  async ({ id, inviteData }, { rejectWithValue }) => {
    try {
      console.log('Updating invite with ID:', id);
      console.log('Invite data:', inviteData);
      const response = await inviteService.updateInvite(id, inviteData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar convite'
      );
    }
  }
);

// Ação assíncrona para excluir um convite
export const deleteInvite = createAsyncThunk(
  'invites/deleteInvite',
  async (id, { rejectWithValue }) => {
    try {
      await inviteService.deleteInvite(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao excluir convite'
      );
    }
  }
);

// Ação assíncrona para buscar um convite público (para convidados)
export const fetchPublicInvite = createAsyncThunk(
  'invites/fetchPublicInvite',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching public invite for guest ID:', id);
      // Primeiro, buscar o convidado para obter o ID do convite
      const guestResponse = await fetch(`http://localhost:5000/api/guests/${id}`);
      
      if (!guestResponse.ok) {
        throw new Error('Convidado não encontrado');
      }
      
      const guestData = await guestResponse.json();
      console.log('Guest data:', guestData);
      
      if (!guestData.inviteId) {
        throw new Error('Este convidado não possui um convite associado');
      }
      
      // Agora, buscar o convite usando o ID do convite
      const response = await inviteService.getPublicInvite(guestData.inviteId);
      console.log('Invite response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching public invite:', error);
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Erro ao buscar convite'
      );
    }
  }
);

// Ação assíncrona para buscar templates de convites
export const fetchTemplates = createAsyncThunk(
  'invites/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      // No MVP, retornamos templates estáticos
      return [
        {
          id: 'default',
          name: 'Padrão',
          thumbnail: '/templates/default.jpg'
        },
        {
          id: 'birthday',
          name: 'Aniversário',
          thumbnail: '/templates/birthday.jpg'
        },
        {
          id: 'wedding',
          name: 'Casamento',
          thumbnail: '/templates/wedding.jpg'
        },
        {
          id: 'corporate',
          name: 'Corporativo',
          thumbnail: '/templates/corporate.jpg'
        },
        {
          id: 'party',
          name: 'Festa',
          thumbnail: '/templates/party.jpg'
        }
      ];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar templates'
      );
    }
  }
);
