import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk para buscar todos os convidados de todos os eventos
export const fetchAllGuests = createAsyncThunk(
  'dashboard/fetchAllGuests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/guest/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar convidados');
    }
  }
);

// Thunk para buscar todos os eventos
export const fetchAllEvents = createAsyncThunk(
  'dashboard/fetchAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar eventos');
    }
  }
);

// Estado inicial
const initialState = {
  allGuests: [],
  allEvents: [],
  loading: false,
  error: null
};

// Slice do Redux
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Buscar todos os convidados
      .addCase(fetchAllGuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGuests.fulfilled, (state, action) => {
        state.loading = false;
        state.allGuests = action.payload.guests || [];
      })
      .addCase(fetchAllGuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Buscar todos os eventos
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.allEvents = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDashboardErrors } = dashboardSlice.actions;

export default dashboardSlice.reducer;