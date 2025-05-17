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
  createTheme, // Import createTheme directly
  Stack,
  Button,
  Icon,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { fetchPublicInvite } from '../../store/actions/inviteActions'; // Adjust path if needed
import { updateGuestStatus } from '../../store/actions/guestActions'; // Adjust path if needed
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';

// Import the MINIMALIST theme generator and fallback
import {
    generateMinimalThemeConfig,
    fallbackMinimalTheme
} from './components/themes';
// Removed ParticleBackground import
import ElegantLoadingIndicator from './components/ElegantLoadingIndicator';
import CountdownRenderer from './components/CountdownRenderer';
import DetailCard from './components/DetailCard';
import HostMessage from './components/HostMessage';
import ThemedMap from './components/ThemedMap';

// --- Configuration Flag --- //
// Set to true to use dynamic theme based on invite colors.
// Set to false to use the default fallbackMinimalTheme.
const USE_DYNAMIC_THEME = true; // Defaulting to FALSE as requested

// --- Framer Motion Variants (Subtle Fade-in) --- //
const subtleFadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }, // Slightly faster duration
  }),
};

// Bounce animation for scroll arrow (kept subtle)
const bounceAnimation = {
  y: ["0%", "-15%", "0%"],
  opacity: [0.6, 0.9, 0.6],
  transition: {
    duration: 1.8,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  },
};

// --- Main RsvpPage Component (Minimalist v2 with Theme Flag) --- //
const RsvpPage = () => {
  const { guestId } = useParams();
  const dispatch = useDispatch();
  const { publicInvite, loading, error } = useSelector(state => state.invites);
  const { loading: rsvpLoading, error: rsvpError, messageStatus } = useSelector(state => state.guests);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // --- Theme Selection Logic with Flag --- //
  const theme = useMemo(() => {
    if (USE_DYNAMIC_THEME && publicInvite) {
      // Use dynamic theme only if flag is true AND data is loaded
      const personalization = {
        bgColor: publicInvite.bgColor,
        textColor: publicInvite.textColor,
        accentColor: publicInvite.accentColor,
        fontFamily: publicInvite.fontFamily,
      };
      const themeConfig = generateMinimalThemeConfig(personalization);
      return createTheme(themeConfig);
    } else {
      // Use fallback minimal theme if flag is false OR data not loaded
      return fallbackMinimalTheme;
    }
  }, [publicInvite]); // Dependency remains publicInvite to react to data loading

  // State for map coordinates
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapMarkerPos, setMapMarkerPos] = useState(null);
  const [mapMarkerText, setMapMarkerText] = useState('');

  // Fetch invite data
  useEffect(() => {
    if (guestId) {
      dispatch(fetchPublicInvite(guestId));
    }
  }, [dispatch, guestId]);

  // Geocoding Placeholder - TODO: Implement real geocoding
  useEffect(() => {
    if (publicInvite?.event?.location) {
      const locationString = publicInvite.event.location;
      setMapMarkerText(`${publicInvite.event.title || 'Local do Evento'}<br/>${locationString}`);

      // --- Placeholder Geocoding Logic --- //
      const geocodeLocation = async (location) => {
        console.warn("Geocoding not implemented. Using placeholder coordinates.");
        if (location.toLowerCase().includes("salvador")) return [-12.9777, -38.5016];
        if (location.toLowerCase().includes("são paulo")) return [-23.5505, -46.6333];
        return [-14.2350, -51.9253]; // Fallback
      };
      // --- End Placeholder --- //

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

  // Handle RSVP
  const handleRsvp = (status) => {
    if (guestId) {
      dispatch(updateGuestStatus(guestId, status));
    }
  };

  // Handle Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

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

  // --- Render Logic --- //

  // Use selected theme for loading indicator
  if (loading) {
    return <ElegantLoadingIndicator theme={theme} />;
  }

  // Use selected theme for error/warning messages
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 'sm' }}>Erro ao carregar os dados do convite: {error}</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  if (!publicInvite) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Alert severity="warning" sx={{ width: '100%', maxWidth: 'sm' }}>Convite não encontrado ou inválido.</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  // Format event date and time
  const eventDate = publicInvite.event?.date ? new Date(publicInvite.event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Data a definir';
  const formattedTime = eventDate ? eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  // Determine Mapbox style based on theme mode (light/dark)
  const mapStyle = theme.palette.mode === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11";

  return (
    <ThemeProvider theme={theme}>
      {/* Main container using selected theme background */}
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
        {/* Removed ParticleBackground */}

        {/* Fullscreen Intro Section - Adjusted Padding */}
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
            pt: { xs: 12, md: 16 }, // Increased top padding
            pb: { xs: 20, md: 24 }, // Increased bottom padding
            px: 3,
          }}
        >
          <motion.div variants={subtleFadeInUp} initial="hidden" animate="visible" custom={1}>
            {/* Title uses accent color from theme */}
            <Typography variant="h1" sx={{ mb: 2 }}>
              {publicInvite.title || 'Você está convidado!'}
            </Typography>
          </motion.div>
          <motion.div variants={subtleFadeInUp} initial="hidden" animate="visible" custom={2}>
            <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              {publicInvite.event?.title || 'Para um evento especial'}
            </Typography>
          </motion.div>

          {/* Scroll Down Arrow */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              translateX: '-50%',
              cursor: 'pointer',
            }}
            animate={bounceAnimation}
            onClick={() => {
              const nextSection = document.getElementById('content-start');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: '3rem', color: 'text.secondary' }} />
          </motion.div>
        </Box>

        {/* Content Container - Adjusted Padding */}
        <Container id="content-start" maxWidth="md" sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 12, md: 20 }, position: 'relative', zIndex: 1 }}>

          {/* Countdown Section */}
          {eventDate && eventDate > new Date() && (
            <motion.div variants={subtleFadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={1}>
              <Box sx={{ mb: { xs: 12, md: 18 } }}> {/* Increased margin bottom */}
                <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8 } }}>Contagem Regressiva</Typography>
                {/* Pass selected theme to CountdownRenderer */}
                <Countdown
                  date={eventDate}
                  renderer={(props) => <CountdownRenderer {...props} theme={theme} />}
                />
              </Box>
            </motion.div>
          )}

          {/* Host Message Section */}
          {publicInvite.customText && (
             <motion.div variants={subtleFadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={2}>
                <Box sx={{ mb: { xs: 12, md: 18 }, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: '750px' }}>
                        {/* Pass selected theme to HostMessage */}
                        <HostMessage message={publicInvite.customText} theme={theme} index={2} />
                    </Box>
                </Box>
             </motion.div>
          )}

          {/* Details Section - Adjusted Grid Layout and Card Style */}
          <motion.div variants={subtleFadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={3}>
            {/* Ensure 3 columns on sm screens and up */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 4, md: 5 }, mb: { xs: 12, md: 18 } }}>
              {/* Pass selected theme and index to DetailCard */}
              <DetailCard icon={EventIcon} title="Data" value={formattedDate} theme={theme} index={3.1} />
              <DetailCard icon={AccessTimeIcon} title="Horário" value={formattedTime || 'A definir'} theme={theme} index={3.2} />
              <DetailCard icon={LocationOnIcon} title="Local" value={publicInvite.event?.location || 'A definir'} theme={theme} index={3.3} />
            </Box>
          </motion.div>

          {/* Map Section - Minimal Styling */}
          {publicInvite.event?.location && mapCenter && (
            <motion.div variants={subtleFadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={4}>
              <Typography variant="h3" align="center" sx={{ mb: { xs: 6, md: 8 } }}>Como Chegar</Typography>
              <Box sx={{
                  height: { xs: 350, sm: 450, md: 500 }, // Adjusted height
                  mb: { xs: 12, md: 18 },
                  borderRadius: theme.shape.borderRadius, // Use theme radius
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`, // Use theme divider for subtle border
                  // Removed explicit shadow
              }}>
                {/* Pass selected theme and mapStyle to ThemedMap */}
                <ThemedMap
                  center={mapCenter}
                  zoom={mapZoom}
                  markerPosition={mapMarkerPos}
                  markerPopupText={mapMarkerText}
                  theme={theme}
                  mapStyle={mapStyle}
                />
              </Box>
            </motion.div>
          )}

          {/* RSVP Action Section - Minimal Styling */}
          <motion.div variants={subtleFadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={5}>
            {/* Paper uses selected theme styles via ThemeProvider */}
            <Paper sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}> {/* Adjusted padding */}
              <Typography variant="h3" sx={{ mb: 3 }}>Confirmar Presença</Typography>
              <Typography variant="body1" sx={{ mb: 5, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                Sua resposta é muito importante para nós! Por favor, confirme se poderemos contar com sua presença neste dia especial.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center"> {/* Reduced spacing */}
                {/* Confirm Button: Use 'contained' variant */}
                <Button
                  variant="contained"
                  // color="primary" // Let the theme handle the color via MuiButton overrides
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleRsvp('confirmed')}
                  disabled={rsvpLoading}
                  sx={{ minWidth: 200 }} // Adjusted minWidth
                >
                  {rsvpLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Presença'}
                </Button>
                {/* Decline Button: Use 'outlined' variant */}
                <Button
                  variant="outlined"
                  // color="inherit" // Let the theme handle the color via MuiButton overrides
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => handleRsvp('declined')}
                  disabled={rsvpLoading}
                  sx={{ minWidth: 200 }} // Adjusted minWidth
                >
                  {rsvpLoading ? <CircularProgress size={24} color="inherit" /> : 'Não Poderei Comparecer'}
                </Button>
              </Stack>
              {/* Display current RSVP status using selected theme colors */}
              {publicInvite.guest?.status && (
                <Typography variant="body2" sx={{ mt: 4 }}>
                  Sua resposta atual: <strong style={{ color: publicInvite.guest.status === 'confirmed' ? theme.palette.button.confirmBg : theme.palette.button.declineText }}>
                    {publicInvite.guest.status === 'confirmed' ? 'Presença Confirmada' : 'Não Comparecerá'}
                  </strong>
                </Typography>
              )}
            </Paper>
          </motion.div>

        </Container>

        {/* Snackbar - Uses selected theme via ThemeProvider */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RsvpPage;

