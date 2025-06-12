import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Dialog,
  InputLabel,
  Select,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchEvent, createEvent, updateEvent, deleteEvent } from '../../store/actions/eventActions';
import { clearEventError } from '../../store/slices/eventSlice';

const EventForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentEvent, loading, error } = useSelector(state => state.events);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    location: '',
    type: 'other'
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Carregar evento se estiver em modo de edição
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchEvent(id));
    } else {
      // Limpar evento atual se estiver em modo de criação
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        location: '',
        type: 'other'
      });
    }
  }, [dispatch, id, isEditMode]);
  
  // Preencher formulário quando o evento for carregado
  useEffect(() => {
    if (currentEvent && isEditMode) {
      setFormData({
        title: currentEvent.title || '',
        description: currentEvent.description || '',
        date: currentEvent.date ? new Date(currentEvent.date) : new Date(),
        location: currentEvent.location || '',
        type: currentEvent.type || 'other'
      });
    }
  }, [currentEvent, isEditMode]);
  
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
  };
  
  // Manipular mudança de data
  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };
  
  // Salvar evento
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await dispatch(updateEvent({ id, eventData: formData })).unwrap();
        setSnackbarMessage('Evento atualizado com sucesso!');
      } else {
        const result = await dispatch(createEvent(formData)).unwrap();
        setSnackbarMessage('Evento criado com sucesso!');
        // Redirecionar para a página de edição do evento recém-criado
        navigate(`/events/${result.id}`);
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao salvar evento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Excluir evento
  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      setSnackbarMessage('Evento excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/');
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir evento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearEventError());
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Editar Evento' : 'Criar Novo Evento'}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} // gap substitui o spacing do Grid
        >
          <TextField
            name="title"
            label="Título do Evento"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          
          {/* Box aninhado para a linha de Data e Local */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            
            {/* Wrapper para controlar a largura do DateTimePicker */}
            <Box >
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DateTimePicker
                  label="Data e Hora"
                  value={formData.date}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Box>
            
            {/* Wrapper para controlar a largura do campo Local */}
            <Box sx={{ width: { xs: '100%', md: '35%' } }}>
              <TextField
                name="location"
                label="Local"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Endereço ou link para evento online"
              />
            </Box>
          </Box>
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Tipo de Evento</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo de Evento"
            >
              <MenuItem value="birthday">Aniversário</MenuItem>
              <MenuItem value="wedding">Casamento</MenuItem>
              <MenuItem value="corporate">Corporativo</MenuItem>
              <MenuItem value="party">Festa</MenuItem>
              <MenuItem value="other">Outro</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            name="description"
            label="Descrição"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            
            <Box>
              {isEditMode && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Excluir
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </Box>
        </Box>
        </form>
      </Paper>
      
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
      
      {/* Diálogo de confirmação para exclusão */}
      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default EventForm;
