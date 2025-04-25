import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { 
  sendInviteWhatsApp, 
  sendReminderWhatsApp, 
  sendBulkWhatsApp,
  fetchGuests
} from '../../store/actions/guestActions';
import { fetchEvent } from '../../store/actions/eventActions';
import { clearMessageStatus } from '../../store/slices/guestSlice';

// Componente de abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`whatsapp-tabpanel-${index}`}
      aria-labelledby={`whatsapp-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WhatsAppDashboard = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { guests, rsvpStats, sendingMessage, messageStatus } = useSelector(state => state.guests);
  const { currentEvent } = useSelector(state => state.events);
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('invite'); // 'invite', 'reminder', 'bulk'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Carregar dados do evento e convidados
  useEffect(() => {
    dispatch(fetchEvent(eventId));
    dispatch(fetchGuests(eventId));
  }, [dispatch, eventId]);
  
  // Exibir mensagem de status quando disponível
  useEffect(() => {
    if (messageStatus) {
      setSnackbarOpen(true);
    }
  }, [messageStatus]);
  
  // Manipular mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Gerar link de convite
  const generateInviteLink = (guestId) => {
    // No MVP, usamos um link fictício que seria substituído pelo link real em produção
    return `https://convites-app.com/rsvp/${guestId}`;
  };
  
  // Abrir diálogo para enviar convite individual
  const handleOpenInviteDialog = (guest) => {
    setSelectedGuest(guest);
    setDialogType('invite');
    
    // Mensagem padrão personalizada com nome do convidado e detalhes do evento
    const defaultMessage = `Olá ${guest.name}! Você está convidado(a) para ${currentEvent?.title || 'meu evento'} em ${currentEvent?.date ? new Date(currentEvent.date).toLocaleDateString('pt-BR') : 'data a confirmar'}.`;
    
    setInviteMessage(defaultMessage);
    setDialogOpen(true);
  };
  
  // Abrir diálogo para enviar lembrete individual
  const handleOpenReminderDialog = (guest) => {
    setSelectedGuest(guest);
    setDialogType('reminder');
    
    // Mensagem padrão personalizada com nome do convidado e detalhes do evento
    const defaultMessage = `Olá ${guest.name}! Não esqueça do evento ${currentEvent?.title || 'meu evento'} em ${currentEvent?.date ? new Date(currentEvent.date).toLocaleDateString('pt-BR') : 'data a confirmar'}.`;
    
    setReminderMessage(defaultMessage);
    setDialogOpen(true);
  };
  
  // Abrir diálogo para enviar mensagem em massa
  const handleOpenBulkDialog = () => {
    setDialogType('bulk');
    
    // Mensagem padrão para envio em massa
    const defaultMessage = `Olá! Não esqueça do evento ${currentEvent?.title || 'meu evento'} em ${currentEvent?.date ? new Date(currentEvent.date).toLocaleDateString('pt-BR') : 'data a confirmar'}.`;
    
    setBulkMessage(defaultMessage);
    setDialogOpen(true);
  };
  
  // Fechar diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGuest(null);
  };
  
  // Enviar convite via WhatsApp
  const handleSendInvite = async () => {
    if (!selectedGuest || !inviteMessage) return;
    
    const inviteLink = generateInviteLink(selectedGuest.id);
    
    try {
      await dispatch(sendInviteWhatsApp({
        guestId: selectedGuest.id,
        message: inviteMessage,
        inviteLink
      })).unwrap();
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
    }
  };
  
  // Enviar lembrete via WhatsApp
  const handleSendReminder = async () => {
    if (!selectedGuest || !reminderMessage) return;
    
    try {
      await dispatch(sendReminderWhatsApp({
        guestId: selectedGuest.id,
        message: reminderMessage
      })).unwrap();
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
    }
  };
  
  // Enviar mensagem em massa via WhatsApp
  const handleSendBulk = async () => {
    if (!bulkMessage) return;
    
    // Preparar filtro com base na seleção do usuário
    const filter = statusFilter !== 'all' ? { status: statusFilter } : undefined;
    
    try {
      await dispatch(sendBulkWhatsApp({
        eventId,
        message: bulkMessage,
        filter
      })).unwrap();
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao enviar mensagens em massa:', error);
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearMessageStatus());
  };
  
  // Filtrar convidados com número de telefone
  const guestsWithPhone = guests.filter(guest => guest.phone);
  
  // Contar convidados por status
  const confirmedWithPhone = guestsWithPhone.filter(guest => guest.status === 'confirmed').length;
  const pendingWithPhone = guestsWithPhone.filter(guest => guest.status === 'pending').length;
  const declinedWithPhone = guestsWithPhone.filter(guest => guest.status === 'declined').length;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Integração com WhatsApp
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => dispatch(fetchGuests(eventId))}
        >
          Atualizar
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total com WhatsApp
              </Typography>
              <Typography variant="h4">
                {guestsWithPhone.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                de {guests.length} convidados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.lighter' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confirmados
              </Typography>
              <Typography variant="h4" color="success.main">
                {confirmedWithPhone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                via WhatsApp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.lighter' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pendentes
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingWithPhone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                aguardando resposta
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'error.lighter' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Recusados
              </Typography>
              <Typography variant="h4" color="error.main">
                {declinedWithPhone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                via WhatsApp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="WhatsApp integration tabs">
          <Tab label="Envio Individual" />
          <Tab label="Envio em Massa" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
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
                    },
                    borderLeft: '4px solid',
                    borderColor: 
                      guest.status === 'confirmed' ? 'success.main' :
                      guest.status === 'declined' ? 'error.main' : 'warning.main'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {guest.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telefone: {guest.phone}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={
                          guest.status === 'confirmed' ? 'Confirmado' :
                          guest.status === 'declined' ? 'Recusado' : 'Pendente'
                        }
                        color={
                          guest.status === 'confirmed' ? 'success' :
                          guest.status === 'declined' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<WhatsAppIcon />}
                      fullWidth
                      onClick={() => handleOpenInviteDialog(guest)}
                    >
                      Convite
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<SendIcon />}
                      fullWidth
                      onClick={() => handleOpenReminderDialog(guest)}
                    >
                      Lembrete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Envio em Massa
          </Typography>
          <Typography variant="body1" paragraph>
            Envie mensagens para todos os convidados ou filtre por status de confirmação.
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filtrar por Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filtrar por Status"
                >
                  <MenuItem value="all">Todos com WhatsApp ({guestsWithPhone.length})</MenuItem>
                  <MenuItem value="confirmed">Confirmados ({confirmedWithPhone})</MenuItem>
                  <MenuItem value="pending">Pendentes ({pendingWithPhone})</MenuItem>
                  <MenuItem value="declined">Recusados ({declinedWithPhone})</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GroupIcon />}
                fullWidth
                onClick={handleOpenBulkDialog}
                disabled={guestsWithPhone.length === 0}
              >
                Enviar Mensagem em Massa
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Typography variant="body2" color="textSecondary">
          Dica: O envio em massa é ideal para lembretes antes do evento ou para solicitar confirmações de convidados pendentes.
        </Typography>
      </TabPanel>
      
      {/* Diálogo para enviar mensagens */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'invite' && 'Enviar Convite via WhatsApp'}
          {dialogType === 'reminder' && 'Enviar Lembrete via WhatsApp'}
          {dialogType === 'bulk' && 'Enviar Mensagem em Massa'}
        </DialogTitle>
        <DialogContent>
          {(dialogType === 'invite' || dialogType === 'reminder') && (
            <DialogContentText paragraph>
              Enviar para: <strong>{selectedGuest?.name}</strong> ({selectedGuest?.phone})
            </DialogContentText>
          )}
          
          {dialogType === 'bulk' && (
            <DialogContentText paragraph>
              Enviar para: <strong>
                {statusFilter === 'all' && `Todos os convidados com WhatsApp (${guestsWithPhone.length})`}
                {statusFilter === 'confirmed' && `Convidados confirmados (${confirmedWithPhone})`}
                {statusFilter === 'pending' && `Convidados pendentes (${pendingWithPhone})`}
                {statusFilter === 'declined' && `Convidados que recusaram (${declinedWithPhone})`}
              </strong>
            </DialogContentText>
          )}
          
          <TextField
            autoFocus
            label="Mensagem"
            multiline
            rows={4}
            value={
              dialogType === 'invite' ? inviteMessage :
              dialogType === 'reminder' ? reminderMessage : bulkMessage
            }
            onChange={(e) => {
              if (dialogType === 'invite') setInviteMessage(e.target.value);
              else if (dialogType === 'reminder') setReminderMessage(e.target.value);
              else setBulkMessage(e.target.value);
            }}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          
          {dialogType === 'invite' && (
            <DialogContentText variant="caption" sx={{ mt: 1 }}>
              Um link para confirmação de presença será adicionado automaticamente ao final da mensagem.
            </DialogContentText>
          )}
          
          {dialogType === 'bulk' && (
            <DialogContentText variant="caption" sx={{ mt: 1 }}>
              As mensagens serão personalizadas com o nome de cada convidado automaticamente.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={
              dialogType === 'invite' ? handleSendInvite :
              dialogType === 'reminder' ? handleSendReminder : handleSendBulk
            }
            color="primary" 
            variant="contained"
            startIcon={sendingMessage ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={sendingMessage || (
              dialogType === 'invite' ? !inviteMessage :
              dialogType === 'reminder' ? !reminderMessage : !bulkMessage
            )}
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={messageStatus?.type === 'success' ? 'success' : 'error'}
        >
          {messageStatus?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WhatsAppDashboard;
