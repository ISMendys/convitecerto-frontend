import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  Stack,
  Button,
  Fade,
  Zoom,
  Grow,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { fetchPublicInvite } from '../../store/actions/inviteActions';
import { updateGuestStatus } from '../../store/actions/guestActions';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import Confetti from 'react-confetti';

// Import components
import {
  generateMinimalThemeConfig,
  fallbackMinimalTheme
} from './components/themes';
import ElegantLoadingIndicator from './components/ElegantLoadingIndicator';
import CountdownRenderer from './components/CountdownRenderer';
import DetailCard from './components/DetailCard';
import HostMessage from './components/HostMessage';
import ThemedMap from './components/ThemedMap';

// Configuração para usar tema dinâmico baseado nas cores do convite
const USE_DYNAMIC_THEME = true;

// Variantes de animação para Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// Animação de bounce para seta de rolagem
const bounceAnimation = {
  y: ["0%", "-20%", "0%"],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 1.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  },
};

// Componente principal da página RSVP
const RsvpPage = () => {
  const { guestId } = useParams();
  const dispatch = useDispatch();
  const { publicInvite, loading, error } = useSelector(state => state.invites);
  const { loading: rsvpLoading, error: rsvpError, messageStatus } = useSelector(state => state.guests);

  // Estados locais
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  // Referências para elementos DOM
  const confirmSectionRef = useRef(null);

  // Seleção de tema com base nas cores do convite
  const theme = useMemo(() => {
    if (USE_DYNAMIC_THEME && publicInvite) {
      const personalization = {
        bgColor: publicInvite.bgColor || '#6a1b9a',
        textColor: publicInvite.textColor || '#ffffff',
        accentColor: publicInvite.accentColor || '#e91e63',
        fontFamily: publicInvite.fontFamily || 'Roboto, sans-serif',
      };
      const themeConfig = generateMinimalThemeConfig(personalization);
      return createTheme(themeConfig);
    } else {
      return fallbackMinimalTheme;
    }
  }, [publicInvite]);

  // Estados para o mapa
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapMarkerPos, setMapMarkerPos] = useState(null);
  const [mapMarkerText, setMapMarkerText] = useState('');

  // Buscar dados do convite
  useEffect(() => {
    if (guestId) {
      dispatch(fetchPublicInvite(guestId));
    }
  }, [dispatch, guestId]);

  // Configurar mapa quando os dados do evento estiverem disponíveis
  useEffect(() => {
    if (publicInvite?.event?.location) {
      const locationString = publicInvite.event.location;
      setMapMarkerText(`${publicInvite.event.title || 'Local do Evento'}<br/>${locationString}`);

      // Lógica de geocodificação (placeholder)
      const geocodeLocation = async (location) => {
        console.warn("Geocoding não implementado. Usando coordenadas de placeholder.");
        if (location.toLowerCase().includes("salvador")) return [-12.9777, -38.5016];
        if (location.toLowerCase().includes("são paulo")) return [-23.5505, -46.6333];
        if (location.toLowerCase().includes("rio")) return [-22.9068, -43.1729];
        return [-14.2350, -51.9253]; // Fallback para o Brasil
      };

      geocodeLocation(locationString).then(coords => {
        if (coords) {
          setMapCenter(coords);
          setMapMarkerPos(coords);
          setMapZoom(16);
        } else {
          setMapCenter([-14.2350, -51.9253]);
          setMapMarkerPos(null);
          setMapZoom(4);
        }
      });
    }
  }, [publicInvite?.event?.location, publicInvite?.event?.title]);

  // Definir status de confirmação inicial
  useEffect(() => {
    if (publicInvite?.guest?.status) {
      setConfirmationStatus(publicInvite.guest.status);
    }
  }, [publicInvite?.guest?.status]);

  // Manipular RSVP
  const handleRsvp = (status) => {
    if (guestId) {
      dispatch(updateGuestStatus({ id: guestId, status: status }));
      
      // Mostrar confetti se confirmado
      if (status === 'confirmed') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      
      // Atualizar status local
      setConfirmationStatus(status);
    }
  };

  // Manipular fechamento do Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Rolar para a seção de confirmação
  const scrollToConfirmation = () => {
    confirmSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Monitorar mudanças no status de RSVP
  const prevRsvpLoading = useRef(rsvpLoading);
  useEffect(() => {
    if (prevRsvpLoading.current && !rsvpLoading) {
      if (rsvpError) {
        setSnackbarMessage(`Erro ao registrar resposta: ${rsvpError}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(messageStatus || 'Sua resposta foi registrada com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    }
    prevRsvpLoading.current = rsvpLoading;
  }, [rsvpLoading, rsvpError, messageStatus]);

  // Lógica de renderização

  // Indicador de carregamento
  if (loading) {
    return <ElegantLoadingIndicator theme={theme} />;
  }

  // Mensagem de erro
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 'sm' }}>Erro ao carregar os dados do convite: {error}</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  // Convite não encontrado
  if (!publicInvite) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Alert severity="warning" sx={{ width: '100%', maxWidth: 'sm' }}>Convite não encontrado ou inválido.</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  // Formatar data e hora do evento
  const eventDate = publicInvite.event?.date ? new Date(publicInvite.event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Data a definir';
  const formattedTime = eventDate ? eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  // Estilo do mapa baseado no tema
  const mapStyle = theme.palette.mode === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11";

  return (
    <ThemeProvider theme={theme}>
      {/* Container principal */}
      <Box 
        sx={{ 
          bgcolor: 'background.default', 
          color: 'text.primary', 
          position: 'relative', 
          overflowX: 'hidden', 
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(135deg, rgba(106,27,154,0.95) 0%, rgba(233,30,99,0.85) 100%)',
        }}
      >
        {/* Confetti para animação de confirmação */}
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        {/* Seção Hero */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            pt: { xs: 12, md: 16 },
            pb: { xs: 20, md: 24 },
            px: 3,
          }}
        >
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
            <Typography variant="h1" sx={{ 
              mb: 2, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              textShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {publicInvite.title || 'Você está convidado!'}
            </Typography>
          </motion.div>
          
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
            <Typography variant="h4" sx={{ 
              color: 'text.secondary', 
              fontWeight: 400,
              mb: 4
            }}>
              {publicInvite.event?.title || 'Para um evento especial'}
            </Typography>
          </motion.div>

          {/* Nome do convidado */}
          {publicInvite.guest?.name && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h5">
                  Olá, {publicInvite.guest.name}!
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Seta para rolar para baixo */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              translateX: '-50%',
              cursor: 'pointer',
            }}
            animate={bounceAnimation}
            onClick={scrollToConfirmation}
          >
            <ExpandMoreIcon sx={{ fontSize: '3rem', color: 'text.secondary' }} />
          </motion.div>
        </Box>

        {/* Container de conteúdo */}
        <Container maxWidth="md" sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 12, md: 20 }, position: 'relative', zIndex: 1 }}>
          
          {/* Seção de contagem regressiva */}
          {eventDate && eventDate > new Date() && (
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={1}>
              <Box sx={{ mb: { xs: 12, md: 18 } }}>
                <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8 } }}>Contagem Regressiva</Typography>
                <Countdown
                  date={eventDate}
                  renderer={(props) => <CountdownRenderer {...props} theme={theme} />}
                />
              </Box>
            </motion.div>
          )}

          {/* Mensagem do anfitrião */}
          {publicInvite.customText && (
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={2}>
              <Box sx={{ mb: { xs: 12, md: 18 }, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '750px' }}>
                  <HostMessage message={publicInvite.customText} theme={theme} index={2} />
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Seção de detalhes */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={3}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
              gap: { xs: 4, md: 5 }, 
              mb: { xs: 12, md: 18 } 
            }}>
              <DetailCard 
                icon={EventIcon} 
                title="Data" 
                value={formattedDate} 
                theme={theme} 
                index={3.1} 
              />
              <DetailCard 
                icon={AccessTimeIcon} 
                title="Horário" 
                value={formattedTime || 'A definir'} 
                theme={theme} 
                index={3.2} 
              />
              <DetailCard 
                icon={LocationOnIcon} 
                title="Local" 
                value={publicInvite.event?.location || 'A definir'} 
                theme={theme} 
                index={3.3} 
              />
            </Box>
          </motion.div>

          {/* Seção do mapa */}
          {publicInvite.event?.location && mapCenter && (
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={4}>
              <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8 } }}>Como Chegar</Typography>
              <Box sx={{
                height: { xs: 350, sm: 450, md: 500 },
                mb: { xs: 12, md: 18 },
                // borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                <ThemedMap
                  center={mapCenter}
                  zoom={mapZoom}
                  markerPosition={mapMarkerPos}
                  markerPopupText={mapMarkerText}
                  theme={theme}
                  mapStyle="mapbox://styles/mapbox/light-v11" // Estilo mais contrastante
                />
              </Box>
            </motion.div>
          )}

          {/* Seção de confirmação */}
          <motion.div 
            ref={confirmSectionRef}
            variants={fadeInUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }} 
            custom={5}
          >
            <Paper 
              elevation={6}
              sx={{ 
                p: { xs: 4, sm: 6 }, 
                textAlign: 'center',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                }}
              >
                Confirme sua Presença
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 5, 
                  color: 'text.secondary', 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontSize: '1.1rem',
                }}
              >
                Sua resposta é muito importante para nós! Por favor, confirme se poderemos contar com sua presença neste dia especial.
              </Typography>
              
              {/* Status de confirmação */}
              {confirmationStatus && (
                <Grow in={true}>
                  <Alert 
                    severity={confirmationStatus === 'confirmed' ? 'success' : 'info'}
                    sx={{ 
                      mb: 4, 
                      justifyContent: 'center',
                      '& .MuiAlert-message': { fontSize: '1.1rem' }
                    }}
                  >
                    {confirmationStatus === 'confirmed' 
                      ? 'Sua presença está confirmada! Agradecemos sua resposta.' 
                      : 'Você indicou que não poderá comparecer. Sentiremos sua falta!'}
                  </Alert>
                </Grow>
              )}
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
              >
                {/* Botão de confirmação */}
                <Button
                  variant={confirmationStatus === 'confirmed' ? 'contained' : 'outlined'}
                  color="success"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleRsvp('confirmed')}
                  disabled={rsvpLoading}
                  sx={{ 
                    minWidth: 220,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderRadius: '50px',
                    boxShadow: confirmationStatus === 'confirmed' ? '0 8px 16px rgba(76, 175, 80, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)',
                    }
                  }}
                >
                  {rsvpLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Presença'}
                </Button>
                
                {/* Botão de recusa */}
                <Button
                  variant={confirmationStatus === 'declined' ? 'contained' : 'outlined'}
                  color="error"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => handleRsvp('declined')}
                  disabled={rsvpLoading}
                  sx={{ 
                    minWidth: 220,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderRadius: '50px',
                    boxShadow: confirmationStatus === 'declined' ? '0 8px 16px rgba(244, 67, 54, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(244, 67, 54, 0.4)',
                    }
                  }}
                >
                  {rsvpLoading ? <CircularProgress size={24} color="inherit" /> : 'Não Poderei Comparecer'}
                </Button>
              </Stack>
            </Paper>
          </motion.div>

        </Container>

        {/* Rodapé */}
        <Box 
          component="footer" 
          sx={{ 
            py: 4, 
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            mt: 8,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} ConviteCerto • Todos os direitos reservados
          </Typography>
        </Box>

        {/* Snackbar para notificações */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RsvpPage;
// RsvpPage.js