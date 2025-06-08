import { createAsyncThunk } from '@reduxjs/toolkit';
import { inviteService } from '../../services/api';
import { fetchGuestPublic, updateGuest } from '../../store/actions/guestActions';

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
  async (id, { rejectWithValue, dispatch }) => {
    try {

      const guestResponse = await dispatch(fetchGuestPublic(id));
      console.log('Guest response:', guestResponse);
      if (!guestResponse.payload) {
        throw new Error('Convidado não encontrado');
      }
      
      if (!guestResponse.payload.inviteId) {
        return {
          noInvite: true,
          guestId: id,
          guestName: guestResponse.name,
          message: 'Este convidado ainda não possui um convite associado. Por favor, entre em contato com o organizador do evento.'
        };
      }
      
      // Agora, buscar o convite usando o ID do convite
      const response = await inviteService.getPublicInvite(guestResponse.payload.inviteId);
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

// Nova ação assíncrona para vincular múltiplos convidados a um convite
export const linkGuestsToInvite = createAsyncThunk(
  'invites/linkGuestsToInvite',
  async ({ inviteId, guestIds }, { rejectWithValue, dispatch }) => {
    try {
      const results = [];
      
      // Atualizar cada convidado com o ID do convite
      for (const guestId of guestIds) {
        let guestData = {
          inviteId: inviteId
        };
        const response = await dispatch(updateGuest({ id: guestId, ...guestData })).unwrap();

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erro ao vincular convidado ${guestId}`);
        }

        const result = await response.json();
        results.push(result);
      }
      
      return {
        inviteId,
        guestIds,
        results
      };
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erro ao vincular convidados ao convite'
      );
    }
  }
);

// Nova ação assíncrona para obter o convite padrão de um evento
export const fetchDefaultInvite = createAsyncThunk(
  'invites/fetchDefaultInvite',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await inviteService.getInvites(eventId);
      
      // Se não houver convites, retornar null
      if (!response || response.length === 0) {
        return null;
      }
      
      // Retornar o primeiro convite como padrão
      return response[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convite padrão'
      );
    }
  }
);
