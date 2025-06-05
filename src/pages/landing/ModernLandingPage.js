import React, { useState, useEffect, useRef, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  Tooltip,
  Fade,
  Slide,
  Grid,
  Zoom,
  Paper,
  Divider
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  WhatsApp as WhatsAppIcon,
  Devices as DevicesIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowForward as ArrowForwardIcon,
  ContactPhone as ContactPhoneIcon,
  Celebration as CelebrationIcon,
  CardGiftcard as CardGiftcardIcon
} from '@mui/icons-material';
import InvitePreviewCard from '../../components/InvitePreviewCard';
import { ColorModeContext } from '../../theme/ThemeConfig';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${'#3c1f80'} 0%, ${'#5e35b1'} 50%, ${'#4d2c91'} 100%)`,
  color: theme.palette.common.white,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  textShadow: '0px 4px 8px rgba(0,0,0,0.1)',
}));

const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.4s ease',
  background: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  }
}));

const ScrollIndicator = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  color: theme.palette.common.white,
  border: `2px solid ${theme.palette.common.white}`,
  animation: 'bounce 2s infinite ease-in-out',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0) translateX(-50%)',
    },
    '40%': {
      transform: 'translateY(-20px) translateX(-50%)',
    },
    '60%': {
      transform: 'translateY(-10px) translateX(-50%)',
    }
  }
}));

const ParallaxBox = styled(Box)(({ theme, offset }) => ({
  position: 'absolute',
  transition: 'transform 0.1s ease-out',
  transform: `translateY(${offset}px)`,
}));

const DemoCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  }
}));

const ModernLandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    features: false,
    howItWorks: false,
    demo: false,
    testimonials: false,
  });
  
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const demoRef = useRef(null);

  const colorMode = useContext(ColorModeContext);

  // Handle scroll events for parallax and animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check visibility for animations
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setIsVisible(prev => ({
          ...prev,
          features: rect.top < window.innerHeight * 0.75
        }));
      }
      
      if (howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect();
        setIsVisible(prev => ({
          ...prev,
          howItWorks: rect.top < window.innerHeight * 0.75
        }));
      }
      
      if (demoRef.current) {
        const rect = demoRef.current.getBoundingClientRect();
        setIsVisible(prev => ({
          ...prev,
          demo: rect.top < window.innerHeight * 0.75
        }));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const features = [
    {
      title: 'Integração com WhatsApp',
      description: 'Envie convites, lembretes e receba confirmações diretamente pelo WhatsApp.',
      icon: <WhatsAppIcon fontSize="large" sx={{ fontSize: 48, color: '#25D366' }} />,
      delay: 0
    },
    {
      title: 'Importação de Contatos',
      description: 'Importe seus contatos facilmente para enviar convites em massa sem esforço.',
      icon: <ContactPhoneIcon fontSize="large" sx={{ fontSize: 48, color: theme.palette.warning.main }} />,
      delay: 100
    },
    {
      title: 'Design Responsivo',
      description: 'Interface adaptada para qualquer dispositivo, do smartphone ao desktop.',
      icon: <DevicesIcon fontSize="large" sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      delay: 200
    },
    {
      title: 'Alta Performance',
      description: 'Carregamento rápido e experiência fluida para organizadores e convidados.',
      icon: <SpeedIcon fontSize="large" sx={{ fontSize: 48, color: theme.palette.success.main }} />,
      delay: 300
    },
    {
      title: 'Segurança Avançada',
      description: 'Dados protegidos com criptografia e autenticação segura.',
      icon: <SecurityIcon fontSize="large" sx={{ fontSize: 48, color: theme.palette.error.main }} />,
      delay: 400
    },
    {
      title: 'Estatísticas Detalhadas',
      description: 'Acompanhe confirmações e visualize dados importantes do seu evento.',
      icon: <AnalyticsIcon fontSize="large" sx={{ fontSize: 48, color: theme.palette.info.main }} />,
      delay: 500
    }
  ];

  const demoTemplates = [
    {
      title: 'Casamento Elegante',
      description: 'Template sofisticado para casamentos e cerimônias formais',
      color: '#D4AF37',
      icon: <CelebrationIcon sx={{ fontSize: 40, color: '#D4AF37' }} />
    },
    {
      title: 'Aniversário Festivo',
      description: 'Design colorido e animado para festas de aniversário',
      color: '#FF4081',
      icon: <CardGiftcardIcon sx={{ fontSize: 40, color: '#FF4081' }} />
    },
    {
      title: 'Corporativo Profissional',
      description: 'Layout clean e profissional para eventos corporativos',
      color: '#0288D1',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#0288D1' }} />
    }
  ];
  
  return (
    <Box sx={{ overflow: 'hidden' }}>
    <Box sx={{ ml: 'auto', position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Tooltip title={theme.palette.mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}>
            <IconButton
                edge="end"
                color="inherit"
                onClick={colorMode.toggleColorMode}
            >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    </Box>
      {/* Hero Section - Full screen with parallax effect */}
      <HeroSection>
        {/* Decorative elements with parallax effect */}
        <ParallaxBox 
          offset={scrollY * 0.2} 
          sx={{ 
            top: '10%', 
            right: '5%', 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0
          }} 
        />
        
        <ParallaxBox 
          offset={scrollY * -0.1} 
          sx={{ 
            bottom: '15%', 
            left: '10%', 
            width: '400px', 
            height: '400px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0
          }} 
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={isVisible.hero} timeout={1000}>
            <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: { xs: 5, md: 6 }
            }}
            >
            {/* ===== COLUNA 1: CONTEÚDO DE TEXTO E BOTÕES ===== */}
            <Box
                sx={{
                // Agora ocupa 100% no mobile e 50% no desktop
                width: { xs: '100%', md: '50%' },
                textAlign: { xs: 'center', md: 'left' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
                <Typography
                    variant="overline"
                    sx={{
                    color: 'common.white',
                    opacity: 0.9,
                    letterSpacing: 2,
                    display: 'block',
                    }}
                >
                    CONVITECERTO
                </Typography>
                </Box>

                <Box sx={{ position: 'relative', mb: 3 }}>
                <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    color: 'common.white',
                    textShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                >
                    Transforme seus
                </Typography>

                <Typography
                    variant="h1"
                    component="span"
                    sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    display: 'block',
                    mb: 1
                    }}
                >
                    <GradientText component="span" variant="inherit">
                    Eventos em Experiências
                    </GradientText>
                </Typography>

                <Box
                    sx={{
                    position: 'absolute',
                    width: '120px',
                    height: '8px',
                    background: theme.palette.secondary.main,
                    borderRadius: '4px',
                    bottom: '-16px',
                    left: { xs: 'calc(50% - 60px)', md: '4px' }
                    }}
                />
                </Box>

                <Typography
                variant="h5"
                sx={{
                    mt: 4,
                    mb: 4,
                    fontWeight: 400,
                    color: 'common.white',
                    opacity: 0.9,
                    maxWidth: 500,
                    lineHeight: 1.5,
                    mx: { xs: 'auto', md: 0 }
                }}
                >
                Crie convites digitais elegantes com confirmação via WhatsApp.
                <Box component="span" sx={{ fontWeight: 700 }}> Simples, rápido e totalmente gratuito.</Box>
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mt: 5 }}>
                <HeroButton
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/register')}
                >
                    Criar Conta Grátis
                </HeroButton>

                <HeroButton
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'common.white',
                    '&:hover': {
                        borderColor: 'rgba(255,255,255,0.8)',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                    }}
                >
                    Entrar
                </HeroButton>
                </Box>
            </Box>

            {/* ===== COLUNA 2: INVITE PREVIEW CARD (VISÍVEL APENAS NO DESKTOP) ===== */}
            <Box
                sx={{
                // A MUDANÇA PRINCIPAL ESTÁ AQUI:
                display: { xs: 'none', md: 'flex' }, // Esconde no mobile, mostra no desktop
                width: { md: '50%' }, // Ocupa 50% da largura apenas no desktop
                justifyContent: 'center',
                alignItems: 'center'
                }}
            >
                <InvitePreviewCard
                scrollY={scrollY}
                isVisible={true}
                inviteData={{
                    title: "Ana & Carlos",
                    subtitle: "Convidam para seu casamento",
                    date: "Sábado, 15 de Outubro • 19:30",
                    location: "Espaço Villa Garden",
                    address: "Rua das Flores, 123 - São Paulo"
                }}
                />
            </Box>
            </Box>
        </Fade>
        </Container>
        
        <ScrollIndicator onClick={scrollToFeatures}>
          <KeyboardArrowDownIcon />
        </ScrollIndicator>
      </HeroSection>
      
      {/* Features Section */}
      <Box 
        ref={featuresRef}
        sx={{ 
          py: { xs: 10, md: 15 },
          background: theme.palette.background.default
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Fade in={isVisible.features} timeout={800}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main',
                    letterSpacing: 2,
                    mb: 1,
                    display: 'block'
                  }}
                >
                  RECURSOS
                </Typography>
                
                <Typography 
                  variant="h2" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary'
                  }}
                >
                  Tudo que você precisa
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 700,
                    mx: 'auto',
                    color: 'text.secondary',
                    mb: 8
                  }}
                >
                  Ferramentas poderosas para criar convites incríveis e gerenciar seus eventos com facilidade
                </Typography>
              </Box>
            </Fade>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
              {features.map((feature, index) => (
                <Zoom key={index} in={isVisible.features} style={{ transitionDelay: `${feature.delay}ms` }}>
                  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' } }}>
                    <FeatureCard>
                      <CardContent sx={{ p: 4, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 3 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" component="h3" gutterBottom fontWeight={600} color="text.primary">
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Box>
                </Zoom>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Demo Section */}
      <Box 
        ref={demoRef}
        sx={{ 
          py: { xs: 10, md: 1 },
          background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Fade in={isVisible.demo} timeout={800}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main',
                    letterSpacing: 2,
                    mb: 1,
                    display: 'block'
                  }}
                >
                  DEMONSTRAÇÃO
                </Typography>
                
                <Typography 
                  variant="h2" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary'
                  }}
                >
                  Modelos de convites
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 700,
                    mx: 'auto',
                    color: 'text.secondary',
                    mb: 8
                  }}
                >
                  Escolha entre diversos templates elegantes para qualquer tipo de evento
                </Typography>
              </Box>
            </Fade>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
              {demoTemplates.map((template, index) => (
                <Fade key={index} in={isVisible.demo} timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' } }}>
                    <DemoCard>
                      <Box 
                        sx={{ 
                          height: 200, 
                          background: `linear-gradient(135deg, ${template.color}40, ${template.color}90)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        {template.icon}
                        <Typography variant="h5" sx={{ color: 'white', mt: 2, fontWeight: 600 }}>
                          {template.title}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          {template.description}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          sx={{ mt: 2 }}
                          fullWidth
                          onClick={() => navigate('/register')}
                        >
                          Usar este modelo
                        </Button>
                      </Box>
                    </DemoCard>
                  </Box>
                </Fade>
              ))}
            </Box>
            
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                E muitos outros modelos disponíveis na plataforma!
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  borderRadius: 50,
                  px: 4,
                  py: 1.5
                }}
              >
                Ver todos os modelos
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box 
        ref={howItWorksRef}
        sx={{ 
          py: { xs: 10 },
          background: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
        <Box
            sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Coluna no mobile, linha no desktop
            alignItems: 'center', // Alinha os itens ao centro verticalmente
            gap: { xs: 6, md: 8 } // Espaçamento entre as colunas, similar ao `spacing={8}`
            }}
        >
            {/* ===== COLUNA 1: COMO FUNCIONA (TEXTO) ===== */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Slide direction="right" in={isVisible.howItWorks} timeout={800}>
                <Box>
                <Typography
                    variant="overline"
                    sx={{
                    color: 'primary.main',
                    letterSpacing: 2,
                    mb: 1,
                    display: 'block'
                    }}
                >
                    PROCESSO SIMPLES
                </Typography>

                <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: 'text.primary'
                    }}
                >
                    Como funciona
                </Typography>

                <Box sx={{ mb: 6 }}>
                    {/* Lista de passos (já estava usando flex, mantido como está) */}
                    <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', mr: 3, flexShrink: 0 }}>1</Box>
                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">Crie seu evento</Typography>
                        <Typography variant="body1" color="text.secondary">Defina data, local e detalhes do seu evento em poucos minutos com nossa interface intuitiva.</Typography>
                    </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', mr: 3, flexShrink: 0 }}>2</Box>
                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">Personalize o convite</Typography>
                        <Typography variant="body1" color="text.secondary">Escolha entre diversos templates elegantes ou crie seu próprio design personalizado.</Typography>
                    </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', mr: 3, flexShrink: 0 }}>3</Box>
                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">Importe seus contatos</Typography>
                        <Typography variant="body1" color="text.secondary">Importe contatos do seu celular ou adicione manualmente para criar sua lista de convidados.</Typography>
                    </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', mr: 3, flexShrink: 0 }}>4</Box>
                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">Envie via WhatsApp</Typography>
                        <Typography variant="body1" color="text.secondary">Envie convites diretamente pelo WhatsApp para todos os seus convidados com um clique.</Typography>
                    </Box>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', mr: 3, flexShrink: 0 }}>5</Box>
                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">Gerencie confirmações</Typography>
                        <Typography variant="body1" color="text.secondary">Acompanhe as respostas em tempo real e envie lembretes automaticamente.</Typography>
                    </Box>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ borderRadius: 50, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600, textTransform: 'none', boxShadow: '0 8px 16px rgba(94, 53, 177, 0.2)', '&:hover': { boxShadow: '0 12px 24px rgba(94, 53, 177, 0.3)', transform: 'translateY(-2px)' } }}
                >
                    Comece Agora
                </Button>
                </Box>
            </Slide>
            </Box>

            {/* ===== COLUNA 2: VISUALIZAÇÃO DO PROCESSO ===== */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Slide direction="left" in={isVisible.howItWorks} timeout={800}>
                <Box sx={{ position: 'relative' }}>
                {/* Process visualization (conteúdo mantido como está) */}
                <Box
                    sx={{ mt: 40, width: '100%', maxWidth: 800, height: 'auto', backgroundColor: theme.palette.background.default, borderRadius: 4, display: 'flex', flexDirection: 'column', mx: 'auto', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)', transform: `translateY(${scrollY * -0.05}px)`, transition: 'transform 0.1s ease-out', border: `1px solid ${theme.palette.divider}`, overflow: 'hidden', p: 3 }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                        <WhatsAppIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" color="text.primary">Processo de Envio de Convites</Typography>
                    </Box>
                    {/* Process steps */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Step 1 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>1</Box>
                        <Paper sx={{ p: 2, flex: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" color="text.primary"><b>Criar evento</b> - Defina nome, data, local e detalhes</Typography>
                        </Paper>
                    </Box>
                    {/* Connector */}
                    <Box sx={{ display: 'flex' }}><Box sx={{ width: 32, mr: 2, display: 'flex', justifyContent: 'center' }}><Box sx={{ width: 2, height: 20, bgcolor: theme.palette.primary.main }} /></Box><Box sx={{ flex: 1 }} /></Box>
                    {/* Step 2 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>2</Box>
                        <Paper sx={{ p: 2, flex: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" color="text.primary"><b>Personalizar convite</b> - Escolha um template e personalize</Typography>
                        </Paper>
                    </Box>
                    {/* Connector */}
                    <Box sx={{ display: 'flex' }}><Box sx={{ width: 32, mr: 2, display: 'flex', justifyContent: 'center' }}><Box sx={{ width: 2, height: 20, bgcolor: theme.palette.primary.main }} /></Box><Box sx={{ flex: 1 }} /></Box>
                    {/* Step 3 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'warning.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>3</Box>
                        <Paper sx={{ p: 2, flex: 1, bgcolor: theme.palette.warning.light + '20', border: `1px solid ${theme.palette.warning.light}` }}>
                        <Typography variant="body2" color="text.primary"><b>Importar contatos</b> - Adicione seus convidados facilmente</Typography>
                        </Paper>
                    </Box>
                    {/* Connector */}
                    <Box sx={{ display: 'flex' }}><Box sx={{ width: 32, mr: 2, display: 'flex', justifyContent: 'center' }}><Box sx={{ width: 2, height: 20, bgcolor: theme.palette.primary.main }} /></Box><Box sx={{ flex: 1 }} /></Box>
                    {/* Step 4 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>4</Box>
                        <Paper sx={{ p: 2, flex: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" color="text.primary"><b>Enviar convites</b> - Distribua via WhatsApp com um clique</Typography>
                        </Paper>
                    </Box>
                    {/* Connector */}
                    <Box sx={{ display: 'flex' }}><Box sx={{ width: 32, mr: 2, display: 'flex', justifyContent: 'center' }}><Box sx={{ width: 2, height: 20, bgcolor: theme.palette.primary.main }} /></Box><Box sx={{ flex: 1 }} /></Box>
                    {/* Step 5 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>5</Box>
                        <Paper sx={{ p: 2, flex: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" color="text.primary"><b>Gerenciar confirmações</b> - Acompanhe respostas em tempo real</Typography>
                        </Paper>
                    </Box>
                    </Box>
                </Box>
                </Box>
            </Slide>
            </Box>
        </Box>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 15 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0
          }} 
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0
          }} 
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'common.white'
            }}
          >
            Crie quantos eventos quiser
          </Typography>
          <Typography 
            variant="h3" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'common.white'
            }}
          >
            Totalmente grátis!
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 6,
              fontWeight: 400,
              opacity: 0.9,
              maxWidth: 700,
              mx: 'auto',
              color: 'common.white'
            }}
          >
            Junte-se a milhares de pessoas que já estão criando convites digitais elegantes e gerenciando seus eventos com facilidade.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <HeroButton 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/register')}
            >
              Criar Conta Grátis
            </HeroButton>
            
            <HeroButton 
              variant="outlined" 
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'common.white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Entrar
            </HeroButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernLandingPage;
