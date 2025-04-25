import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchGuests, 
  fetchGuest, 
  createGuest, 
  updateGuest, 
  updateGuestStatus,
  deleteGuest, 
  importGuests,
  sendInviteWhatsApp,
  sendReminderWhatsApp,
  sendBulkWhatsApp,
  submitRsvp
} from '../actions/guestActions';

const initialState = {
  guests: [],
  currentGuest: null,
  rsvpStats: {
    confirmed: 0,
    declined: 0,
    pending: 0,
    total: 0
  },
  loading: false,
  sendingMessage: false,
  error: null,
  messageStatus: null
};

const guestSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    clearGuestError: (state) => {
      state.error = null;
    },
    clearMessageStatus: (state) => {
      state.messageStatus = null;
    },
    clearCurrentGuest: (state) => {
      state.currentGuest = null;
    }
  },
  extraReducers: (builder) => {
    // Buscar convidados
    builder.addCase(fetchGuests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGuests.fulfilled, (state, action) => {
      state.loading = false;
      state.guests = action.payload;
      
      // Calcular estatísticas de RSVP
      state.rsvpStats = {
        confirmed: action.payload.filter(guest => guest.status === 'confirmed').length,
        declined: action.payload.filter(guest => guest.status === 'declined').length,
        pending: action.payload.filter(guest => guest.status === 'pending').length,
        total: action.payload.length
      };
    });
    builder.addCase(fetchGuests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Buscar um convidado
    builder.addCase(fetchGuest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGuest.fulfilled, (state, action) => {
      state.loading = false;
      state.currentGuest = action.payload;
    });
    builder.addCase(fetchGuest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Adicionar convidado
    builder.addCase(createGuest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createGuest.fulfilled, (state, action) => {
      state.loading = false;
      state.guests.push(action.payload);
      
      // Atualizar estatísticas
      state.rsvpStats.total += 1;
      state.rsvpStats.pending += 1;
    });
    builder.addCase(createGuest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Atualizar convidado
    builder.addCase(updateGuest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateGuest.fulfilled, (state, action) => {
      state.loading = false;
      
      // Encontrar o convidado antigo para atualizar estatísticas
      const oldGuest = state.guests.find(guest => guest.id === action.payload.id);
      
      // Atualizar a lista de convidados
      state.guests = state.guests.map(guest => 
        guest.id === action.payload.id ? action.payload : guest
      );
      
      // Atualizar o convidado atual se estiver sendo visualizado
      if (state.currentGuest && state.currentGuest.id === action.payload.id) {
        state.currentGuest = action.payload;
      }
      
      // Atualizar estatísticas de RSVP se o status mudou
      if (oldGuest && oldGuest.status !== action.payload.status) {
        // Decrementar contador do status antigo
        if (oldGuest.status === 'confirmed') state.rsvpStats.confirmed -= 1;
        else if (oldGuest.status === 'declined') state.rsvpStats.declined -= 1;
        else if (oldGuest.status === 'pending') state.rsvpStats.pending -= 1;
        
        // Incrementar contador do novo status
        if (action.payload.status === 'confirmed') state.rsvpStats.confirmed += 1;
        else if (action.payload.status === 'declined') state.rsvpStats.declined += 1;
        else if (action.payload.status === 'pending') state.rsvpStats.pending += 1;
      }
    });
    builder.addCase(updateGuest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Atualizar apenas o status do convidado
    builder.addCase(updateGuestStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateGuestStatus.fulfilled, (state, action) => {
      state.loading = false;
      
      // Encontrar o convidado antigo para atualizar estatísticas
      const oldGuest = state.guests.find(guest => guest.id === action.payload.id);
      
      // Atualizar a lista de convidados
      state.guests = state.guests.map(guest => 
        guest.id === action.payload.id ? action.payload : guest
      );
      
      // Atualizar o convidado atual se estiver sendo visualizado
      if (state.currentGuest && state.currentGuest.id === action.payload.id) {
        state.currentGuest = action.payload;
      }
      
      // Atualizar estatísticas de RSVP se o status mudou
      if (oldGuest && oldGuest.status !== action.payload.status) {
        // Decrementar contador do status antigo
        if (oldGuest.status === 'confirmed') state.rsvpStats.confirmed -= 1;
        else if (oldGuest.status === 'declined') state.rsvpStats.declined -= 1;
        else if (oldGuest.status === 'pending') state.rsvpStats.pending -= 1;
        
        // Incrementar contador do novo status
        if (action.payload.status === 'confirmed') state.rsvpStats.confirmed += 1;
        else if (action.payload.status === 'declined') state.rsvpStats.declined += 1;
        else if (action.payload.status === 'pending') state.rsvpStats.pending += 1;
      }
    });
    builder.addCase(updateGuestStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Excluir convidado
    builder.addCase(deleteGuest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteGuest.fulfilled, (state, action) => {
      state.loading = false;
      
      // Encontrar o convidado para atualizar estatísticas
      const guestToDelete = state.guests.find(guest => guest.id === action.payload);
      
      // Remover o convidado da lista
      state.guests = state.guests.filter(guest => guest.id !== action.payload);
      
      // Limpar o convidado atual se for o mesmo que está sendo excluído
      if (state.currentGuest && state.currentGuest.id === action.payload) {
        state.currentGuest = null;
      }
      
      // Atualizar estatísticas de RSVP
      if (guestToDelete) {
        state.rsvpStats.total -= 1;
        if (guestToDelete.status === 'confirmed') state.rsvpStats.confirmed -= 1;
        else if (guestToDelete.status === 'declined') state.rsvpStats.declined -= 1;
        else if (guestToDelete.status === 'pending') state.rsvpStats.pending -= 1;
      }
    });
    builder.addCase(deleteGuest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Importar convidados
    builder.addCase(importGuests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(importGuests.fulfilled, (state, action) => {
      state.loading = false;
      
      // Recarregar a lista completa após importação
      // Nota: Precisamos buscar os convidados novamente para ter os IDs corretos
      // Isso será feito na UI chamando fetchGuests após importação bem-sucedida
    });
    builder.addCase(importGuests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Enviar convite via WhatsApp
    builder.addCase(sendInviteWhatsApp.pending, (state) => {
      state.sendingMessage = true;
      state.error = null;
      state.messageStatus = null;
    });
    builder.addCase(sendInviteWhatsApp.fulfilled, (state, action) => {
      state.sendingMessage = false;
      state.messageStatus = {
        type: 'success',
        message: 'Convite enviado com sucesso via WhatsApp',
        guestId: action.payload.guestId
      };
    });
    builder.addCase(sendInviteWhatsApp.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.payload;
      state.messageStatus = {
        type: 'error',
        message: action.payload || 'Erro ao enviar convite via WhatsApp'
      };
    });
    
    // Enviar lembrete via WhatsApp
    builder.addCase(sendReminderWhatsApp.pending, (state) => {
      state.sendingMessage = true;
      state.error = null;
      state.messageStatus = null;
    });
    builder.addCase(sendReminderWhatsApp.fulfilled, (state, action) => {
      state.sendingMessage = false;
      state.messageStatus = {
        type: 'success',
        message: 'Lembrete enviado com sucesso via WhatsApp',
        guestId: action.payload.guestId
      };
    });
    builder.addCase(sendReminderWhatsApp.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.payload;
      state.messageStatus = {
        type: 'error',
        message: action.payload || 'Erro ao enviar lembrete via WhatsApp'
      };
    });
    
    // Enviar mensagem em massa via WhatsApp
    builder.addCase(sendBulkWhatsApp.pending, (state) => {
      state.sendingMessage = true;
      state.error = null;
      state.messageStatus = null;
    });
    builder.addCase(sendBulkWhatsApp.fulfilled, (state, action) => {
      state.sendingMessage = false;
      state.messageStatus = {
        type: 'success',
        message: `Mensagens enviadas com sucesso: ${action.payload.totalSent} de ${action.payload.totalSent + action.payload.totalFailed}`
      };
    });
    builder.addCase(sendBulkWhatsApp.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.payload;
      state.messageStatus = {
        type: 'error',
        message: action.payload || 'Erro ao enviar mensagens em massa via WhatsApp'
      };
    });
    
    // Submeter RSVP (para convidados)
    builder.addCase(submitRsvp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitRsvp.fulfilled, (state, action) => {
      state.loading = false;
      // Nota: Não atualizamos o estado aqui pois esta ação é chamada da página pública de RSVP
    });
    builder.addCase(submitRsvp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearGuestError, clearMessageStatus, clearCurrentGuest } = guestSlice.actions;

export default guestSlice.reducer;
