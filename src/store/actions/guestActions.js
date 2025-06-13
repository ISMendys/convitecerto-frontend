import { createAsyncThunk } from '@reduxjs/toolkit';
import { guestService } from '../../services/api';

// Ação assíncrona para buscar todos os convidados de um evento
export const fetchGuests = createAsyncThunk(
  'guests/fetchGuests',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await guestService.getGuests(eventId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convidados'
      );
    }
  }
);

// Ação assíncrona para buscar um convidado específico
export const fetchGuest = createAsyncThunk(
  'guests/fetchGuest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await guestService.getGuest(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convidado'
      );
    }
  }
);

// Ação assíncrona para buscar um convidado específico publico
export const fetchGuestPublic = createAsyncThunk(
  'guests/fetchGuest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await guestService.getGuestPublic(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar convidado'
      );
    }
  }
);

// Ação assíncrona para adicionar um convidado
export const createGuest = createAsyncThunk(
  'guests/createGuest',
  async (guestData, { rejectWithValue }) => {
    try {
      const response = await guestService.createGuest(guestData);
      return response;
    } catch (error) {
      return rejectWithValue(
        console.log(error),
        error.response?.data?.error || 'Erro ao adicionar convidado'
      );
    }
  }
);

// Ação assíncrona para atualizar um convidado
export const updateGuest = createAsyncThunk(
  'guests/updateGuest',
  async ({ id, ...guestData }, { rejectWithValue }) => {
    try {
      const response = await guestService.updateGuest(id, guestData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar convidado'
      );
    }
  }
);

// Ação assíncrona para atualizar apenas o status de um convidado
export const updateGuestStatus = createAsyncThunk(
  'guests/updateGuestStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await guestService.updateGuestStatus(id, { status });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar status do convidado'
      );
    }
  }
);

// Ação assíncrona para excluir um convidado
export const deleteGuest = createAsyncThunk(
  'guests/deleteGuest',
  async (id, { rejectWithValue }) => {
    try {
      await guestService.deleteGuest(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao excluir convidado'
      );
    }
  }
);

// Ação assíncrona para importar convidados
export const importGuests = createAsyncThunk(
  'guests/importGuests',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await guestService.importGuests(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao importar convidados'
      );
    }
  }
);

// Ação assíncrona para enviar convite via WhatsApp
export const sendInviteWhatsApp = createAsyncThunk(
  'guests/sendInviteWhatsApp',
  async ({ guestId, message, inviteLink }, { rejectWithValue }) => {
    const whatsappService = {}
    try {
      const response = await whatsappService.sendInvite(guestId, message, inviteLink);
      return { guestId, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao enviar convite via WhatsApp'
      );
    }
  }
);

// Ação assíncrona para enviar lembrete via WhatsApp
export const sendReminderWhatsApp = createAsyncThunk(
  'guests/sendReminderWhatsApp',
  async ({ guestId, message }, { rejectWithValue }) => {
    const whatsappService = {}

    try {
      const response = await whatsappService.sendReminder(guestId, message);
      return { guestId, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao enviar lembrete via WhatsApp'
      );
    }
  }
);

// Ação assíncrona para enviar mensagem em massa via WhatsApp
export const sendBulkWhatsApp = createAsyncThunk(
  'guests/sendBulkWhatsApp',
  async ({ eventId, message, filter }, { rejectWithValue }) => {
    const whatsappService = {}

    try {
      const response = await whatsappService.sendBulk(eventId, message, filter);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao enviar mensagens em massa via WhatsApp'
      );
    }
  }
);

// Ação assíncrona para submeter RSVP (para convidados)
export const submitRsvp = createAsyncThunk(
  'guests/submitRsvp',
  async ({ id, rsvpData }, { rejectWithValue }) => {
    try {
      const response = await guestService.submitRsvp(id, rsvpData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao confirmar presença'
      );
    }
  }
);

// Ação assíncrona para buscar histórico de RSVP de um convidado
export const fetchGuestRsvpHistory = createAsyncThunk(
  'guests/fetchGuestRsvpHistory',
  async (guestId, { rejectWithValue }) => {
    try {
      const response = await guestService.getGuestRsvpHistory(guestId);
      return { guestId, history: response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar histórico de RSVP'
      );
    }
  }
);
