import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchInvites, 
  fetchInvite, 
  createInvite, 
  updateInvite, 
  deleteInvite,
  fetchPublicInvite,
  fetchTemplates
} from '../actions/inviteActions';

const initialState = {
  invites: [],
  currentInvite: null,
  publicInvite: null,
  templates: [],
  loading: false,
  error: null
};

const inviteSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    clearInviteError: (state) => {
      state.error = null;
    },
    clearCurrentInvite: (state) => {
      state.currentInvite = null;
    },
    clearPublicInvite: (state) => {
      state.publicInvite = null;
    }
  },
  extraReducers: (builder) => {
    // Buscar todos os convites de um evento
    builder.addCase(fetchInvites.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInvites.fulfilled, (state, action) => {
      state.loading = false;
      state.invites = action.payload;
    });
    builder.addCase(fetchInvites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Buscar um convite específico
    builder.addCase(fetchInvite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInvite.fulfilled, (state, action) => {
      state.loading = false;
      state.currentInvite = action.payload;
    });
    builder.addCase(fetchInvite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Criar um convite
    builder.addCase(createInvite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createInvite.fulfilled, (state, action) => {
      state.loading = false;
      state.invites.push(action.payload);
      state.currentInvite = action.payload;
    });
    builder.addCase(createInvite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Atualizar um convite
    builder.addCase(updateInvite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateInvite.fulfilled, (state, action) => {
      state.loading = false;
      state.invites = state.invites.map(invite => 
        invite.id === action.payload.id ? action.payload : invite
      );
      state.currentInvite = action.payload;
    });
    builder.addCase(updateInvite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Excluir um convite
    builder.addCase(deleteInvite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteInvite.fulfilled, (state, action) => {
      state.loading = false;
      state.invites = state.invites.filter(invite => invite.id !== action.payload);
      if (state.currentInvite && state.currentInvite.id === action.payload) {
        state.currentInvite = null;
      }
    });
    builder.addCase(deleteInvite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Buscar um convite público (para convidados)
    builder.addCase(fetchPublicInvite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPublicInvite.fulfilled, (state, action) => {
      state.loading = false;
      state.publicInvite = action.payload;
    });
    builder.addCase(fetchPublicInvite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Buscar templates de convites
    builder.addCase(fetchTemplates.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      state.loading = false;
      state.templates = action.payload;
    });
    builder.addCase(fetchTemplates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearInviteError, clearCurrentInvite, clearPublicInvite } = inviteSlice.actions;

export default inviteSlice.reducer;
