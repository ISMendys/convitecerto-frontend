import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { lighten, darken } from '@mui/material/styles';
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

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaXNtZW5keSIsImEiOiJjbWJsa2s1OWQxMmkwMmxwd2dwZnZsZWo1In0.TZRgfgztitfE4_RDo6IA6g';

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

const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  // Remove o '#' do início
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};


const geocodeWithMapbox = async (location, accessToken) => {
  if (!location || !accessToken) {
    return [-51.9253, -14.2350]; // Coordenadas de fallback do Brasil
  }

  // URL para a API de Geocodificação do Mapbox
  const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}&country=BR&limit=1&types=address,place,poi`;
  
  console.log('Buscando coordenadas com Mapbox:', searchUrl);
  
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.error('Erro na resposta da API Mapbox:', response.statusText);
      return [-51.9253, -14.2350];
    }
    
    const data = await response.json();
    console.log('Resposta da API Mapbox:', data);
    
    // Se encontrarmos resultados, retornamos as coordenadas do primeiro
    if (data.features && data.features.length > 0) {
      // Mapbox retorna [longitude, latitude], que é o formato correto para o mapa
      return data.features[0].geometry.coordinates;
    }
    
    console.warn('Mapbox não encontrou coordenadas para o endereço.');
    return [-51.9253, -14.2350]; // Fallback
    
  } catch (error) {
    console.error('Erro ao fazer a requisição para o Mapbox:', error);
    return [-51.9253, -14.2350]; // Fallback
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
      geocodeWithMapbox(locationString, MAPBOX_ACCESS_TOKEN).then(coords => {
        setMapCenter(coords);
        setMapMarkerPos(coords);
        // Ajusta o zoom com base no sucesso da geocodificação
        if (coords[0] === -51.9253) { // Coordenadas de fallback
          setMapZoom(4);
        } else {
          setMapZoom(16);
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
  // const prevRsvpLoading = useRef(rsvpLoading);
  // useEffect(() => {
  //   if (prevRsvpLoading.current && !rsvpLoading) {
  //     if (rsvpError) {
  //       setSnackbarMessage(`Erro ao registrar resposta: ${rsvpError}`);
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //     } else {
  //       setSnackbarMessage(messageStatus || 'Sua resposta foi registrada com sucesso!');
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  //     }
  //   }
  //   prevRsvpLoading.current = rsvpLoading;
  // }, [rsvpLoading, rsvpError, messageStatus]);

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

  let backgroundStyle = 'linear-gradient(135deg, rgba(106,27,154,0.95) 0%, rgba(233,30,99,0.85) 100%)'; // Fallback
  
  if (publicInvite) {
    const primaryRgb = hexToRgb(publicInvite.bgColor || '#6a1b9a');
    const accentRgb = hexToRgb(publicInvite.accentColor || '#e91e63');

    if (primaryRgb && accentRgb) {
      if (publicInvite.imageUrl) {
        // Com imagem: gradiente mais transparente
        backgroundStyle = `linear-gradient(135deg, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8) 0%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.7) 100%), url(${publicInvite.imageUrl})`;
      } else {
        // Sem imagem: gradiente mais opaco
        backgroundStyle = `linear-gradient(135deg, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.95) 0%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.85) 100%)`;
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* Container principal que agora só coordena o layout geral */}
      <Box 
        sx={{ 
          bgcolor: 'background.default', // Fundo padrão para toda a página
          color: 'text.primary', 
          position: 'relative', 
          overflowX: 'hidden', 
          minHeight: '100vh',
        }}
      >
        {/* Confetti para animação de confirmação */}
        {showConfetti && (
          <Confetti 
            recycle={false} 
            numberOfPieces={200}
            confettiSource={{
              x: window.innerWidth / 2,
              y: window.innerHeight * 0.8,
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
            backgroundImage: backgroundStyle,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            
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

          {publicInvite.description && (
             <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2.5}>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 300, mb: 4, maxWidth: 600, mx: 'auto' }}>
                {publicInvite.description}
              </Typography>
            </motion.div>
          )}

          {publicInvite.guest?.name && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}><PersonIcon /></Avatar>
                <Typography variant="h5">Olá, {publicInvite.guest.name}!</Typography>
              </Box>
            </motion.div>
          )}

          <motion.div
            style={{ position: 'absolute', bottom: 60, left: '50%', translateX: '-50%', cursor: 'pointer' }}
            animate={bounceAnimation}
            onClick={scrollToConfirmation}
          >
            <ExpandMoreIcon sx={{ fontSize: '3rem', color: 'text.secondary' }} />
          </motion.div>
        </Box>

        {/* Container de conteúdo */}
        <Box sx={{ bgcolor: lighten(theme.palette.primary.main, 0.7), textColor: darken(theme.palette.primary.main, 0.3) }}>
          <Container maxWidth="md" sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 12, md: 20 }, position: 'relative', zIndex: 1 }}>
            
            {/* Seção de contagem regressiva */}
            {eventDate && eventDate > new Date() && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={1}>
                <Box sx={{ mb: { xs: 12, md: 18 } }}>
                  <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8, color: darken(theme.palette.primary.main, 0.3) } }}>Contagem Regressiva</Typography>
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
                gap: { xs: 4, sm: 3 },
                mb: { xs: 12, md: 18 },
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>

                <Box sx={{ width: 260, height: 220 }}>
                  <DetailCard 
                    icon={EventIcon} 
                    title="Data" 
                    value={formattedDate} 
                    theme={theme} 
                    index={3.1}
                  />
                </Box>

                <Box sx={{ width: 260, height: 220 }}>
                  <DetailCard 
                    icon={AccessTimeIcon} 
                    title="Horário" 
                    value={formattedTime || 'A definir'} 
                    theme={theme} 
                    index={3.2}
                  />
                </Box>

                <Box sx={{ width: 260, height: 220 }}>
                  <DetailCard 
                    icon={LocationOnIcon} 
                    title="Local" 
                    value={publicInvite.event?.location || 'A definir'} 
                    theme={theme} 
                    index={3.3}
                  />
                </Box>

              </Box>
            </motion.div>

            {/* Seção do mapa */}
            {publicInvite.event?.location && mapCenter && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={4}>
                <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8, color: darken(theme.palette.primary.main, 0.3) } }}>Como Chegar</Typography>
                <Box sx={{
                  height: { xs: 350, sm: 450, md: 500 },
                  mb: { xs: 12, md: 18 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}>
                  <ThemedMap
                    center={mapCenter}
                    zoom={mapZoom}
                    markerPosition={mapMarkerPos}
                    markerPopupText={mapMarkerText}
                    rawAddressText={publicInvite.event?.location || ''}
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
                    color: darken(theme.palette.primary.main, 0.3),
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
                    color: darken(theme.palette.primary.main, 0.3),
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
        </Box>
        {/* Rodapé */}
        <Box 
          component="footer" 
          sx={{ 
            py: 4, 
            textAlign: 'center',
            borderTop: `1px solid ${lighten(theme.palette.primary.main, 0.7)}`,
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
