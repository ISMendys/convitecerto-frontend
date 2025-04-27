import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { fetchPublicInvite } from '../../store/actions/inviteActions';
import { updateGuestStatus } from '../../store/actions/guestActions';
import StyledButton from '../../components/StyledButton';

const RsvpPage = () => {
  const { guestId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { publicInvite, loading, error } = useSelector(state => state.invites);
  
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Carregar convite público
  useEffect(() => {
    if (guestId) {
      console.log('Fetching public invite for guest:', guestId);
      dispatch(fetchPublicInvite(guestId));
    }
  }, [dispatch, guestId]);
  
  // Atualizar status do convidado
  const handleUpdateStatus = async (status) => {
    try {
      console.log('Updating guest status:', status);
      await dispatch(updateGuestStatus({ 
        id: guestId, 
        status, 
        message 
      })).unwrap();
      
      setStatusUpdated(true);
      setSnackbarMessage(
        status === 'confirmed' 
          ? 'Presença confirmada com sucesso!' 
          : 'Resposta enviada com sucesso!'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error updating status:', err);
      setSnackbarMessage(err || 'Erro ao atualizar status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Compartilhar no WhatsApp
  const handleShareWhatsApp = () => {
    const text = `Olá! Confirme sua presença no evento ${publicInvite?.event?.title || 'Evento'} através deste link: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  
  // Renderizar tela de carregamento
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Carregando seu convite...
        </Typography>
      </Box>
    );
  }
  
  // Renderizar tela de erro
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 3 }}
          >
            <AlertTitle>Erro ao carregar convite</AlertTitle>
            {error}
          </Alert>
          
          <Typography variant="body1" paragraph>
            Não foi possível carregar seu convite. Por favor, verifique o link ou entre em contato com o organizador do evento.
          </Typography>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(fetchPublicInvite(guestId))}
            sx={{ mt: 2 }}
          >
            Tentar Novamente
          </StyledButton>
        </Paper>
      </Container>
    );
  }
  
  // Renderizar tela de convidado sem convite
  if (publicInvite?.noInvite) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <Alert 
            severity="warning" 
            variant="filled"
            sx={{ mb: 3 }}
          >
            <AlertTitle>Convite não encontrado</AlertTitle>
            {publicInvite.message}
          </Alert>
          
          <Typography variant="h5" gutterBottom>
            Olá, {publicInvite.guestName}!
          </Typography>
          
          <Typography variant="body1" paragraph>
            Parece que você ainda não possui um convite associado. O organizador do evento precisa vincular um convite ao seu cadastro.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Entre em contato com o organizador do evento para solicitar seu convite.
          </Typography>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<WhatsAppIcon />}
            onClick={handleShareWhatsApp}
            sx={{ mt: 2 }}
          >
            Contatar Organizador
          </StyledButton>
        </Paper>
      </Container>
    );
  }
  
  // Renderizar tela de convite não encontrado
  if (!publicInvite) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <Alert 
            severity="info" 
            variant="filled"
            sx={{ mb: 3 }}
          >
            <AlertTitle>Convite não encontrado</AlertTitle>
            Não foi possível encontrar o convite solicitado
          </Alert>
          
          <Typography variant="body1" paragraph>
            O convite que você está procurando não foi encontrado. Por favor, verifique o link ou entre em contato com o organizador do evento.
          </Typography>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(fetchPublicInvite(guestId))}
            sx={{ mt: 2 }}
          >
            Tentar Novamente
          </StyledButton>
        </Paper>
      </Container>
    );
  }
  
  // Renderizar tela de RSVP
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: publicInvite.backgroundColor || theme.palette.background.default,
        color: publicInvite.textColor || theme.palette.text.primary,
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Card 
          elevation={0} 
          sx={{ 
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            bgcolor: 'white'
          }}
        >
          {/* Cabeçalho do convite */}
          <CardMedia
            component="img"
            height="300"
            image={publicInvite.imageUrl || `https://source.unsplash.com/random/1200x600?event&sig=${publicInvite.id}`}
            alt={publicInvite.title}
          />
          
          <CardContent sx={{ p: 4 }}>
            {/* Título e detalhes do evento */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontFamily: publicInvite.titleFont || 'inherit',
                  color: publicInvite.titleColor || theme.palette.primary.main,
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                {publicInvite.title}
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: publicInvite.subtitleFont || 'inherit',
                  color: publicInvite.subtitleColor || theme.palette.text.secondary,
                  mb: 2
                }}
              >
                {publicInvite.subtitle}
              </Typography>
              
              <Divider sx={{ 
                width: '50%', 
                mx: 'auto', 
                my: 3,
                borderColor: alpha(theme.palette.primary.main, 0.3)
              }} />
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontFamily: publicInvite.textFont || 'inherit',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                {publicInvite.description}
              </Typography>
            </Box>
            
            {/* Detalhes do evento */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  >
                    Data e Hora
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {publicInvite.event?.date 
                      ? new Date(publicInvite.event.date).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Data a confirmar'}
                  </Typography>
                  
                  <Typography variant="body1">
                    {publicInvite.event?.time || 'Horário a confirmar'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.secondary.main,
                      fontWeight: 600
                    }}
                  >
                    Local
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {publicInvite.event?.location || 'Local a confirmar'}
                  </Typography>
                  
                  <Typography variant="body1">
                    {publicInvite.event?.address || 'Endereço a confirmar'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Seção de RSVP */}
            {!statusUpdated ? (
              <Box 
                sx={{ 
                  p: 4, 
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: theme.palette.info.main
                  }}
                >
                  Confirme sua presença
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    textAlign: 'center',
                    mb: 3
                  }}
                >
                  Por favor, confirme se você poderá comparecer ao evento.
                </Typography>
                
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleUpdateStatus('confirmed')}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                        }
                      }}
                    >
                      Confirmar Presença
                    </StyledButton>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <StyledButton
                      fullWidth
                      variant="outlined"
                      color="error"
                      size="large"
                      startIcon={<CancelIcon />}
                      onClick={() => handleUpdateStatus('declined')}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      Não Poderei Comparecer
                    </StyledButton>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  p: 4, 
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ 
                      fontSize: 64,
                      mb: 2
                    }} 
                  />
                  
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.success.main
                    }}
                  >
                    Resposta registrada com sucesso!
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Obrigado por responder ao convite. Sua resposta foi registrada.
                  </Typography>
                  
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => setStatusUpdated(false)}
                    sx={{ mt: 1 }}
                  >
                    Alterar Resposta
                  </StyledButton>
                </Box>
              </Box>
            )}
            
            {/* Informações adicionais */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary
                }}
              >
                Informações Adicionais
              </Typography>
              
              <Typography variant="body1" paragraph>
                {publicInvite.additionalInfo || 'Não há informações adicionais para este evento.'}
              </Typography>
            </Box>
          </CardContent>
          
          <CardActions sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <StyledButton
              startIcon={<WhatsAppIcon />}
              onClick={handleShareWhatsApp}
              sx={{ ml: 'auto' }}
            >
              Compartilhar
            </StyledButton>
          </CardActions>
        </Card>
      </Container>
      
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

export default RsvpPage;
