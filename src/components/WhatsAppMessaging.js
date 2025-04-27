import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { 
  sendInviteWhatsApp, 
  sendReminderWhatsApp, 
  sendBulkWhatsApp 
} from '../store/actions/guestActions'; // Assuming guestActions.js is in the correct path
import LoadingIndicator from './LoadingIndicator';

// Componente para envio de mensagens via WhatsApp
const WhatsAppMessaging = ({ 
  open, 
  onClose, 
  guests = [], // Ensure guests is always an array
  eventId, 
  eventTitle,
  inviteLink = null,
  messageType = 'invite' // 'invite', 'reminder', 'bulk'
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // Use a specific slice of state if available, e.g., state.whatsapp or state.guests.messaging
  const { loading: sending, error } = useSelector(state => state.guests); // Adjust selector if needed
  
  const [message, setMessage] = useState('');
  // const [sending, setSending] = useState(false); // Use Redux state for loading
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState(null); // Stores the 'data' part of the API response
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFilter, setSelectedFilter] = useState('all'); // Only relevant for bulk
  const [includeLink, setIncludeLink] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Definir mensagem padrão com base no tipo
  useEffect(() => {
    if (open) {
      let defaultMessage = '';
      const guestName = guests.length === 1 ? guests[0]?.name : '';
      
      switch (messageType) {
        case 'invite':
          defaultMessage = `Olá ${guestName}! Você está convidado para ${eventTitle}. Por favor, confirme sua presença.`;
          break;
        case 'reminder':
          defaultMessage = `Olá ${guestName}! Lembrando que ${eventTitle} está chegando. Esperamos você!`;
          break;
        case 'bulk':
          defaultMessage = `Olá! Informação importante sobre ${eventTitle}: `;
          break;
        default:
          defaultMessage = `Olá! Mensagem sobre ${eventTitle}.`;
      }
      
      setMessage(defaultMessage);
      setSuccess(false);
      setResults(null);
      // setSending(false); // Managed by Redux
      setIncludeLink(!!inviteLink); // Default to true only if inviteLink is provided
    }
  }, [open, messageType, eventTitle, guests, inviteLink]);

  // Handle Redux error state
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
  // Filtrar convidados (apenas para exibição no modo bulk)
  const guestsForDisplay = messageType === 'bulk' ? guests : guests.slice(0, 1);
  const guestsWithoutPhone = guestsForDisplay.filter(guest => !guest.phone);
  
  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setSnackbarMessage('Por favor, digite uma mensagem');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // setSending(true); // Managed by Redux
    
    try {
      let response;
      
      // Construir mensagem completa (com ou sem link)
      const finalMessage = includeLink && inviteLink 
        ? `${message}\n\n${inviteLink}` 
        : message;
      
      switch (messageType) {
        case 'invite':
          if (!guests[0]?.id) throw new Error('ID do convidado inválido.');
          response = await dispatch(sendInviteWhatsApp({
            guestId: guests[0].id,
            message: finalMessage,
            inviteLink: includeLink ? inviteLink : null
          })).unwrap(); // unwrap() throws error on rejection
          break;
          
        case 'reminder':
          if (!guests[0]?.id) throw new Error('ID do convidado inválido.');
          response = await dispatch(sendReminderWhatsApp({
            guestId: guests[0].id,
            message: finalMessage
          })).unwrap();
          break;
          
        case 'bulk':
          if (!eventId) throw new Error('ID do evento inválido.');
          const guestIdsToSend = guests.map(g => g.id);
          if (guestIdsToSend.length === 0) throw new Error('Nenhum convidado selecionado.');
          
          response = await dispatch(sendBulkWhatsApp({
            eventId,
            message: finalMessage,
            // Pass specific guest IDs instead of relying on filter in the backend for this component
            guestIds: guestIdsToSend, 
            // filter: selectedFilter !== 'all' ? { status: selectedFilter } : null // Filter logic might be better handled before opening the dialog
          })).unwrap();
          break;
          
        default:
          throw new Error('Tipo de mensagem não suportado');
      }
      
      // Handle success
      setSuccess(true);
      setResults(response.data); // Store the 'data' part from the API response
      setSnackbarMessage(response.message || 'Mensagem enviada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (err) {
      // Error is already handled by the useEffect hook listening to the Redux state
      // We might still want to log it or perform specific actions here
      console.error('Erro ao enviar mensagem:', err);
      // Snackbar is shown via useEffect [error]
    } finally {
      // setSending(false); // Managed by Redux
    }
  };
  
  // Fechar diálogo
  const handleClose = () => {
    if (!sending) {
      onClose(success); // Pass success status back if needed
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Renderizar resultados do envio em massa
  const renderBulkResults = () => {
    // Check results and results.results (which comes from backend data.results)
    if (!results || !results.results || messageType !== 'bulk') return null;
    
    const successCount = results.totalSent || 0;
    const failedCount = results.totalFailed || 0;
    const attemptedCount = results.totalAttempted || 0;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Resultados do Envio ({attemptedCount} tentativas)
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CheckIcon />} 
            label={`${successCount} enviadas`} 
            color="success" 
            variant="outlined" 
          />
          
          {failedCount > 0 && (
            <Chip 
              icon={<ErrorIcon />} 
              label={`${failedCount} falhas`} 
              color="error" 
              variant="outlined" 
            />
          )}
        </Box>
        
        {failedCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Algumas mensagens não puderam ser enviadas. Verifique os números ou o status da API.
          </Alert>
        )}
        
        {/* Detailed results list */}
        <Paper 
          variant="outlined" 
          sx={{ 
            maxHeight: 200, 
            overflow: 'auto',
            p: 1,
            borderColor: alpha(theme.palette.divider, 0.5)
          }}
        >
          {results.results.map((result, index) => (
            <Box 
              key={result.guestId || index} // Use guestId if available
              sx={{ 
                p: 1, 
                borderBottom: index < results.results.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {result.name}
              </Typography>
              
              {result.success ? (
                <Chip 
                  label="Enviado" 
                  size="small" 
                  color="success" 
                  variant='outlined'
                  sx={{ height: 24 }}
                />
              ) : (
                <Tooltip title={result.error || 'Erro ao enviar'}>
                  <Chip 
                    label="Falha" 
                    size="small" 
                    color="error" 
                    variant='outlined'
                    sx={{ height: 24 }}
                  />
                </Tooltip>
              )}
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  const isSingleGuestWithoutPhone = messageType !== 'bulk' && guests.length === 1 && !guests[0]?.phone;
  
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.success.main, 
          color: 'white',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsAppIcon sx={{ mr: 1 }} />
              {messageType === 'bulk' 
                ? 'Enviar Mensagem em Massa'
                : messageType === 'invite'
                  ? 'Enviar Convite via WhatsApp'
                  : 'Enviar Lembrete via WhatsApp'
              }
            </Box>
            
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: 'white' }}
              disabled={sending}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {messageType === 'bulk' ? (
            <DialogContentText sx={{ mb: 2 }}>
              Envie uma mensagem para {guestsForDisplay.length} convidados selecionados.
              {guestsWithoutPhone.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {guestsWithoutPhone.length} convidado(s) não possui(em) número de telefone e não receberá(ão) a mensagem.
                </Alert>
              )}
            </DialogContentText>
          ) : (
            <DialogContentText sx={{ mb: 2 }}>
              Envie uma mensagem para <strong>{guestsForDisplay[0]?.name || 'Convidado'}</strong> via WhatsApp.
              {isSingleGuestWithoutPhone && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Este convidado não possui número de telefone cadastrado.
                </Alert>
              )}
            </DialogContentText>
          )}
          
          {/* Filter might be less useful if guests are pre-filtered before opening dialog */}
          {/* {messageType === 'bulk' && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="filter-label">Filtrar convidados</InputLabel>
              <Select
                labelId="filter-label"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                label="Filtrar convidados"
              >
                <MenuItem value="all">Todos os selecionados</MenuItem>
                <MenuItem value="confirmed">Apenas confirmados</MenuItem>
                <MenuItem value="pending">Apenas pendentes</MenuItem>
                <MenuItem value="declined">Apenas recusados</MenuItem>
                <MenuItem value="withPhone">Apenas com telefone</MenuItem>
              </Select>
            </FormControl>
          )} */}
          
          <TextField
            autoFocus
            label="Mensagem"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending || success}
            sx={{ mb: 2 }}
          />
          
          {inviteLink && messageType === 'invite' && (
            <FormControlLabel
              control={
                <Switch 
                  checked={includeLink} 
                  onChange={(e) => setIncludeLink(e.target.checked)}
                  color="primary"
                  disabled={sending || success}
                />
              }
              label="Incluir link do convite"
              sx={{ mb: 2 }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<SettingsIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="small"
              disabled={sending || success}
            >
              {showAdvanced ? 'Ocultar opções' : 'Mostrar opções'}
            </Button>
            
            <Chip
              icon={<InfoIcon />}
              label={`${message.length} caracteres`}
              variant="outlined"
              size="small"
              color={message.length > 1600 ? 'error' : 'default'} // WhatsApp limit is large, but good to show
            />
          </Box>
          
          {showAdvanced && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
              <Typography variant="subtitle2" gutterBottom>
                Opções Avançadas
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                A API está configurada para enviar mensagens com um pequeno delay para simular digitação e evitar bloqueios.
              </Alert>
              
              <Typography variant="body2" color="text.secondary">
                Certifique-se de que sua instância da Evolution API esteja conectada e funcionando corretamente antes de enviar.
              </Typography>
            </Paper>
          )}
          
          {/* Show results after successful send */}
          {success && messageType === 'bulk' && renderBulkResults()}
          {success && messageType !== 'bulk' && (
             <Alert severity="success" sx={{ mt: 2 }}>Mensagem enviada com sucesso!</Alert>
          )}

        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            color="inherit"
            disabled={sending}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {success ? 'Fechar' : 'Cancelar'}
          </Button>
          
          {!success && (
            <Button 
              onClick={handleSendMessage} 
              variant="contained" 
              color="success"
              disabled={sending || !message.trim() || isSingleGuestWithoutPhone}
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`,
                background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
              }}
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for general messages/errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Global loading indicator (if needed, or rely on button state) */}
      {/* <LoadingIndicator open={sending} /> */}
    </>
  );
};

// --- WhatsAppSettings Component (from original file, unchanged for now) ---

const WhatsAppSettings = ({ open, onClose }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [instanceStatus, setInstanceStatus] = useState(null);
  
  // Function to fetch instance status from backend
  const checkInstanceStatus = async () => {
    setLoading(true);
    try {
      // Replace with axios call if using it consistently
      const response = await fetch('/api/whatsapp/instance-status'); 
      const data = await response.json();
      
      if (data.success) {
        setInstanceStatus(data.status); // Expecting 'connected', 'disconnected', etc.
        setSnackbarMessage('Status da instância atualizado: ' + data.status);
        setSnackbarSeverity('success');
      } else {
        throw new Error(data.message || 'Erro ao buscar status');
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err);
      setInstanceStatus('error');
      setSnackbarMessage(err.message || 'Erro ao buscar status da instância');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Function to configure webhook via backend
  const handleConfigureWebhook = async () => {
    if (!webhookUrl.trim()) {
      setSnackbarMessage('Por favor, insira a URL do webhook');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      // Replace with axios call if using it consistently
      const response = await fetch('/api/whatsapp/configure-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await response.json();

      if (data.success) {
        setSnackbarMessage('Webhook configurado com sucesso!');
        setSnackbarSeverity('success');
      } else {
        throw new Error(data.message || 'Erro ao configurar webhook');
      }
    } catch (err) {
      console.error("Erro ao configurar webhook:", err);
      setSnackbarMessage(err.message || 'Erro ao configurar webhook');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Fetch status when dialog opens
  useEffect(() => {
    if (open) {
      checkInstanceStatus();
      // Optionally fetch current webhook URL if there's an endpoint for it
      // setWebhookUrl(currentWebhookUrl);
    }
  }, [open]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusChip = () => {
    if (instanceStatus === 'connected' || instanceStatus === 'open') {
      return <Chip label="Conectado" color="success" icon={<CheckIcon />} />;
    } else if (instanceStatus === 'connecting') {
      return <Chip label="Conectando..." color="warning" icon={<CircularProgress size={16} />} />;
    } else if (instanceStatus === 'error') {
      return <Chip label="Erro" color="error" icon={<ErrorIcon />} />;
    } else {
      return <Chip label={instanceStatus || "Desconhecido"} color="default" icon={<InfoIcon />} />;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} />
              Configurações do WhatsApp
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: 'white' }} disabled={loading}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Verifique o status da sua instância da Evolution API e configure o webhook para receber atualizações.
          </DialogContentText>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Status da Instância</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getStatusChip()}
              <Button 
                variant="outlined" 
                onClick={checkInstanceStatus} 
                disabled={loading}
                size="small"
              >
                Verificar Novamente
              </Button>
            </Box>
            {instanceStatus !== 'connected' && instanceStatus !== 'open' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                A instância não está conectada. Verifique a Evolution API e tente conectar o WhatsApp novamente.
              </Alert>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Configuração do Webhook</Typography>
            <TextField
              label="URL do Webhook"
              fullWidth
              variant="outlined"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-backend.com/api/whatsapp/webhook"
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={handleConfigureWebhook} 
              disabled={loading || !webhookUrl.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
            >
              {loading ? 'Salvando...' : 'Salvar Webhook'}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Esta URL será chamada pela Evolution API para enviar atualizações de status das mensagens.
            </Typography>
          </Paper>

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for settings messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Export both components if they are in the same file, otherwise adjust
// export { WhatsAppMessaging, WhatsAppSettings }; 
export default WhatsAppMessaging; // Assuming WhatsAppSettings is separate or not the main export

