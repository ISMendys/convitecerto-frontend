import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { WhatsApp as WhatsAppIcon, Send as SendIcon } from '@mui/icons-material';
import { sendInviteWhatsApp } from '../../store/actions/guestActions';

const WhatsAppIntegration = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { guests } = useSelector(state => state.guests);
  const { currentEvent } = useSelector(state => state.events);
  const { sendingMessage, messageStatus } = useSelector(state => state.guests);
  
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Gerar link de convite
  const generateInviteLink = (guestId) => {
    // No MVP, usamos um link fictício que seria substituído pelo link real em produção
    return `https://convites-app.com/rsvp/${guestId}`;
  };
  
  // Abrir diálogo para enviar convite
  const handleOpenDialog = (guest) => {
    setSelectedGuest(guest);
    
    // Mensagem padrão personalizada com nome do convidado e detalhes do evento
    const defaultMessage = `Olá ${guest.name}! Você está convidado(a) para ${currentEvent?.title || 'meu evento'} em ${currentEvent?.date ? new Date(currentEvent.date).toLocaleDateString('pt-BR') : 'data a confirmar'}.`;
    
    setMessage(defaultMessage);
    setDialogOpen(true);
  };
  
  // Fechar diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGuest(null);
    setMessage('');
  };
  
  // Enviar convite via WhatsApp
  const handleSendInvite = async () => {
    if (!selectedGuest || !message) return;
    
    const inviteLink = generateInviteLink(selectedGuest.id);
    
    try {
      await dispatch(sendInviteWhatsApp({
        guestId: selectedGuest.id,
        message,
        inviteLink
      })).unwrap();
      
      setSnackbarMessage('Convite enviado com sucesso via WhatsApp!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage(error || 'Erro ao enviar convite via WhatsApp');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Filtrar apenas convidados com número de telefone
  const guestsWithPhone = guests.filter(guest => guest.phone);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Integração com WhatsApp
      </Typography>
      
      <Typography variant="body1" paragraph>
        Envie convites e lembretes diretamente pelo WhatsApp para seus convidados. 
        Os convidados podem confirmar presença respondendo a mensagem com "sim" ou "não".
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Convidados com WhatsApp ({guestsWithPhone.length})
        </Typography>
        
        {guestsWithPhone.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center">
                Nenhum convidado com número de telefone cadastrado.
              </Typography>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(`/events/${eventId}/guests`)}
                >
                  Adicionar Convidados
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {guestsWithPhone.map(guest => (
              <Grid item xs={12} sm={6} md={4} key={guest.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {guest.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telefone: {guest.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {
                        guest.status === 'confirmed' ? 'Confirmado' :
                        guest.status === 'declined' ? 'Recusado' : 'Pendente'
                      }
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<WhatsAppIcon />}
                      fullWidth
                      onClick={() => handleOpenDialog(guest)}
                    >
                      Enviar Convite
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* Diálogo para enviar convite */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Enviar Convite via WhatsApp
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Enviar convite para: <strong>{selectedGuest?.name}</strong> ({selectedGuest?.phone})
          </DialogContentText>
          <TextField
            autoFocus
            label="Mensagem"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <DialogContentText variant="caption" sx={{ mt: 1 }}>
            Um link para confirmação de presença será adicionado automaticamente ao final da mensagem.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSendInvite} 
            color="primary" 
            variant="contained"
            startIcon={sendingMessage ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={sendingMessage || !message}
          >
            {sendingMessage ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para feedback */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WhatsAppIntegration;
