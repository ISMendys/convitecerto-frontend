import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { createEvent, updateEvent, fetchEvent } from '../../store/actions/eventActions';

// Componentes reutilizáveis
import StyledButton from '../../components/StyledButton';
import StyledTextField from '../../components/StyledTextField';
import PageTitle from '../../components/PageTitle';
import FormSection from '../../components/FormSection';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploadFieldBase64 from '../../components/ImageUploadField';
import LocationSelector from '../../components/LocationSelector';
import { LoadingIndicator } from '../../components/LoadingIndicator';

const EventCreate = () => {
  const { eventId, inviteId } = useParams()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentEvent, loading, error } = useSelector(state => state.events);
  const agora = Date.now();
  const umDia   = 24 * 60 * 60 * 1000;
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(agora + umDia),
    location: { estado: '', cidade: '', rua: '', completo: '' },
    description: '',
    type: 'party',
    maxGuests: '50',
    notes: '',
    image: { type: 'url', url: '', base64: '' }
  });
  const [messageLoading, setMessageLoading] = useState('Carregando dados...');
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Carregar dados do evento se estiver editando
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];
        if (eventId) {
          promises.push(dispatch(fetchEvent(eventId)));
        }
        await Promise.all(promises);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [dispatch, eventId]);
  
  // Preencher formulário com dados do evento se estiver editando
  useEffect(() => {
    if (eventId && currentEvent) {
      // Processar a localização para o novo formato
      let locationData = { estado: '', cidade: '', rua: '', completo: '' };
      
      if (currentEvent.location) {
        // Se for uma string, tentar extrair informações
        if (typeof currentEvent.location === 'string') {
          locationData.completo = currentEvent.location;
          
          // Tentar extrair rua, cidade e estado (simplificado)
          const parts = currentEvent.location.split(',').map(part => part.trim());
          if (parts.length >= 3) {
            locationData.rua = parts[0];
            locationData.cidade = parts[1];
            // Tentar encontrar o estado pela cidade
            // Isso é uma simplificação, em um caso real seria mais complexo
          } else if (parts.length === 2) {
            locationData.cidade = parts[0];
            // Tentar encontrar o estado pela cidade
          }
        } else if (typeof currentEvent.location === 'object') {
          locationData = {
            ...currentEvent.location,
            rua: currentEvent.location.rua || currentEvent.location.endereco || ''
          };
        }
      }
      
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
        title: currentEvent.title || '',
        date: currentEvent.date ? new Date(currentEvent.date) : new Date(agora + umDia),
        location: locationData,
        description: currentEvent.description || '',
        type: currentEvent.type || 'party',
        maxGuests: currentEvent.maxGuests || '50',
        notes: currentEvent.notes || '',
        image: imageData
      });
    }
  }, [eventId, currentEvent]);
  
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Manipular mudança de data
  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
    
    // Limpar erro do campo
    if (formErrors.date) {
      setFormErrors(prev => ({
        ...prev,
        date: null
      }));
    }
  };
  
  // Manipular mudança na imagem
  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
    
    // Limpar erro do campo
    if (formErrors.image) {
      setFormErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  };
  
  // Manipular mudança na localização
  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      location: locationData
    }));
    
    // Limpar erro do campo
    if (formErrors.location) {
      setFormErrors(prev => ({
        ...prev,
        location: null
      }));
    }
  };
  
  // Validar formulário
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'O título é obrigatório';
    }
    
    if (!formData.date) {
      errors.date = 'A data é obrigatória';
    } else if (new Date(formData.date) < new Date()) {
      errors.date = 'A data não pode ser no passado';
    }
    
    if (!formData.location.completo) {
      errors.location = 'A localização é obrigatória';
    }
    
    if (formData.maxGuests <= 0) {
      errors.maxGuests = 'O número máximo de convidados deve ser maior que zero';
    }
    
    // Validação da imagem (opcional)
    if (formData.image.type === 'url' && formData.image.url.trim() !== '') {
      try {
        new URL(formData.image.url);
      } catch (e) {
        errors.image = 'URL da imagem inválida';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Preparar dados para envio
  const prepareFormData = () => {
    // Preparar dados da imagem
    let imageData = null;
    
    if (formData.image.type === 'url' && formData.image.url) {
      imageData = formData.image.url;
    } else if (formData.image.type === 'file' && formData.image.base64) {
      imageData = formData.image.base64;
    }
    
    // Preparar dados da localização
    const locationData = formData.location.completo;
    return {
      ...formData,
      image: imageData,
      location: locationData
    };
  };
  
  // Salvar evento
  const handleSave = async () => {
    setMessageLoading('Salvando evento...');
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      setSnackbarMessage('Por favor, corrija os erros no formulário');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Preparar dados para envio
      const eventData = prepareFormData();
      
      if (eventId) {
        await dispatch(updateEvent({ id: eventId, eventData })).unwrap();
        setSnackbarMessage('Evento atualizado com sucesso!');
      } else {
        const result = await dispatch(createEvent(eventData)).unwrap();
        setSnackbarMessage('Evento criado com sucesso!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      navigate('/events');
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao salvar evento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Excluir evento
  const handleDelete = async () => {
    setMessageLoading('Excluindo evento...');
    setIsLoading(false);
    try {
      // await dispatch(deleteEvent(eventId)).unwrap();
      setSnackbarMessage('Evento excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      navigate('/');
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir evento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
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
    navigate('/');
  };
  
  // Tipos de evento disponíveis
  const eventTypes = [
    { id: 'party', name: 'Festa' },
    { id: 'birthday', name: 'Aniversário' },
    { id: 'wedding', name: 'Casamento' },
    { id: 'corporate', name: 'Corporativo' },
    { id: 'other', name: 'Outro' }
  ];
  
  // Renderizar tela de carregamento
  if (loading && eventId) {
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
            onClick={() => navigate('/events')}
            sx={{ 
              borderRadius: 10,
              px: 2,
              py: 1,
              '&:hover': {
                transform: 'translateX(-4px)'
              }
            }}
          >
            Voltar
          </StyledButton>
          
          {/* Título e subtítulo à direita */}
          <PageTitle 
            title={eventId ? 'Editar Evento' : 'Criar Novo Evento'}
            subtitle={eventId 
              ? 'Atualize as informações do seu evento' 
              : 'Preencha os detalhes para criar um novo evento'}
            alignRight={true}
            mb={0}
          />
        </Box>
        
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}
        >
          <FormSection
            title="Informações Básicas"
            icon={<EventIcon />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <StyledTextField
                  label="Título do Evento"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  startIcon={<EventIcon />}
                  sx={{maxWidth: 600}}
                />
                
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DateTimePicker
                    label="Data e Hora"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required
                        error={!!formErrors.date}
                        helperText={formErrors.date}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': { 
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                            }
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              
              {/* Componente de seleção de localização com tema escuro */}
              <LocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                required
              />
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <FormControl 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                      },
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }
                  }}
                >
                  <InputLabel>Tipo de Evento</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Tipo de Evento"
                    startAdornment={
                      <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                        <CategoryIcon />
                      </Box>
                    }
                  >
                    {eventTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <StyledTextField
                  label="Número Máximo de Convidados"
                  name="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  error={!!formErrors.maxGuests}
                  helperText={formErrors.maxGuests}
                  startIcon={<PersonIcon />}
                />
              </Box>
              
              {/* Campo de upload de imagem com base64 */}
              <ImageUploadFieldBase64
                value={formData.image}
                onChange={handleImageChange}
                error={!!formErrors.image}
                helperText={formErrors.image}
              />
              
              <StyledTextField
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                startIcon={<DescriptionIcon />}
              />
              
              <StyledTextField
                label="Observações"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                // rows={3}
                startIcon={<NotesIcon />}
              />
            </Box>
          </FormSection>
        </Paper>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4
        }}>
          <Box>
            {eventId && (
              <StyledButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Excluir Evento
              </StyledButton>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
              variant="outlined"
              color="inherit"
              onClick={handleCancelConfirm}
            >
              Cancelar
            </StyledButton>
            
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              {eventId ? 'Atualizar' : 'Criar'} Evento
            </StyledButton>
          </Box>
        </Box>
      </Container>
      
      {/* Snackbar de feedback */}
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
          sx={{ width: '100%', borderRadius: 1, color: theme.palette.primary.contrastText }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <LoadingIndicator 
        open={isLoading} 
        type="overlay" 
        message={messageLoading}
      />

      {/* Diálogo de confirmação de cancelamento */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleCancel}
        title="Cancelar edição"
        message="Todas as alterações não salvas serão perdidas. Deseja realmente cancelar?"
        cancelText="Voltar à edição"
        confirmText="Sim, cancelar"
        confirmColor="error"
      />
      
      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir evento"
        message="Esta ação não pode ser desfeita. Deseja realmente excluir este evento?"
        cancelText="Cancelar"
        confirmText="Sim, excluir"
        confirmColor="error"
      />
    </Box>
  );
};

export default EventCreate;
