import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  DialogContentText,
  CircularProgress,
  useMediaQuery,
  Avatar,
  Zoom
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Share as ShareIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  FormatListBulleted as ListIcon
} from '@mui/icons-material';
import { fetchEvent, updateEvent, deleteEvent } from '../../store/actions/eventActions';
import { fetchGuests } from '../../store/actions/guestActions';
import { fetchInvites } from '../../store/actions/inviteActions';

// Componentes reutilizáveis
import StyledButton from '../../components/StyledButton';
import PageTitle from '../../components/PageTitle';
import ConfirmDialog from '../../components/ConfirmDialog';
import { StyledTabs, TabPanel } from '../../components/StyledTabs';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import ActionButton from '../../components/ActionButton';

const EventDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentEvent, loading: eventLoading, error: eventError } = useSelector(state => state.events);
  const { guests, rsvpStats } = useSelector(state => state.guests);
  const { invites } = useSelector(state => state.invites);
  
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Carregar dados do evento, convidados e convites
  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
      dispatch(fetchGuests(id));
      dispatch(fetchInvites(id));
    }
  }, [dispatch, id]);
  
  // Exibir erro se houver
  useEffect(() => {
    if (eventError) {
      setSnackbarMessage(eventError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [eventError]);
  
  // Manipular mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Excluir evento
  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      setSnackbarMessage('Evento excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/events');
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir evento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Renderizar tela de carregamento
  if (eventLoading || !currentEvent) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  
  // Configuração das abas
  const tabsConfig = [
    { label: 'Detalhes', icon: <EventIcon />, iconPosition: 'start' },
    { label: 'Convidados', icon: <PeopleIcon />, iconPosition: 'start' },
    { label: 'Convites', icon: <MailIcon />, iconPosition: 'start' }
  ];
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 2 }}> {/* Reduzido de py: 4 para py: 2 */}
        
        <Box sx={{ 
          mb: 3, // Reduzido de 4 para 3
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -12, // Reduzido de -16 para -12
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.1)})`
          }
        }}>
          {/* Botão Voltar à esquerda */}
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/events')}
            sx={{ 
              borderRadius: 10,
              px: 2,
              py: 0.75, // Reduzido de 1 para 0.75
              '&:hover': {
                transform: 'translateX(-4px)'
              }
            }}
          >
            Voltar
          </StyledButton>
          
          {/* Título e data à direita */}
          <PageTitle
            title={currentEvent.title}
            subtitle={
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.primary.main }} />
                {formatDate(currentEvent.date)}
              </Box>
            }
            alignRight={true}
            mb={0}
          />
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,               // espaçamento entre os cards
            mb: 3,                // margem inferior
            justifyContent: 'center'
          }}
        >
          {/* Status */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '48%', md: '23%' },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <StatCard
              icon={<EventIcon />}
              title="Status"
              value={new Date(currentEvent.date) > new Date() ? 'Ativo' : 'Finalizado'}
              subtitle={currentEvent.location}
              subtitleIcon={<LocationOnIcon />}
              color="primary"
            />
          </Box>

          {/* Convidados */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '48%', md: '23%' },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <StatCard
              icon={<PeopleIcon />}
              title="Convidados"
              value={guests.length}
              subtitle="total de convidados"
              subtitleIcon={<PeopleIcon />}
              color="primary"
            />
          </Box>

          {/* Confirmados */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '48%', md: '23%' },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <StatCard
              icon={<WhatsAppIcon />}
              title="Confirmados"
              value={guests.filter(g => g.status === 'confirmed').length}
              subtitle={`${guests.length > 0 
                ? Math.round((guests.filter(g => g.status === 'confirmed').length / guests.length) * 100) 
                : 0}% do total`}
              subtitleIcon={<WhatsAppIcon />}
              color="success"
            />
          </Box>

          {/* Pendentes */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '48%', md: '23%' },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <StatCard
              icon={<MailIcon />}
              title="Pendentes"
              value={guests.filter(g => g.status === 'pending').length}
              subtitle="aguardando resposta"
              subtitleIcon={<MailIcon />}
              color="warning"
            />
          </Box>
        </Box>
        
        <Paper 
          sx={{ 
            mb: 3, // Reduzido de 4 para 3
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8) 
              : theme.palette.background.paper
          }}
        >
          {/* Header das abas com botões de editar e excluir */}
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            tabs={tabsConfig}
            variant={isMobile ? "fullWidth" : "standard"}
            endComponent={(
              <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledButton
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/edit/${id}`)}
                sx={{ 
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
                
              >
                Editar
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  mr: 2,
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Excluir
              </StyledButton>
            </Box>
            )}
          />
          
          <TabPanel value={tabValue} index={0}>
            <Box container spacing={4}>
                {/* Título da seção com margem adequada */}
                {/* <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                  px: 2 // Adiciona margem horizontal
                }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mr: 2
                      }}
                    >
                      <EventIcon />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.main
                      }}
                    >
                      Informações do Evento
                    </Typography>
                </Box> */}
                
                {/* Informações do evento distribuídas na tela, sem card */}
                <Box sx={{ px: 2 }}>
                  <Box sx={{ mb: 4 }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={currentEvent?.image || 'https://picsum.photos/400/200?random=1'}
                      alt={currentEvent.title}
                      sx={{ 
                        borderRadius: 3,
                        transition: 'transform 0.5s ease',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        mb: 5,
                        mt: 5,
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mb: 3
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <EventIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Título
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {currentEvent.title}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mb: 3
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <CalendarIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Data e Hora
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {formatDate(currentEvent.date)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mb: 3
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <LocationOnIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Local
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {currentEvent.location || 'Não especificado'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mb: 3
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <CategoryIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Tipo
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {
                                currentEvent.type === 'birthday' ? 'Aniversário' :
                                currentEvent.type === 'wedding' ? 'Casamento' :
                                currentEvent.type === 'corporate' ? 'Corporativo' :
                                currentEvent.type === 'party' ? 'Festa' : 'Outro'
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mt: 2
                    }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mr: 2
                        }}
                      >
                        <DescriptionIcon />
                      </Avatar>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Descrição
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? alpha(theme.palette.background.paper, 0.6) 
                              : alpha(theme.palette.background.paper, 0.6),
                            border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`
                          }}
                        >
                          <Typography variant="body1">
                            {currentEvent.description || 'Sem descrição'}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                    
                    {currentEvent.notes && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        mt: 3
                      }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mr: 2
                          }}
                        >
                          <DescriptionIcon />
                        </Avatar>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Observações
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              bgcolor: theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.background.paper, 0.6) 
                                : alpha(theme.palette.background.paper, 0.6),
                              border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`
                            }}
                          >
                            <Typography variant="body1">
                              {currentEvent.notes}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  {/* Lista de Convidados */}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Novo botão para acessar a tela de listagem de convidados */}
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    startIcon={<ListIcon />}
                    onClick={() => navigate(`/events/${id}/guests`)}
                    sx={{ 
                      borderRadius: 10,
                      px: 2,
                      py: 0.75,
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Gerenciar Convidados
                  </StyledButton>
                  
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/events/${id}/guests/new`)}
                  >
                    Adicionar Convidado
                  </StyledButton>
                </Box>
              </Box>
              
              {guests.length === 0 ? (
                <EmptyState
                  message="Nenhum convidado adicionado ainda."
                  icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                  buttonText="Adicionar Convidado"
                  onButtonClick={() => navigate(`/events/${id}/guests/new`)}
                />
              ) : (
                <Grid container spacing={2}>
                  {guests.map((guest) => (
                    <Grid item xs={12} sm={6} md={4} key={guest.id}>
                      <Card 
                        sx={{ 
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                          height: '100%',
                          '&:hover': {
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  bgcolor: 
                                    guest.status === 'confirmed' 
                                      ? alpha(theme.palette.success.main, 0.1)
                                      : guest.status === 'declined'
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : alpha(theme.palette.warning.main, 0.1),
                                  color: 
                                    guest.status === 'confirmed' 
                                      ? theme.palette.success.main
                                      : guest.status === 'declined'
                                        ? theme.palette.error.main
                                        : theme.palette.warning.main,
                                  mr: 1.5
                                }}
                              >
                                {guest.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {guest.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {guest.email}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Chip 
                              label={
                                guest.status === 'confirmed' ? 'Confirmado' :
                                guest.status === 'declined' ? 'Recusado' : 'Pendente'
                              }
                              size="small"
                              sx={{ 
                                bgcolor: 
                                  guest.status === 'confirmed' 
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : guest.status === 'declined'
                                      ? alpha(theme.palette.error.main, 0.1)
                                      : alpha(theme.palette.warning.main, 0.1),
                                color: 
                                  guest.status === 'confirmed' 
                                    ? theme.palette.success.main
                                    : guest.status === 'declined'
                                      ? theme.palette.error.main
                                      : theme.palette.warning.main,
                                fontWeight: 500,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              {guest.phone}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <StyledButton
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/events/${id}/guests/edit/${guest.id}`)}
                              >
                                Editar
                              </StyledButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  {/* Convites */}
                </Typography>
                
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/events/${id}/invites/new`)}
                >
                  Criar Convite
                </StyledButton>
              </Box>
              
              {invites.length === 0 ? (
                <EmptyState
                  message="Nenhum convite criado ainda."
                  icon={<MailIcon sx={{ fontSize: 32 }} />}
                  buttonText="Criar Convite"
                  onButtonClick={() => navigate(`/events/${id}/invites/new`)}
                />
              ) : (
                <Grid container spacing={2}>
                  {invites.map((invite) => (
                    <Grid item xs={12} sm={6} md={4} key={invite.id}>
                      <Card 
                        sx={{ 
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                          height: '100%',
                          '&:hover': {
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={invite.imageUrl || 'https://picsum.photos/400/200?random=2'}
                          alt={invite.title}
                        />
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {invite.title}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {invite.description || 'Sem descrição'}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2
                          }}>
                            <Chip 
                              label={invite.templateId || 'Padrão'}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                borderRadius: 1
                              }}
                            />
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <StyledButton
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/events/${id}/invites/edit/${invite.id}`)}
                              >
                                Editar
                              </StyledButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>
        </Paper>
        
        {/* Botões de ação flutuantes */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* Novo botão de ação para acessar a tela de listagem de convidados */}
          <ActionButton
            icon={<PeopleIcon />}
            color="secondary"
            tooltip="Gerenciar Convidados"
            onClick={() => navigate(`/events/${id}/guests`)}
          />
          
          <ActionButton
            icon={<EditIcon />}
            color="primary"
            tooltip="Editar Evento"
            onClick={() => navigate(`/events/edit/${id}`)}
          />
          
          <ActionButton
            icon={<DeleteIcon />}
            color="error"
            tooltip="Excluir Evento"
            onClick={() => setDeleteDialogOpen(true)}
          />
          
          <ActionButton
            icon={<ShareIcon />}
            color="info"
            tooltip="Compartilhar Evento"
            onClick={() => {/* Lógica para compartilhar */}}
          />
        </Box>
      </Container>
      
      {/* Snackbar de feedback */}
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
          sx={{ width: '100%', borderRadius: 1, color: theme.palette.primary.contrastText }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Excluir evento"
        message="Esta ação não pode ser desfeita. Deseja realmente excluir este evento?"
        cancelText="Cancelar"
        confirmText="Sim, excluir"
        confirmColor="error"
      />
    </Box>
  );
};

export default EventDetail;
