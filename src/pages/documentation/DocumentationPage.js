import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Link,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Description as DescriptionIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  CloudUpload as CloudUploadIcon,
  School as SchoolIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const DocumentationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const sections = [
    {
      id: 'user-guide',
      title: 'Guia do Usuário',
      description: 'Aprenda a utilizar todas as funcionalidades da plataforma',
      icon: <DescriptionIcon fontSize="large" />,
      color: theme.palette.primary.main
    },
    {
      id: 'api-docs',
      title: 'Documentação da API',
      description: 'Referência completa para desenvolvedores',
      icon: <CodeIcon fontSize="large" />,
      color: theme.palette.secondary.main
    },
    {
      id: 'deployment',
      title: 'Guia de Implantação',
      description: 'Como implantar a aplicação em produção',
      icon: <CloudUploadIcon fontSize="large" />,
      color: theme.palette.success.main
    },
    {
      id: 'tutorials',
      title: 'Tutoriais',
      description: 'Passo a passo para tarefas comuns',
      icon: <SchoolIcon fontSize="large" />,
      color: theme.palette.info.main
    }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Documentação
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bem-vindo à documentação completa da plataforma de Convites Digitais com RSVP. 
        Aqui você encontrará guias, tutoriais e referências para aproveitar ao máximo todas as funcionalidades.
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={3} key={section.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                },
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/documentation/${section.id}`)}
            >
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'center',
                  bgcolor: `${section.color}15`
                }}
              >
                <Box sx={{ color: section.color }}>
                  {section.icon}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Guia Rápido
        </Typography>
        
        <Typography variant="body1" paragraph>
          Comece rapidamente com estes guias essenciais:
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem button component={Link} href="#criar-evento">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Como criar seu primeiro evento" 
                  secondary="Aprenda a configurar um evento do início ao fim"
                />
              </ListItem>
              <Divider />
              <ListItem button component={Link} href="#importar-convidados">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Importar lista de convidados" 
                  secondary="Importe convidados de planilhas ou contatos"
                />
              </ListItem>
              <Divider />
              <ListItem button component={Link} href="#personalizar-convites">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Personalizar convites" 
                  secondary="Crie convites personalizados para seu evento"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem button component={Link} href="#enviar-whatsapp">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Enviar convites via WhatsApp" 
                  secondary="Aprenda a utilizar a integração com WhatsApp"
                />
              </ListItem>
              <Divider />
              <ListItem button component={Link} href="#gerenciar-rsvp">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Gerenciar confirmações (RSVP)" 
                  secondary="Acompanhe e gerencie as respostas dos convidados"
                />
              </ListItem>
              <Divider />
              <ListItem button component={Link} href="#analytics">
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Visualizar estatísticas" 
                  secondary="Entenda os dados e métricas do seu evento"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recursos Técnicos
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GitHubIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Código Fonte
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Acesse o repositório completo do projeto no GitHub para contribuir ou personalizar.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<GitHubIcon />}
                  href="https://github.com/convites-digitais/app"
                  target="_blank"
                >
                  Ver no GitHub
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    API Reference
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Documentação completa da API para integração com outros sistemas.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<CodeIcon />}
                  href="/api-docs"
                  target="_blank"
                >
                  Acessar Documentação da API
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Precisa de ajuda adicional? Entre em contato com nosso suporte.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/support')}
        >
          Contatar Suporte
        </Button>
      </Box>
    </Container>
  );
};

export default DocumentationPage;
