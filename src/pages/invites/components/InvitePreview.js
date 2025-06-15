import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';

// Importando componentes da página final para reutilização
import DetailCard from '../../public/components/DetailCard';
import CountdownRenderer from '../../public/components/CountdownRenderer';
import { generateMinimalThemeConfig } from '../../public/components/themes';

const InvitePreview = ({ 
  title, 
  eventTitle, 
  customText, 
  bgColor = '#6a1b9a', 
  accentColor = '#e91e63',
  fontFamily = 'Roboto, sans-serif',
  showActions = false,
  deviceViewMode,
  onWhatsAppTest
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estado para controlar a visualização em diferentes dispositivos
  const [deviceView, setDeviceView] = useState(deviceViewMode);

  // Atualiza o estado deviceView quando deviceViewMode muda (vem do pai)
  useEffect(() => {
    setDeviceView(deviceViewMode);
  }, [deviceViewMode]);
  
  // Gerar tema baseado nas cores e fonte selecionadas
  const themeConfig = generateMinimalThemeConfig({
    bgColor,
    accentColor,
    fontFamily
  });
  
  const previewTheme = createTheme(themeConfig);
  
  // Data fictícia para o evento (30 dias a partir de hoje)
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 30);
  
  // Formatar data e hora para exibição
  const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const formattedTime = eventDate.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Calcular tempo restante para o evento
  const timeRemaining = eventDate.getTime() - new Date().getTime();
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
  // Configurações de escala e tamanho para diferentes dispositivos
  const deviceSettings = {
    mobile: {
      width: isMobile ? '100%' : '320px',
      height: isMobile ? 'auto' : '580px',
      scale: isMobile ? 1 : 0.8,
      containerHeight: isMobile ? 'auto' : '2500px'
    },
    tablet: {
      width: isMobile ? '100%' : '600px',
      height: isMobile ? 'auto' : '800px',
      scale: isMobile ? 1 : 0.5,
      containerHeight: isMobile ? 'auto' : '2500px'
    },
    desktop: {
      width: isMobile ? '100%' : '1024px',
      height: isMobile ? 'auto' : '768px',
      scale: isMobile ? 1 : 0.4,
      containerHeight: isMobile ? 'auto' : '2500px'
    }
  };
  
  const currentDevice = deviceSettings[deviceView];
  
  // Função para mudar a visualização do dispositivo
  const handleDeviceChange = (event, newValue) => {
    setDeviceView(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%',
      mb: isMobile ? 2 : 4
    }}>
      {/* Preview da página RSVP */}
      <Box
        sx={{
          width: currentDevice.width,
          height: currentDevice.containerHeight,
          transform: isMobile ? 'none' : `scale(${currentDevice.scale})`,
          transformOrigin: 'top center',
          border: isMobile ? 'none' : '1px solid #ddd',
          borderRadius: isMobile ? 0 : '8px',
          overflow: 'hidden',
          boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0,0,0,0.15)',
          mb: isMobile ? 2 : 4,
          position: 'relative',
          bgcolor: '#fff'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(bgColor, 0.3),
              borderRadius: '4px'
            }
          }}
        >
          <ThemeProvider theme={previewTheme}>
            {/* Cabeçalho com fundo gradiente */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${bgColor} 30%, ${alpha(accentColor, 0.8)} 90%)`,
                color: '#fff',
                py: isMobile ? 4 : 8,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <Container maxWidth="md" sx={{ px: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "h4" : "h2"}
                  component="h1"
                  sx={{ 
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    fontSize: isMobile ? '1.75rem' : undefined
                  }}
                >
                  {title || 'Título do Convite'}
                </Typography>
                
                <Typography 
                  variant={isMobile ? "h6" : "h4"}
                  sx={{ 
                    mb: isMobile ? 3 : 4,
                    fontFamily: 'inherit',
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    fontSize: isMobile ? '1.25rem' : undefined
                  }}
                >
                  {eventTitle || 'Nome do Evento'}
                </Typography>
                
                <Box 
                  sx={{ 
                    p: isMobile ? 2 : 3,
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    borderRadius: 2,
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'inherit',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      fontSize: isMobile ? '0.9rem' : undefined
                    }}
                  >
                    {customText || 'Mensagem personalizada do convite...'}
                  </Typography>
                </Box>
              </Container>
            </Box>
            
            {/* Contagem regressiva */}
            <Container maxWidth="md" sx={{ py: isMobile ? 3 : 6, px: isMobile ? 2 : 3 }}>
              <Typography 
                variant={isMobile ? "h5" : "h3"} 
                align="center" 
                sx={{ mb: isMobile ? 3 : 4 }}
              >
                Contagem Regressiva
              </Typography>
              <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                <CountdownRenderer 
                  days={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  completed={timeRemaining <= 0}
                  theme={previewTheme}
                  isMobile={isMobile}
                />
              </Box>
              
              <Divider sx={{ my: isMobile ? 4 : 6 }} />
              
              {/* Detalhes do evento */}
              <Typography 
                variant={isMobile ? "h5" : "h3"} 
                align="center" 
                sx={{ mb: isMobile ? 3 : 4 }}
              >
                Detalhes do Evento
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: (deviceView === 'mobile' || isMobile) ? '1fr' : 'repeat(3, 1fr)', 
                gap: isMobile ? 2 : 4, 
                mb: isMobile ? 4 : 6 
              }}>
                <DetailCard 
                  icon={EventIcon} 
                  title="Data" 
                  value={formattedDate} 
                  theme={previewTheme} 
                  index={1}
                  isMobile={isMobile}
                />
                <DetailCard 
                  icon={AccessTimeIcon} 
                  title="Horário" 
                  value={formattedTime} 
                  theme={previewTheme} 
                  index={2}
                  isMobile={isMobile}
                />
                <DetailCard 
                  icon={LocationOnIcon} 
                  title="Local" 
                  value="Local do Evento" 
                  theme={previewTheme} 
                  index={3}
                  isMobile={isMobile}
                />
              </Box>
              
              <Divider sx={{ my: isMobile ? 4 : 6 }} />
              
              {/* Mapa (simulado) */}
              <Typography 
                variant={isMobile ? "h5" : "h3"} 
                align="center" 
                sx={{ mb: isMobile ? 3 : 4 }}
              >
                Como Chegar
              </Typography>
              <Box sx={{
                height: isMobile ? 200 : 300,
                mb: isMobile ? 4 : 6,
                borderRadius: previewTheme.shape.borderRadius,
                overflow: 'hidden',
                border: `1px solid ${previewTheme.palette.divider}`,
                bgcolor: alpha(bgColor, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Mapa será exibido aqui
                </Typography>
              </Box>
              
              <Divider sx={{ my: isMobile ? 4 : 6 }} />
              
              {/* Seção de RSVP */}
              <Paper sx={{ 
                p: isMobile ? 3 : { xs: 4, sm: 6 }, 
                textAlign: 'center' 
              }}>
                <Typography 
                  variant={isMobile ? "h5" : "h3"} 
                  sx={{ mb: isMobile ? 2 : 3 }}
                >
                  Confirmar Presença
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: isMobile ? 3 : 5, 
                    color: 'text.secondary', 
                    maxWidth: 600, 
                    mx: 'auto',
                    fontSize: isMobile ? '0.9rem' : undefined
                  }}
                >
                  Sua resposta é muito importante para nós! Por favor, confirme se poderemos contar com sua presença neste dia especial.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: (deviceView === 'mobile' || isMobile) ? 'column' : 'row', 
                  gap: 2, 
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    sx={{ 
                      minWidth: isMobile ? '100%' : 200,
                      maxWidth: isMobile ? 300 : 'none'
                    }}
                    disabled
                  >
                    Confirmar Presença
                  </Button>
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{ 
                      minWidth: isMobile ? '100%' : 200,
                      maxWidth: isMobile ? 300 : 'none'
                    }}
                    disabled
                  >
                    Não Poderei Comparecer
                  </Button>
                </Box>
              </Paper>
            </Container>
          </ThemeProvider>
        </Box>
      </Box>
      
      {/* Botão de teste no WhatsApp */}
      {showActions && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={onWhatsAppTest}
            size={isMobile ? "medium" : "large"}
            sx={{ 
              borderRadius: 10,
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.6 : 0.8,
              color: '#25D366',
              borderColor: '#25D366',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)',
              transition: 'all 0.2s ease',
              fontSize: isMobile ? '0.875rem' : undefined,
              '&:hover': {
                borderColor: '#25D366',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(37, 211, 102, 0.2)'
              }
            }}
          >
            Testar no WhatsApp
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InvitePreview;

