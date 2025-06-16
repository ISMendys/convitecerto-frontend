import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpOutlineIcon,
  Cancel as CancelIcon,
  Notes as NotesIcon,
  Group as GroupIcon,
  Image as ImageIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { createGuest, updateGuest, fetchGuest, deleteGuest, fetchGuestRsvpHistory, fetchGuests } from '../../store/actions/guestActions';
import { fetchInvites, fetchDefaultInvite } from '../../store/actions/inviteActions';
import { clearCurrentGuest } from '../../store/slices/guestSlice';
import ImageUploadFieldBase64 from '../../components/ImageUploadField';
// Componentes estilizados
import StyledButton from '../../components/StyledButton';
import ConfirmDialog from '../../components/ConfirmDialog';
import RsvpDetailsCard from '../../components/guests/RsvpDetailsCard';
import InviteSelector from '../../components/guests/InviteSelector';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import EventSelectorModal from '../../components//EventSelectorModal';
import { fetchEvent } from '../../store/actions/eventActions';


const GuestForm = ({ eventPassedID }) => {
  const { eventId, guestId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentGuest, loading, error, rsvpHistory } = useSelector(state => state.guests);
  const { currentEvent } = useSelector(state => state.events);
  const { invites, defaultInvite, loading: invitesLoading } = useSelector(state => state.invites);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: true,
    status: 'pending',
    plusOne: false,
    plusOneName: '',
    notes: '',
    group: 'default',
    imageUrl: { type: 'url', url: '', base64: '' },
    inviteId: null
  });

  const [showEventSelector, setShowEventSelector] = useState(false);
  
  const [imageError, setImageError] = useState('');
  const [inviteError, setInviteError] = useState(false);
  const [autoLinkDialogOpen, setAutoLinkDialogOpen] = useState(false);

  const [currentEventId, setCurrentEventId] = useState(eventId);
  
  const [messageLoading, setMessageLoading] = useState('Carregando dados...');
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];
  
        if (guestId) {
          dispatch(clearCurrentGuest());
          promises.push(dispatch(fetchGuest(guestId)));
          promises.push(dispatch(fetchGuestRsvpHistory(guestId)));
        }
  
        if (eventId) {
          promises.push(dispatch(fetchInvites(eventId)));
          promises.push(dispatch(fetchDefaultInvite(eventId)));
        }
  
        await Promise.all(promises);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch, guestId, eventId]);
  
  useEffect(() => {
    if (!eventId && !currentEventId && !currentEvent) {
      setShowEventSelector(true);
      return;
    }
    setShowEventSelector(false);
    // const fetchData = async () => {
    //   setIsLoading(true);
    //   try {
    //     await Promise.all([
    //       dispatch(fetchGuests(eventId || currentEventId || currentEvent?.id)),
    //       dispatch(fetchEvent(selectedEventId)),
    //       dispatch(fetchInvites(eventId || currentEventId || currentEvent?.id))
    //     ]);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchData();
  }, [dispatch, currentEventId]);

  // Preencher formulário com dados do convidado se estiver editando
  useEffect(() => {
    if (guestId && currentGuest) {
      // Processar a imagem para o novo formato
      let imageData = { type: 'url', url: '', base64: '' };
      
      if (currentGuest.imageUrl) {
        if (typeof currentGuest.imageUrl === 'string') {
          // Se for uma URL ou base64
          if (currentGuest.imageUrl.startsWith('data:image')) {
            imageData = { type: 'file', base64: currentGuest.imageUrl, url: '' };
          } else {
            imageData = { type: 'url', url: currentGuest.imageUrl, base64: '' };
          }
        } else if (typeof currentGuest.imageUrl === 'object') {
          imageData = currentGuest.imageUrl;
        }
      }

      setFormData({
        name: currentGuest.name || '',
        email: currentGuest.email || '',
        phone: currentGuest.phone || '',
        whatsapp: currentGuest.whatsapp !== false,
        status: currentGuest.status || 'pending',
        plusOne: currentGuest.plusOne || false,
        plusOneName: currentGuest.plusOneName || '',
        notes: currentGuest.notes || '',
        group: currentGuest.group || 'default',
        imageUrl: imageData,
        inviteId: currentGuest.inviteId || null
      });
    } else if (!guestId && defaultInvite && !formData.inviteId) {
      // Se estiver criando um novo convidado e houver um convite padrão,
      // perguntar ao usuário se deseja vincular automaticamente
      setAutoLinkDialogOpen(true);
    }
  }, [guestId, currentGuest, defaultInvite]);

  const handleEventSelect = (selectedEventId, eventData) => {
    setShowEventSelector(false);
    setCurrentEventId(selectedEventId);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchGuests(selectedEventId)),
          dispatch(fetchEvent(selectedEventId)),
          dispatch(fetchInvites(selectedEventId))
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  const validateGuestForm = (formData) => {
    const errors = {};
  
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Nome é obrigatório';
    }
  
    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = 'Telefone é obrigatório';
    }
  
    // if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
    //   errors.email = 'E-mail inválido';
    // }

    return errors;
  };

  // Exibir erro se houver
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipular mudança na imagem
  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData
    }));
  };

  // Manipular mudança no convite selecionado
  const handleInviteChange = (inviteId) => {
    setFormData(prev => ({
      ...prev,
      inviteId
    }));
    setInviteError(false);
  };

  // Manipular vinculação automática ao convite padrão
  const handleAutoLink = (confirm) => {
    if (confirm && defaultInvite) {
      setFormData(prev => ({
        ...prev,
        inviteId: defaultInvite?.id
      }));
    }
    setAutoLinkDialogOpen(false);
  };

  // Salvar convidado
  const handleSave = async () => {
    setMessageLoading('Salvando...');
    setIsLoading(true);
    const errors = validateGuestForm(formData);

    if (Object.keys(errors).length > 0) {
      const firstErrorMessage = Object.values(errors)[0];
      setSnackbarMessage(firstErrorMessage);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setIsLoading(false);
      return;
    }
    let imageData = null;
    
    if (formData.imageUrl.type === 'url' && formData.imageUrl.url) {
      imageData = formData.imageUrl.url;
    } else if (formData.imageUrl.type === 'file' && formData.imageUrl.base64) {
      imageData = formData.imageUrl.base64;
    }

    // Verificar se um convite foi selecionado
    // if (!formData.inviteId) {
    //   setIsLoading(false);
    //   setInviteError(true);
    //   setSnackbarMessage('Por favor, selecione um convite para este convidado');
    //   setSnackbarSeverity('warning');
    //   setSnackbarOpen(true);
    //   return;
    // }
    
    try {
      console.log(eventId , currentEvent?.id , eventPassedID,'TO AQUIIIIIIIIIIIIIIIIIIIIIIII')
      let guestData = {
        ...formData,
        imageUrl: imageData,
        eventId: eventId || currentEventId || currentEvent?.id || eventPassedID,
      };
      console.log(guestData, 'guestData')
      if (guestId) {
        await dispatch(updateGuest({ id: guestId, ...guestData })).unwrap();
        setSnackbarMessage('Convidado atualizado com sucesso!');
      } else {
        await dispatch(createGuest(guestData)).unwrap();
        setSnackbarMessage('Convidado adicionado com sucesso!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests`);
    } catch (err) {
      const errorMessage = err?.message || err || 'Erro ao salvar convidado';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Excluir convidado
  const handleDelete = async () => {
    setMessageLoading('Excluindo...');
    setIsLoading(false);
    try {
      await dispatch(deleteGuest(guestId)).unwrap();
      setSnackbarMessage('Convidado excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests`);

    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir convidado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }finally {
      setIsLoading(false);
    }
    setDeleteDialogOpen(false);
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Confirmar cancelamento
  const handleCancelConfirm = () => {
    setConfirmDialogOpen(true);
  };
  
  // Cancelar criação/edição
  const handleCancel = () => {
    navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests`);
  };
  
  // Grupos disponíveis
  const groups = [
    { id: 'default', name: 'Geral' },
    { id: 'family', name: 'Família' },
    { id: 'friends', name: 'Amigos' },
    { id: 'colleagues', name: 'Colegas de Trabalho' },
    { id: 'vip', name: 'VIP' }
  ];
  
  // Status disponíveis
  const statuses = [
    { id: 'pending', name: 'Pendente', color: theme.palette.warning.main },
    { id: 'confirmed', name: 'Confirmado', color: theme.palette.success.main },
    { id: 'declined', name: 'Recusado', color: theme.palette.error.main }
  ];
  
  // Renderizar tela de carregamento
  if (loading && guestId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        pt: 3,
        pb: 6,
        display: 'flex',
        justifyContent: 'center' // Centraliza todo o conteúdo horizontalmente
      }}
    >
      <EventSelectorModal
        open={showEventSelector}
        onClose={() => setShowEventSelector(false)}
        onSelectEvent={handleEventSelect}
        apiEndpoint="/api/events" 
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header com botão voltar à esquerda e título à direita */}
        <Box sx={{ 
          mb: 4,
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.1)})`
          }
        }}>
          {/* Botão Voltar à esquerda */}
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests`)}
            sx={{ 
              borderRadius: 10,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                transform: 'translateX(-4px)'
              }
            }}
          >
            Voltar
          </StyledButton>
          
          {/* Título e subtítulo à direita */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: theme.palette.primary.main,
                textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 'auto',
                  right: 0,
                  width: '40%',
                  height: '3px',
                  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                }
              }}
            >
              {guestId ? 'Editar Convidado' : 'Adicionar Convidado'}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.6
              }}
            >
              {guestId 
                ? 'Atualize as informações do convidado' 
                : 'Preencha os dados do novo convidado'}
            </Typography>
          </Box>
        </Box>
        
        {/* Seção de Informações Básicas */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
          }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2
              }}
            >
              <PersonIcon />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              Informações Básicas
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                    <PersonIcon />
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <TextField
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: theme.palette.info.main }}>
                      <MailIcon />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              />
              
              <TextField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: theme.palette.success.main }}>
                      <PhoneIcon />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.whatsapp}
                  onChange={handleChange}
                  name="whatsapp"
                  color="success"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WhatsAppIcon sx={{ color: '#25D366', mr: 1 }} />
                  <Typography>Este telefone é WhatsApp</Typography>
                </Box>
              }
            />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <FormControl 
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  // startAdornment={
                  //   <Box sx={{ 
                  //     display: 'flex',
                  //     alignItems: 'center',
                  //     ml: -0.5,
                  //     mr: 1
                  //   }}>
                  //     {formData.status === 'confirmed' && <CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
                  //     {formData.status === 'pending' && <HelpOutlineIcon sx={{ color: theme.palette.warning.main }} />}
                  //     {formData.status === 'declined' && <CancelIcon sx={{ color: theme.palette.error.main }} />}
                  //   </Box>
                  // }
                >
                  {statuses.map(status => (
                    <MenuItem key={status?.id} value={status?.id}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: status.color
                      }}>
                        {status?.id === 'confirmed' && <CheckCircleIcon sx={{ mr: 1 }} />}
                        {status?.id === 'pending' && <HelpOutlineIcon sx={{ mr: 1 }} />}
                        {status?.id === 'declined' && <CancelIcon sx={{ mr: 1 }} />}
                        {status.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl 
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              >
                <InputLabel id="group-label">Grupo</InputLabel>
                <Select
                  labelId="group-label"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  label="Grupo"
                  startAdornment={
                    <Box sx={{ mr: 1, ml: -0.5, color: theme.palette.primary.main }}>
                      <GroupIcon />
                    </Box>
                  }
                >
                  {groups.map(group => (
                    <MenuItem key={group?.id} value={group?.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.plusOne}
                  onChange={handleChange}
                  name="plusOne"
                  color="primary"
                />
              }
              label="Permitir acompanhante"
            />
            
            {formData.plusOne && (
              <TextField
                label="Nome do Acompanhante (opcional)"
                name="plusOneName"
                value={formData.plusOneName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Deixe em branco para que o convidado preencha"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              />
            )}
            
            <TextField
              label="Observações"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              // rows={3} 
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, mt: 1, color: theme.palette.text.secondary }}>
                    <NotesIcon />
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            />
          </Box>
        </Paper>
        
        {/* Seção de Convite */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: inviteError ? `1px solid ${theme.palette.error.main}` : '1px solid #e0e0e0',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }
          }}
        >
          <InviteSelector 
            value={formData.inviteId} 
            onChange={handleInviteChange} 
            eventId={eventId}
            error={inviteError}
            helperText="É necessário vincular o convidado a um convite para que ele possa acessar a página de RSVP"
          />
        </Paper>
        
        {/* Seção de Imagem */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
          }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                mr: 2
              }}
            >
              <ImageIcon />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.secondary.main
              }}
            >
              Imagem do Convidado (opcional)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Adicione uma foto do convidado para personalizar a experiência
            </Typography>
            
            <ImageUploadFieldBase64
              value={formData.imageUrl}
              onChange={handleImageChange}
              error={imageError}
              setError={setImageError}
              aspectRatio={1}
              maxWidth={800}
              maxHeight={800}
            />
          </Box>
        </Paper>
        
        {/* Seção de RSVP (apenas na edição) */}
        {guestId && currentGuest && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
            }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  mr: 2
                }}
              >
                <EventNoteIcon />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.info.main
                }}
              >
                Detalhes do RSVP
              </Typography>
            </Box>
            
            <RsvpDetailsCard 
              guest={currentGuest} 
              rsvpHistory={rsvpHistory || []} 
            />
          </Paper>
        )}
        
        {/* Botões de ação */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4
        }}>
          <Box>
            {guestId && (
              <StyledButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ 
                  borderRadius: 2,
                  mr: 2
                }}
              >
                Excluir
              </StyledButton>
            )}
            
            <StyledButton
              variant="outlined"
              color="inherit"
              onClick={handleCancelConfirm}
              sx={{ 
                borderRadius: 2
              }}
            >
              Cancelar
            </StyledButton>
          </Box>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              '&:hover': {
                boxShadow: '0 6px 16px rgba(94, 53, 177, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {guestId ? 'Atualizar' : 'Adicionar'} Convidado
          </StyledButton>
        </Box>
      </Container>
      
      {/* Diálogo de confirmação para cancelar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Cancelar edição"
        content="Tem certeza que deseja cancelar? Todas as alterações serão perdidas."
        onConfirm={handleCancel}
        onCancel={() => setConfirmDialogOpen(false)}
      />
      
      {/* Diálogo de confirmação para excluir */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir convidado"
        content="Tem certeza que deseja excluir este convidado? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
      
      {/* Diálogo para vincular automaticamente ao convite padrão */}
      <Dialog
        open={autoLinkDialogOpen}
        onClose={() => setAutoLinkDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight={600} color="primary.main">
            Vincular ao Convite Padrão
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText>
            Deseja vincular este convidado automaticamente ao convite padrão do evento?
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                O convidado precisa estar vinculado a um convite para poder acessar a página de RSVP.
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <StyledButton 
            variant="outlined" 
            color="inherit" 
            onClick={() => handleAutoLink(false)}
          >
            Não, escolherei manualmente
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="primary" 
            onClick={() => handleAutoLink(true)}
            disabled={!defaultInvite}
          >
            Sim, vincular
          </StyledButton>
        </DialogActions>
      </Dialog>

      <LoadingIndicator 
        open={isLoading} 
        type="overlay" 
        message={messageLoading}
      />

      {/* Snackbar para mensagens */}
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GuestForm;
