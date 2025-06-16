import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Grid
} from '@mui/material';
import EventCard from './EventCard';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/actions/eventActions';
import LoadingIndicator from './LoadingIndicator';
const EventSelectorModal = ({ open, onClose, onSelectEvent, apiEndpoint = '/api/events' }) => {
  const dispatch = useDispatch();
  const { events: allEvents = [], loading: eventsLoading } = useSelector(state => state.events);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchAttempted, setFetchAttempted] = useState(false);
  useEffect(() => {
    if (open && (!allEvents || allEvents.length === 0)) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          await dispatch(fetchEvents());
        } catch (err) {
          setError('Erro ao carregar eventos. Por favor, tente novamente.');
          console.error('Erro ao buscar eventos:', err);
        } finally {
          setLoading(false);
          setFetchAttempted(true);
        }
      };
      fetchData();
    } else if (!open) {
      setFetchAttempted(false);
    }
  }, [open, fetchAttempted, dispatch ]);

  // Filtrar eventos baseado na busca
  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventSelect = (event) => {
    onSelectEvent(event.id, event);
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(fetchEvents());
    } catch (err) {
      setError('Erro ao carregar eventos. Por favor, tente novamente.');
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || eventsLoading;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle color={theme.palette.primary.main}>
        Selecione um Evento para Gerenciar Convidados
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3, mt: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por título ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            disabled={isLoading}
          />
        </Box>

        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={6}>
            <LoadingIndicator
                open={loading}
                type="fullscreen"
                message="Carregando..."
              />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={handleRetry} size="small" sx={{ ml: 1 }}>
              Tentar novamente
            </Button>
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            {filteredEvents.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 5,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography 
                  variant="h6" 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {searchTerm ? 'Nenhum evento encontrado para a busca.' : 'Nenhum evento disponível.'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2, maxWidth: 500 }}
                >
                  {searchTerm 
                    ? 'Tente buscar com outros termos ou verifique se o evento existe.'
                    : 'Crie seu primeiro evento para começar a gerenciar convidados.'
                  }
                </Typography>
              </Box>
            ) : (
<Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3, 
                  justifyContent: 'center',
                }}
              >
                {filteredEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      flex: {
                        xs: '1 1 100%',
                        sm: '1 1 calc(50% - 16px)',
                        md: '1 1 calc(33.333% - 16px)'
                      },
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <EventCard
                      event={event} 
                      onClick={handleEventSelect}
                      showActions={false}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventSelectorModal;

