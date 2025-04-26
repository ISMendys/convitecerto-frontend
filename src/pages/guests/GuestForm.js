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
  Notes as NotesIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { createGuest, updateGuest, fetchGuest, deleteGuest, fetchGuestRsvpHistory } from '../../store/actions/guestActions';
import { clearCurrentGuest } from '../../store/slices/guestSlice';
import ImageUploadFieldBase64 from '../../components/ImageUploadField';

// Componentes estilizados
import StyledButton from '../../components/StyledButton';
import ConfirmDialog from '../../components/ConfirmDialog';
import RsvpDetailsCard from '../../components/guests/RsvpDetailsCard';

const GuestForm = () => {
  const { eventId, guestId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentGuest, loading, error } = useSelector(state => state.guests);
  const { currentEvent } = useSelector(state => state.events);
  
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
  });

  const [imageError, setImageError] = useState('');
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Carregar dados do convidado se estiver editando
  useEffect(() => {
    if (guestId) {
      // Limpar o currentGuest antes de buscar um novo para evitar dados antigos
      dispatch(clearCurrentGuest());
      dispatch(fetchGuest(guestId));
      
      // Buscar histórico de RSVP se estiver editando
      dispatch(fetchGuestRsvpHistory(guestId));
    }
  }, [dispatch, guestId]);
  
  // Preencher formulário com dados do convidado se estiver editando
  useEffect(() => {
    if (guestId && currentGuest) {
      // Processar a imagem para o novo formato
      let imageData = { type: 'url', url: '', base64: '' };
      
      if (currentEvent.image) {
        if (typeof currentEvent.image === 'string') {
          // Se for uma URL ou base64
          if (currentEvent.image.startsWith('data:image')) {
            imageData = { type: 'file', base64: currentEvent.image, url: '' };
          } else {
            imageData = { type: 'url', url: currentEvent.image, base64: '' };
          }
        } else if (typeof currentEvent.image === 'object') {
          if (currentEvent.image.imageUrl) {
            if (currentEvent.image.imageUrl.startsWith('data:image') || 
                currentEvent.image.imageUrl.startsWith('blob:')) {
              imageData = { 
                type: 'file', 
                base64: currentEvent.image.imageUrl,
                url: '' 
              };
            } else {
              imageData = { 
                type: 'url', 
                url: currentEvent.image.imageUrl,
                base64: '' 
              };
            }
          } else if (currentEvent.image.base64) {
            imageData = currentEvent.image;
          }
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
        imageUrl: currentGuest.imageUrl || '',
      });
    }
  }, [guestId, currentGuest]);
  
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

  // Salvar convidado
  const handleSave = async () => {
    let imageData = null;
    
    if (formData.imageUrl.type === 'url' && formData.imageUrl.url) {
      imageData = formData.imageUrl.url;
    } else if (formData.imageUrl.type === 'file' && formData.imageUrl.base64) {
      imageData = formData.imageUrl.base64;
    }
    try {
      let guestData = {
        ...formData,
        imageUrl: imageData,
        eventId: currentEvent.id,
      };
      
      if (guestId) {
        await dispatch(updateGuest({ id: guestId, ...guestData })).unwrap();
        setSnackbarMessage('Convidado atualizado com sucesso!');
      } else {
        await dispatch(createGuest(guestData)).unwrap();
        setSnackbarMessage('Convidado adicionado com sucesso!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate(`/events/${eventId}/guests`);
      }, 1500);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao salvar convidado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Excluir convidado
  const handleDelete = async () => {
    try {
      await dispatch(deleteGuest(guestId)).unwrap();
      setSnackbarMessage('Convidado excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate(`/events/${eventId}/guests`);
      }, 1500);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir convidado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
    navigate(`/events/${eventId}/guests`);
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
            onClick={() => navigate(`/events/${eventId}/guests`)}
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
            
            <Box sx={{ 
              p: 2,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>
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
                    <WhatsAppIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                    <Typography>Este telefone é WhatsApp</Typography>
                  </Box>
                }
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: 2
                    }
                  }}
                >
                  {statuses.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: status.color,
                            mr: 1
                          }}
                        />
                        {status.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel id="group-label">Grupo</InputLabel>
                <Select
                  labelId="group-label"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  label="Grupo"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: 2
                    }
                  }}
                >
                  {groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ 
              p: 2,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
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
                  label="Nome do acompanhante (opcional)"
                  name="plusOneName"
                  value={formData.plusOneName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Deixe em branco se não souber"
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              )}
            </Box>
            <TextField
              label="Observações"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
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
        
        {/* Seção de Imagem do Convidado */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
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
              Imagem do Convidado
            </Typography>
          </Box>
          <Box>
              {/* Campo de upload de imagem com base64 */}
              <ImageUploadFieldBase64
                value={formData.imageUrl}
                onChange={handleImageChange}
                helperText={"Insira uma url ou faça upload de uma imagem"}
              />

            {imageError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {imageError}
              </Typography>
            )}
          </Box>
        </Paper>
        
        {/* Seção de RSVP (apenas para edição) */}
        {guestId && currentGuest && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3
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
            
            <RsvpDetailsCard guest={currentGuest} />
          </Box>
        )}
        
        {/* Botões de ação */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`
        }}>
          <Box>
            {guestId && (
              <StyledButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ mr: 2 }}
              >
                Excluir
              </StyledButton>
            )}
            
            <StyledButton
              variant="outlined"
              color="inherit"
              onClick={handleCancelConfirm}
            >
              Cancelar
            </StyledButton>
          </Box>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Salvar
          </StyledButton>
        </Box>
        
        {/* Dialog de confirmação de cancelamento */}
        <ConfirmDialog
          open={confirmDialogOpen}
          title="Cancelar edição"
          content="Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
          onConfirm={handleCancel}
          onCancel={() => setConfirmDialogOpen(false)}
        />
        
        {/* Dialog de confirmação de exclusão */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Excluir convidado"
          content="Tem certeza que deseja excluir este convidado? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          confirmColor="error"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialogOpen(false)}
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
      </Container>
    </Box>
  );
};

export default GuestForm;
