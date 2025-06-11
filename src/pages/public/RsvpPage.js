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
import ImpactfulConfirmationFeedback from './components/ImpactfulConfirmationFeedback';

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

// Função para geocodificação melhorada usando API do OpenStreetMap
const geocodeLocation = async (location) => {
  try {
    // Limpar e formatar o endereço
    const cleanLocation = location.trim();
    console.log('minha loccc', cleanLocation)
    // Primeiro, tentar busca estruturada se possível
    const parts = cleanLocation.split(',').map(part => part.trim());
    
    let searchUrl;
    
    if (parts.length >= 2) {

      // Busca livre para endereços simples
      searchUrl = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(cleanLocation + ', Brazil')}&` +
      `format=json&` +
      `limit=1&` +
      `addressdetails=1&` +
      `countrycodes=br`;

    } else {
      // Busca estruturada para endereços com múltiplas partes
      const city = parts[parts.length - 2]; // Penúltimo elemento (cidade)
      const state = parts[parts.length - 1]; // Último elemento (estado)
      searchUrl = `https://nominatim.openstreetmap.org/search?` +
        `city=${encodeURIComponent(city)}&` +
        `state=${encodeURIComponent(state)}&` +
        `country=Brazil&` +
        `format=json&` +
        `limit=1&` +
        `addressdetails=1`;
    }
    
    console.log('Geocoding URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'RSVP-App/1.0 (contact@example.com)' // User-Agent obrigatório
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geocoding response:', data);
    
    if (data && data.length > 0) {
      const result = data[0];
      // Mapbox espera [longitude, latitude], não [latitude, longitude]
      return [parseFloat(result.lon), parseFloat(result.lat)];
    }
    
    // Se não encontrou, tentar busca mais ampla
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(cleanLocation)}&` +
      `format=json&` +
      `limit=1&` +
      `countrycodes=br`;
    
    console.log('Fallback geocoding URL:', fallbackUrl);
    
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'RSVP-App/1.0 (contact@example.com)'
      }
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      console.log('Fallback geocoding response:', fallbackData);
      
      if (fallbackData && fallbackData.length > 0) {
        const result = fallbackData[0];
        // Mapbox espera [longitude, latitude], não [latitude, longitude]
        return [parseFloat(result.lon), parseFloat(result.lat)];
      }
    }
    
    // Fallback para coordenadas do Brasil se não encontrar nada
    console.warn('Geocodificação falhou, usando coordenadas do Brasil');
    return [-51.9253, -14.2350]; // [longitude, latitude] para o Brasil
    
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    // Fallback para coordenadas do Brasil em caso de erro
    return [-51.9253, -14.2350]; // [longitude, latitude] para o Brasil
  }
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

      // Usar geocodificação real
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
          backgroundImage: publicInvite.imageUrl 
            ? `linear-gradient(135deg, rgba(106,27,154,0.8) 0%, rgba(233,30,99,0.7) 100%), url(${publicInvite.imageUrl})`
            : 'linear-gradient(135deg, rgba(106,27,154,0.95) 0%, rgba(233,30,99,0.85) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Confetti para animação de confirmação */}
        {showConfetti && (
          <Confetti 
            recycle={false} 
            numberOfPieces={200}
            confettiSource={{
              x: window.innerWidth / 2,
              y: window.innerHeight * 0.8, // 80% da altura da tela (onde estão os botões)
              w: 10,
              h: 10
            }}
            initialVelocityY={-20}
            gravity={0.3}
          />
        )}

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
              {publicInvite.eventTitle || publicInvite.event?.title || 'Para um evento especial'}
            </Typography>
          </motion.div>

          {/* Descrição do evento */}
          {publicInvite.description && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2.5}>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary', 
                fontWeight: 300,
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}>
                {publicInvite.description}
              </Typography>
            </motion.div>
          )}

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
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
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
                borderRadius: 0, // Removendo borda arredondada
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
                  mapStyle="mapbox://styles/mapbox/streets-v11"
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
                <ImpactfulConfirmationFeedback status={confirmationStatus} theme={theme} />
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
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    background: confirmationStatus === 'confirmed' 
                      ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                      : 'transparent',
                    border: '2px solid #4caf50',
                    color: confirmationStatus === 'confirmed' ? '#ffffff' : '#4caf50',
                    boxShadow: confirmationStatus === 'confirmed' 
                      ? '0 8px 16px rgba(76, 175, 80, 0.3)' 
                      : '0 4px 12px rgba(76, 175, 80, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)',
                      background: confirmationStatus === 'confirmed' 
                        ? 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)'
                        : 'rgba(76, 175, 80, 0.1)',
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
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    background: confirmationStatus === 'declined' 
                      ? 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)'
                      : 'transparent',
                    border: '2px solid #f44336',
                    color: confirmationStatus === 'declined' ? '#ffffff' : '#f44336',
                    boxShadow: confirmationStatus === 'declined' 
                      ? '0 8px 16px rgba(244, 67, 54, 0.3)' 
                      : '0 4px 12px rgba(244, 67, 54, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(244, 67, 54, 0.4)',
                      background: confirmationStatus === 'declined' 
                        ? 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)'
                        : 'rgba(244, 67, 54, 0.1)',
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Feito com ❤️ para você
          </Typography>
        </Box>

        {/* Snackbar para notificações */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RsvpPage;

