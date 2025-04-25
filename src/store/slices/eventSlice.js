import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchEvents, 
  fetchEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../actions/eventActions';

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    }
  },
  extraReducers: (builder) => {
    // Buscar todos os eventos
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.events = action.payload;
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Buscar um evento específico
    builder.addCase(fetchEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.currentEvent = action.payload;
    });
    builder.addCase(fetchEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Criar um evento
    builder.addCase(createEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.events.push(action.payload);
      state.currentEvent = action.payload;
    });
    builder.addCase(createEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Atualizar um evento
    builder.addCase(updateEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.events = state.events.map(event => 
        event.id === action.payload.id ? action.payload : event
      );
      state.currentEvent = action.payload;
    });
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Excluir um evento
    builder.addCase(deleteEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.events = state.events.filter(event => event.id !== action.payload);
      if (state.currentEvent && state.currentEvent.id === action.payload) {
        state.currentEvent = null;
      }
    });
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearEventError, clearCurrentEvent } = eventSlice.actions;

export default eventSlice.reducer;
