import { createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '../../services/api';

// Ação assíncrona para buscar todos os eventos
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar eventos'
      );
    }
  }
);

// Ação assíncrona para buscar um evento específico
export const fetchEvent = createAsyncThunk(
  'events/fetchEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvent(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao buscar evento'
      );
    }
  }
);

// Ação assíncrona para criar um evento
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao criar evento'
      );
    }
  }
);

// Ação assíncrona para atualizar um evento
export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    console.log('Dados da localização dentro do dispatch:', eventData);

    try {
      const response = await eventService.updateEvent(id, eventData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao atualizar evento'
      );
    }
  }
);

// Ação assíncrona para excluir um evento
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erro ao excluir evento'
      );
    }
  }
);
