import React, { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useMediaQuery, Menu, MenuItem, Snackbar, Alert, Zoom } from '@mui/material';
import {
  ListItemIcon,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
  Avatar
} from '@mui/material';

import {
  Search as SearchIcon,
  Add as AddIcon,
  Event as EventIcon,
  People as PeopleIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, deleteEvent} from '../../store/actions/eventActions';
import { StyledTabs, TabPanel } from '../../components/StyledTabs';
import ConfirmDialog from '../../components/ConfirmDialog';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import EventCard from '../../components/EventCard';
import { useDispatch, useSelector } from 'react-redux';


const EventList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // Pegar do Redux
  const dispatch = useDispatch();
  const { events: allEvents = [], loading, error } = useSelector(state => state.events)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // Adicionar estado para controlar o loading e evitar múltiplas chamadas
  const [isLoading, setIsLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Fechar snackbar
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // Abrir menu de ações
  const handleMenuOpen = (e, ev) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedEvent(ev.id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // Abrir diálogo de exclusão
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  // Buscar do backend ao montar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchEvents());
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);
  
  // Separar próximos e passados
  const now = new Date();
  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= now);
  const pastEvents     = allEvents.filter(e => new Date(e.date) < now);


  // Manipular mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Configuração das abas
  const tabsConfig = [
    { label: 'Próximos Eventos', icon: <CalendarIcon />, iconPosition: 'start' },
    { label: 'Eventos Passados', icon: <EventIcon />, iconPosition: 'start' }
  ];

  // Manipular busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filtrar eventos com base na busca
  const filteredUpcomingEvents = upcomingEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPastEvents = pastEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Formata uma string ISO para "dd mmm yyyy"
  const formatDate = raw => {
    const dateObj = new Date(raw);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // Confirmar exclusão
  const handleDeleteEvent = async () => {
    setDeleteDialogOpen(false)
    try {
      setIsLoading(true);
      await dispatch(deleteEvent(selectedEvent || selectedEvent.id)).unwrap();
      setSnackbarMessage('Evento excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/events');
    } catch (err) {
      const msg = err?.message || 'Erro ao excluir evento';
      setSnackbarMessage(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  // Função para navegar para a página de detalhes do evento com controle para evitar múltiplas chamadas
  const handleNavigateToEvent = (eventId) => {
    if (navigating) return; 

    setNavigating(true);
    setIsLoading(true);
    navigate(`/events/${eventId}`);
  };

  // Formata hora de um raw para "HH:MM"
  const formatTime = raw => {
    const dateObj = new Date(raw);
    return dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const stats = [
    {
      label: 'Eventos',
      icon: EventIcon,
      value: upcomingEvents.length,
      color: 'primary',
      bgAlpha: 0,           // sem cor de fundo extra
      secondaryIcon: CalendarIcon,
      secondaryText: 'eventos ativos'
    },
    {
      label: 'Convidados',
      icon: PeopleIcon,
      value: upcomingEvents.reduce((tot, e) => tot + e.guestsCount, 0),
      color: 'primary',
      bgAlpha: 0.05,        // leve roxo de fundo
      secondaryIcon: PeopleIcon,
      secondaryText: 'convidados no total'
    },
    {
      label: 'Confirmações',
      icon: WhatsAppIcon,
      value: upcomingEvents.reduce((tot, e) => tot + e.confirmedCount, 0),
      color: 'success',
      bgAlpha: 0.1,         // leve verde de fundo
      secondaryIcon: WhatsAppIcon,
      secondaryText: 'presenças confirmadas'
    },
    {
      label: 'Pendentes',
      icon: MailIcon,
      value: upcomingEvents.reduce((tot, e) => tot + e.pendingCount, 0),
      color: 'warning',
      bgAlpha: 0.15,        // fundo um pouco mais alaranjado
      secondaryIcon: MailIcon,
      secondaryText: 'respostas pendentes'
    }
  ];  
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        pt: 3,
        pb: 6,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {/* Adicionar o componente de loading */}
      <LoadingIndicator open={isLoading} />
      
      <Container maxWidth="lg">
        {/* Cabeçalho */}
        <Box 
          sx={{ 
            mb: 4,
            position: 'relative',
            textAlign: 'left',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.1)})`
            }
          }}
        >
          {/* Título e botão em paralelo */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2
            }}
          >
            <Box sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  color: theme.palette.primary.main,
                  textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  position: 'relative',
                  AlignItems: 'right',
                  display: 'inline-block',
              }}>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: theme.palette.primary.main,
                    textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    position: 'relative',
                    mb: 1,
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: '0',
                      width: '40%',
                      height: '3px',
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                    }
                  }}
                >
                  Meus Eventos
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    mx: 'auto',
                  }}
                >
                  Gerencie seus eventos, convites e confirmações em um só lugar.
                </Typography>
              </Box>
              <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/events/create')}
                  sx={{ 
                    borderRadius: 10,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(94, 53, 177, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  >
                  {isMobile ? 'Novo' : 'Novo Evento'}
                </Button>
            </Box>
        </Box>

        <Box
          component="section"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            justifyContent: 'center'
          }}
        >
          {stats.map(({ label, icon: Icon, value, color, bgAlpha, secondaryIcon: SecIcon, secondaryText }) => (
            <Box
              key={label}
              sx={{
                flex: '1 1 calc(25% - 16px)',
                minWidth: { xs: '100%', sm: '50%', md: '200px' }
              }}
            >
              <Card
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.3s, transform 0.2s',
                  textAlign: 'center',
                  bgcolor: theme => bgAlpha > 0
                    ? alpha(theme.palette[color].main, bgAlpha)
                    : 'background.default',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme => alpha(theme.palette[color].main, 0.1),
                      color: theme => theme.palette[color].main,
                      mr: 1.5
                    }}
                  >
                    <Icon />
                  </Avatar>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    {label}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  color={`${color}.main`}
                  fontWeight={700}
                  sx={{ mb: 0.5 }}
                >
                  {value}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <SecIcon sx={{ fontSize: 16, mr: 0.5, color: theme => theme.palette[color].main }} />
                  <Typography variant="body2">{secondaryText}</Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Abas de eventos */}
        <Paper 
          sx={{ 
            mb: 4,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}
        >
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            tabs={tabsConfig}
            variant={isMobile ? "fullWidth" : "standard"}
            endComponent={(
              <TextField
                placeholder="Buscar eventos…"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  mr: 4,
                  width: { xs: '100%', sm: '250px' },
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <TabPanel value={tabValue} index={0}>
            {filteredUpcomingEvents.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <CalendarIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: alpha(theme.palette.primary.main, 0.2),
                    mb: 2
                  }} 
                />
                <Typography 
                  variant="h6" 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Nenhum evento encontrado
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2, maxWidth: 500 }}
                >
                  Crie seu primeiro evento para começar a enviar convites digitais e gerenciar confirmações.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/events/create')}
                  sx={{ 
                    mt: 2,
                    borderRadius: 10,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(94, 53, 177, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Criar Novo Evento
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ p: 3, justifyContent: 'center' }}>
                {filteredUpcomingEvents.map(event => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <EventCard 
                      event={event} 
                      onClick={() => handleNavigateToEvent(event.id)}
                      showActions={true}
                      extraContent={(
                        <IconButton 
                          size="small" 
                          onClick={e => handleMenuOpen(e, event)}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {filteredPastEvents.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <EventIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: alpha(theme.palette.primary.main, 0.2),
                    mb: 2
                  }} 
                />
                <Typography 
                  variant="h6" 
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                >
                  Nenhum evento passado encontrado
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ maxWidth: 500 }}
                >
                  Seus eventos passados aparecerão aqui quando a data do evento for anterior à data atual.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ p: 3, justifyContent: 'center' }}>
                {filteredPastEvents.map(event => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: 0.8,
                        filter: 'grayscale(30%)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          opacity: 1,
                          filter: 'grayscale(0%)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleNavigateToEvent(event.id)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={event.image ? event.image : 'https://picsum.photos/400/200?random=1'}
                          alt={event.title}
                          sx={{
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedEvent(event); 
                            openDeleteDialog(); 
                          }} 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            color: 'error.main', 
                            bgcolor: alpha('#fff', 0.9),
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(4px)',
                            borderRadius: 10,
                            px: 1.5,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" fontWeight={600}>
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography 
                            variant="h6" 
                            component="h2" 
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            {event.title}
                          </Typography>
                          <Chip 
                            label="Finalizado" 
                            size="small" 
                            color="default"
                            sx={{
                              borderRadius: 10,
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.text.secondary, 0.1)
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            gutterBottom
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1
                            }}
                          >
                            <EventIcon 
                              fontSize="small" 
                              sx={{ 
                                mr: 1, 
                                verticalAlign: 'middle',
                                color: theme.palette.text.secondary
                              }} 
                            />
                            {formatTime(event.date)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <LocationIcon 
                              fontSize="small" 
                              sx={{ 
                                mr: 1,
                                color: theme.palette.text.secondary
                              }}
                            /> 
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }}/>
                        
                        <Box 
                          display="flex" 
                          justifyContent="space-between" 
                          mt={2}
                          gap={1}
                        >
                          <Chip 
                            label={`${event.confirmedCount} participaram`} 
                            size="small" 
                            color="default"
                            sx={{
                              borderRadius: 10,
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.dark
                            }}
                          />
                          <Chip 
                            label={`${event.guestsCount} convidados`} 
                            size="small" 
                            color="default"
                            sx={{
                              borderRadius: 10,
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.dark
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Container>
      
      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            mt: 1
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate(`/events/edit/${selectedEvent}`);
          }}
          sx={{ 
            py: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="body2">Editar Evento</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate(`/events/${selectedEvent}/guests`);
          }}
          sx={{ 
            py: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <ListItemIcon>
            <PeopleIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="body2">Gerenciar Convidados</Typography>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={openDeleteDialog}
          sx={{ 
            py: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" color="error">Excluir Evento</Typography>
        </MenuItem>
      </Menu>
      
      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteEvent}
        title="Excluir Evento"
        content="Tem certeza que deseja excluir este evento? Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="error"
      />
      
      {/* Snackbar para mensagens */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ 
            color: 'white',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventList;
