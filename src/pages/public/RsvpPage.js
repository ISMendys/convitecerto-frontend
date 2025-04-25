import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  Fade,
  Zoom,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  WhatsApp as WhatsAppIcon, 
  Check as CheckIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Celebration as CelebrationIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { submitRsvp } from '../../store/actions/guestActions';
import { fetchPublicInvite } from '../../store/actions/inviteActions';

// Componente para exibir um contador regressivo
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    };

    // Atualizar o contador a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calcular o tempo restante inicialmente
    setTimeLeft(calculateTimeLeft());

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      flexWrap: 'wrap',
      gap: { xs: 1, sm: 2 },
      my: 3
    }}>
      {timeUnits.map((unit, index) => (
        <Box 
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: { xs: '60px', sm: '80px' }
          }}
        >
          <Box
            sx={{
              width: { xs: '60px', sm: '80px' },
              height: { xs: '60px', sm: '80px' },
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              color: 'white',
              mb: 1
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {unit.value}
            </Typography>
          </Box>
          <Typography variant="caption" fontWeight="medium" color="text.secondary">
            {unit.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Componente para exibir informações do evento com ícones
const EventInfoItem = ({ icon, label, value }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      mb: 2,
      gap: 2
    }}>
      <Avatar
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          width: 40,
          height: 40
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Componente principal da página RSVP
const RsvpPage = () => {
  const { guestId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  
  const { publicInvite, loading: inviteLoading } = useSelector(state => state.invites);
  const { loading: rsvpLoading, error } = useSelector(state => state.guests);
  
  const [formData, setFormData] = useState({
    status: '',
    plusOne: false,
    plusOneName: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Carregar dados do convite
  useEffect(() => {
    if (guestId) {
      dispatch(fetchPublicInvite(guestId));
    }
  }, [dispatch, guestId]);
  
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
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Confirmar presença
  const handleConfirm = async () => {
    try {
      await dispatch(submitRsvp({
        id: guestId,
        rsvpData: {
          ...formData,
          status: 'confirmed'
        }
      })).unwrap();
      
      setSubmitted(true);
      setSnackbarMessage('Presença confirmada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao confirmar presença');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Recusar convite
  const handleDecline = async () => {
    try {
      await dispatch(submitRsvp({
        id: guestId,
        rsvpData: {
          ...formData,
          status: 'declined'
        }
      })).unwrap();
      
      setSubmitted(true);
      setSnackbarMessage('Resposta enviada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao enviar resposta');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Formatar hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Compartilhar via WhatsApp
  const handleShare = () => {
    const text = `Fui convidado para ${publicInvite?.event?.title} em ${formatDate(publicInvite?.event?.date)}. Espero te ver lá!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  
  // Renderizar tela de carregamento
  if (inviteLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
          Carregando seu convite...
        </Typography>
      </Box>
    );
  }
  
  // Renderizar mensagem de erro se o convite não for encontrado
  if (!publicInvite && !inviteLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <CloseIcon sx={{ fontSize: 64, color: 'error.main' }} />
            </Box>
            
            <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
              Convite não encontrado
            </Typography>
            
            <Typography variant="body1" paragraph>
              O link que você acessou não é válido ou expirou.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              href="/"
              sx={{ mt: 2 }}
            >
              Voltar para a página inicial
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }
  
  // Definir cores com base no convite
  const bgColor = publicInvite?.bgColor || '#ffffff';
  const textColor = publicInvite?.textColor || '#000000';
  const accentColor = publicInvite?.accentColor || theme.palette.primary.main;
  const fontFamily = publicInvite?.fontFamily || theme.typography.fontFamily;
  
  // Renderizar confirmação enviada
  if (submitted) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(bgColor, 0.97)}, ${alpha(bgColor, 0.95)})`,
        color: textColor,
        py: 4,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container maxWidth="sm">
          <Zoom in={true} timeout={800}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(to right, ${accentColor}, ${alpha(accentColor, 0.7)})`
                }
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'success.main',
                    margin: '0 auto',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  <CheckIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
              
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontFamily,
                  mb: 2
                }}
              >
                Resposta Enviada!
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontFamily,
                  fontSize: '1.1rem'
                }}
              >
                Obrigado por responder ao convite para:
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  color: accentColor,
                  fontWeight: 600,
                  fontFamily
                }}
              >
                {publicInvite?.event?.title}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ my: 3, textAlign: 'center' }}>
                <EventInfoItem 
                  icon={<CalendarIcon />}
                  label="Data"
                  value={formatDate(publicInvite?.event?.date)}
                />
                
                <EventInfoItem 
                  icon={<TimeIcon />}
                  label="Horário"
                  value={formatTime(publicInvite?.event?.date)}
                />
                
                {publicInvite?.event?.location && (
                  <EventInfoItem 
                    icon={<LocationIcon />}
                    label="Local"
                    value={publicInvite.event.location}
                  />
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 3, 
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                Você pode alterar sua resposta a qualquer momento acessando este link novamente.
              </Typography>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleShare}
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    background: `linear-gradient(45deg, ${accentColor}, ${alpha(accentColor, 0.8)})`,
                    '&:hover': {
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Compartilhar via WhatsApp
                </Button>
              </Box>
            </Paper>
          </Zoom>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(bgColor, 0.97)}, ${alpha(bgColor, 0.95)})`,
      color: textColor,
      py: { xs: 2, md: 4 },
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="stretch">
          {/* Coluna do convite */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(to right, ${accentColor}, ${alpha(accentColor, 0.7)})`
                  }
                }}
              >
                {/* Imagem do convite */}
                {publicInvite?.imageUrl && (
                  <Box 
                    sx={{
                      position: 'relative',
                      mb: 3,
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      maxHeight: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      component="img"
                      src={publicInvite.imageUrl}
                      alt="Imagem do convite"
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
                      }}
                    />
                  </Box>
                )}
                
                {/* Título do evento */}
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    color: accentColor,
                    fontFamily,
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  {publicInvite?.event?.title}
                </Typography>
                
                {/* Texto personalizado */}
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontFamily,
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    fontWeight: 500,
                    mb: 4
                  }}
                >
                  {publicInvite?.customText || 'Você está convidado para este evento especial!'}
                </Typography>
                
                {/* Contador regressivo */}
                {publicInvite?.event?.date && new Date(publicInvite.event.date) > new Date() && (
                  <>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        textAlign: 'center',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Contagem regressiva
                    </Typography>
                    <CountdownTimer targetDate={publicInvite.event.date} />
                  </>
                )}
                
                {/* Informações do evento */}
                <Box sx={{ mt: 2 }}>
                  <EventInfoItem 
                    icon={<CalendarIcon />}
                    label="Data"
                    value={formatDate(publicInvite?.event?.date)}
                  />
                  
                  <EventInfoItem 
                    icon={<TimeIcon />}
                    label="Horário"
                    value={formatTime(publicInvite?.event?.date)}
                  />
                  
                  {publicInvite?.event?.location && (
                    <EventInfoItem 
                      icon={<LocationIcon />}
                      label="Local"
                      value={publicInvite.event.location}
                    />
                  )}
                  
                  {publicInvite?.event?.description && (
                    <EventInfoItem 
                      icon={<InfoIcon />}
                      label="Detalhes"
                      value={publicInvite.event.description}
                    />
                  )}
                </Box>
                
                {/* Botão de compartilhar */}
                <Box sx={{ mt: 'auto', pt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{
                      borderRadius: 8,
                      borderColor: alpha(accentColor, 0.5),
                      color: accentColor,
                      '&:hover': {
                        borderColor: accentColor,
                        backgroundColor: alpha(accentColor, 0.05)
                      }
                    }}
                  >
                    Compartilhar convite
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>
          
          {/* Coluna de confirmação */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.success.light})`
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        margin: '0 auto',
                        mb: 2
                      }}
                    >
                      <CelebrationIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        fontFamily
                      }}
                    >
                      Confirme sua presença
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily,
                        color: 'text.secondary'
                      }}
                    >
                      Por favor, responda se poderá comparecer ao evento.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ my: 4 }}>
                    <Grid container spacing={3}>
                      {/* Botões de confirmação */}
                      <Grid item xs={12}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2
                        }}>
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            onClick={handleConfirm}
                            disabled={rsvpLoading}
                            sx={{
                              py: 2,
                              borderRadius: 3,
                              boxShadow: '0 8px 16px rgba(76, 175, 80, 0.2)',
                              background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                              '&:hover': {
                                boxShadow: '0 12px 20px rgba(76, 175, 80, 0.25)',
                              }
                            }}
                          >
                            {rsvpLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <>
                                <CheckIcon sx={{ mr: 1 }} />
                                Confirmar Presença
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            size="large"
                            onClick={handleDecline}
                            disabled={rsvpLoading}
                            sx={{
                              py: 2,
                              borderRadius: 3,
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                                backgroundColor: alpha(theme.palette.error.main, 0.05)
                              }
                            }}
                          >
                            {rsvpLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <>
                                <CloseIcon sx={{ mr: 1 }} />
                                Não Poderei Ir
                              </>
                            )}
                          </Button>
                        </Box>
                      </Grid>
                      
                      {/* Opções adicionais */}
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            mt: 2,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                          }}
                        >
                          <Typography 
                            variant="subtitle1" 
                            gutterBottom
                            sx={{ 
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            Opções adicionais
                          </Typography>
                          
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="plusOne"
                                checked={formData.plusOne}
                                onChange={handleChange}
                                color="primary"
                              />
                            }
                            label="Levarei acompanhante"
                            sx={{ my: 1 }}
                          />
                          
                          {formData.plusOne && (
                            <Zoom in={formData.plusOne} timeout={300}>
                              <TextField
                                name="plusOneName"
                                label="Nome do acompanhante"
                                value={formData.plusOneName}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  mt: 1,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                  }
                                }}
                              />
                            </Zoom>
                          )}
                          
                          <TextField
                            name="message"
                            label="Mensagem ou observação (opcional)"
                            value={formData.message}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            sx={{ 
                              mt: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WhatsAppIcon sx={{ color: '#25D366', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Você também pode responder diretamente pelo WhatsApp enviando "sim" ou "não".
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
      
      {/* Snackbar para feedback */}
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
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RsvpPage;
