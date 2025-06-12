import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Check as CheckIcon,
  WhatsApp as WhatsAppIcon,
  Devices as DevicesIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  GetApp as GetAppIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Integração com WhatsApp',
      description: 'Envie convites, lembretes e receba confirmações diretamente pelo WhatsApp.',
      icon: <WhatsAppIcon fontSize="large" color="primary" />,
      color: theme.palette.primary.main
    },
    {
      title: 'Design Responsivo',
      description: 'Interface adaptada para qualquer dispositivo, do smartphone ao desktop.',
      icon: <DevicesIcon fontSize="large" color="secondary" />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Alta Performance',
      description: 'Carregamento rápido e experiência fluida para organizadores e convidados.',
      icon: <SpeedIcon fontSize="large" style={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main
    },
    {
      title: 'Segurança Avançada',
      description: 'Dados protegidos com criptografia e autenticação segura.',
      icon: <SecurityIcon fontSize="large" style={{ color: theme.palette.error.main }} />,
      color: theme.palette.error.main
    },
    {
      title: 'Estatísticas Detalhadas',
      description: 'Acompanhe confirmações e visualize dados importantes do seu evento.',
      icon: <AnalyticsIcon fontSize="large" style={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main
    },
    {
      title: 'Fácil de Usar',
      description: 'Interface intuitiva que não exige conhecimentos técnicos.',
      icon: <GetAppIcon fontSize="large" style={{ color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main
    }
  ];
  
  const plans = [
    {
      title: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      features: [
        'Até 30 convidados',
        'Envio de convites via WhatsApp',
        'Confirmações básicas',
        '1 evento ativo por vez',
        'Templates básicos'
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outlined',
      highlighted: false
    },
    {
      title: 'Premium',
      price: 'R$ 29,90',
      period: 'por mês',
      features: [
        'Até 200 convidados',
        'Envio de convites e lembretes',
        'Confirmações avançadas',
        '5 eventos ativos',
        'Todos os templates',
        'Estatísticas detalhadas',
        'Suporte prioritário'
      ],
      buttonText: 'Assinar Agora',
      buttonVariant: 'contained',
      highlighted: true
    },
    {
      title: 'Empresarial',
      price: 'R$ 99,90',
      period: 'por mês',
      features: [
        'Convidados ilimitados',
        'Envio em massa personalizado',
        'Confirmações com analytics',
        'Eventos ilimitados',
        'Templates personalizados',
        'API para integração',
        'Suporte dedicado'
      ],
      buttonText: 'Contatar Vendas',
      buttonVariant: 'outlined',
      highlighted: false
    }
  ];
  
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Convites Digitais com RSVP via WhatsApp
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  fontWeight: 400,
                  opacity: 0.9
                }}
              >
                Crie, envie e gerencie convites digitais com confirmação de presença diretamente pelo WhatsApp.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  Começar Agora
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/demo')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderColor: 'primary.contrastText',
                    '&:hover': {
                      borderColor: 'primary.contrastText',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Ver Demo
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/assets/logo.png"
                alt="Convites Digitais App"
                sx={{ 
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative shapes */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }}
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0
          }}
        />
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2
            }}
          >
            Recursos Principais
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Tudo o que você precisa para criar e gerenciar seus eventos com facilidade
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                    bgcolor: `${feature.color}15`
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Como Funciona
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              Processo simples e intuitivo do início ao fim
            </Typography>
          </Box>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/assets/logo.png"
                alt="Como funciona"
                sx={{ 
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem sx={{ pb: 3 }}>
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      1
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" gutterBottom>
                        Crie seu evento
                      </Typography>
                    }
                    secondary="Defina data, local e detalhes do seu evento em poucos minutos."
                  />
                </ListItem>
                
                <ListItem sx={{ pb: 3 }}>
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      2
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" gutterBottom>
                        Personalize o convite
                      </Typography>
                    }
                    secondary="Escolha entre diversos templates ou crie seu próprio design personalizado."
                  />
                </ListItem>
                
                <ListItem sx={{ pb: 3 }}>
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      3
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" gutterBottom>
                        Envie via WhatsApp
                      </Typography>
                    }
                    secondary="Envie convites diretamente pelo WhatsApp para todos os seus convidados."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      4
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" gutterBottom>
                        Gerencie confirmações
                      </Typography>
                    }
                    secondary="Acompanhe as respostas em tempo real e envie lembretes automaticamente."
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/register')}
                >
                  Comece Agora
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2
            }}
          >
            Planos e Preços
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Escolha o plano ideal para suas necessidades
          </Typography>
        </Box>
        
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                  },
                  ...(plan.highlighted && {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    boxShadow: '0 8px 24px rgba(94, 53, 177, 0.2)'
                  })
                }}
              >
                {plan.highlighted && (
                  <Chip 
                    label="Mais Popular" 
                    color="primary"
                    sx={{ 
                      position: 'absolute',
                      top: -12,
                      right: 24,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {plan.title}
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <Typography 
                      variant="h3" 
                      component="p" 
                      sx={{ 
                        fontWeight: 700,
                        display: 'inline-block'
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      component="span" 
                      sx={{ 
                        color: 'text.secondary',
                        ml: 1
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <List sx={{ mb: 2 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button 
                    variant={plan.buttonVariant} 
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/register')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 3
              }}
            >
              Pronto para começar?
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                mb: 4,
                opacity: 0.9
              }}
            >
              Crie sua conta gratuitamente e comece a enviar convites digitais com confirmação via WhatsApp hoje mesmo.
            </Typography>
            
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 6,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              Criar Conta Grátis
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Convites Digitais
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A maneira mais fácil de criar, enviar e gerenciar convites digitais com confirmação via WhatsApp.
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Produto
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Recursos" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Preços" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="FAQ" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Empresa
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Sobre nós" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Blog" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Contato" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Legal
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Termos de Uso" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Privacidade" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Cookies" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Suporte
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Ajuda" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Tutoriais" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Status" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Convites Digitais. Todos os direitos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;