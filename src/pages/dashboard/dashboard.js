import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Chip,
  Avatar,
  Tab,
  Tabs,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  Group as GroupIcon,
  Event as EventIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  Visibility as VisibilityIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  FilterAlt as FilterAltIcon,
  SortByAlpha as SortByAlphaIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { fetchAllGuests, fetchAllEvents } from '../../store/actions/dashboardActions';
import { LoadingIndicator } from '../../components/LoadingIndicator';

// Componentes reutilizáveis
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import StyledButton from '../../components/StyledButton';
import EmptyState from '../../components/EmptyState';

// Componentes de gráficos
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Componente de contador regressivo
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        
        // Calcular o progresso inverso (quanto mais próximo do evento, menor o progresso)
        // Assumindo que 30 dias é o máximo para o progresso
        const maxDays = 30;
        const daysLeft = Math.min(totalDays, maxDays);
        const newProgress = Math.max(0, Math.min(100, (daysLeft / maxDays) * 100));
        
        setProgress(newProgress);
        
        return {
          dias: totalDays,
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
        };
      }
      
      return {
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
      };
    };

    // Inicializar
    setTimeLeft(calculateTimeLeft());

  }, [targetDate]);

  // Determinar cor com base no tempo restante
  const getColorByProgress = () => {
    if (progress < 20) return 'error';
    if (progress < 50) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: theme => theme.palette[getColorByProgress()].main }} />
        <Typography variant="body2" fontWeight="medium" color={theme => theme.palette[getColorByProgress()].main}>
          {timeLeft.dias > 0 ? `${timeLeft.dias} dias, ${timeLeft.horas}h` : 
           timeLeft.horas > 0 ? `${timeLeft.horas}h ${timeLeft.minutos}m` : 
           `${timeLeft.minutos}m ${timeLeft.segundos}s`}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={100 - progress} 
        color={getColorByProgress()}
        sx={{ 
          height: 4, 
          borderRadius: 2,
          backgroundColor: theme => alpha(theme.palette[getColorByProgress()].main, 0.1)
        }} 
      />
    </Box>
  );
};

// Componente para exibir o status do evento
const EventStatusChip = ({ date }) => {
  const eventDate = new Date(date);
  const now = new Date();
  
  // Calcular a data de término (assumindo que eventos duram 24 horas)
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 24);
  
  let status, label, icon, color;
  
  if (now < eventDate) {
    status = 'upcoming';
    label = 'Futuro';
    icon = <EventAvailableIcon fontSize="small" />;
    color = 'primary';
  } else if (now >= eventDate && now <= endDate) {
    status = 'ongoing';
    label = 'Em andamento';
    icon = <UpdateIcon fontSize="small" />;
    color = 'success';
  } else {
    status = 'past';
    label = 'Concluído';
    icon = <EventBusyIcon fontSize="small" />;
    color = 'default';
  }
  
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      color={color}
      sx={{ 
        fontWeight: 600,
        borderRadius: 8,
        '& .MuiChip-icon': { ml: 0.5 }
      }}
    />
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selecionar dados do Redux store
  const { allGuests, allEvents, loading, error } = useSelector(state => state.dashboard);
  
  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'stats'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [eventTabValue, setEventTabValue] = useState(0);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchAllGuests()),
          dispatch(fetchAllEvents())
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData()
  }, [dispatch]);
  
  // Exibir erro se houver
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  // Separar eventos passados e futuros
  const currentDate = new Date();
  
  const futureEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= currentDate;
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar por data crescente
  
  const pastEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < currentDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por data decrescente (mais recentes primeiro)

  // Obter eventos com base na aba selecionada
  const selectedEvents = eventTabValue === 0 ? futureEvents : pastEvents;

  // Filtrar convidados com base nos eventos selecionados
  const selectedEventIds = selectedEvents.map(event => event.id);

  // Manipular busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Abrir menu de filtros
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };
  
  // Fechar menu de filtros
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };
  
  // Abrir menu de ordenação
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchorEl(event.currentTarget);
  };
  
  // Fechar menu de ordenação
  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };
  
  // Abrir menu de visualização
  const handleViewMenuOpen = (event) => {
    setViewMenuAnchorEl(event.currentTarget);
  };
  
  // Fechar menu de visualização
  const handleViewMenuClose = () => {
    setViewMenuAnchorEl(null);
  };
  
  // Alterar filtro de evento
  const handleEventFilterChange = (eventId) => {
    setFilterEvent(eventId);
    handleFilterMenuClose();
  };
  
  // Alterar filtro de status
  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };
  
  // Alterar filtro de grupo
  const handleGroupFilterChange = (group) => {
    setFilterGroup(group);
    handleFilterMenuClose();
  };
  
  // Alterar ordenação
  const handleSortChange = (sortField) => {
    if (sortBy === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortField);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };
  
  // Alterar modo de visualização
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    handleViewMenuClose();
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Navegar para detalhes do evento
  const handleNavigateToEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };
  
  // Navegar para detalhes do convidado
  const handleNavigateToGuest = (eventId, guestId) => {
    navigate(`/events/${eventId}/guests/edit/${guestId}`);
  };

  // Alterar aba de eventos (futuros/passados)
  const handleEventTabChange = (event, newValue) => {
    setEventTabValue(newValue);
    setPage(1); // Resetar para a primeira página ao mudar de aba
    setFilterEvent('all'); // Resetar filtro de evento ao mudar de aba
  };

  // Atualizar dados manualmente
  const handleRefreshData = async () => {
    setSnackbarMessage('Atualizando dados...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(fetchAllGuests()),
        dispatch(fetchAllEvents())
      ]);
      
      setSnackbarMessage('Dados atualizados com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao atualizar dados');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtrar convidados
  const filteredGuests = allGuests.filter(guest => {
    // Filtrar por termo de busca
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (guest.phone && guest.phone.includes(searchTerm));
    
    // Filtrar por evento
    const matchesEvent = filterEvent === 'all' 
      ? selectedEventIds.includes(guest.eventId) // Filtrar apenas pelos eventos da aba atual (futuros ou passados)
      : guest.eventId === filterEvent;
    
    // Filtrar por status
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus;
    
    // Filtrar por grupo
    const matchesGroup = filterGroup === 'all' || guest.group === filterGroup;
    
    return matchesSearch && matchesEvent && matchesStatus && matchesGroup;
  });
  
  // Ordenar convidados
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'group') {
      comparison = (a.group || '').localeCompare(b.group || '');
    } else if (sortBy === 'event') {
      const eventA = allEvents.find(event => event.id === a.eventId)?.title || '';
      const eventB = allEvents.find(event => event.id === b.eventId)?.title || '';
      comparison = eventA.localeCompare(eventB);
    } else if (sortBy === 'date') {
      const eventA = allEvents.find(event => event.id === a.eventId)?.date || new Date();
      const eventB = allEvents.find(event => event.id === b.eventId)?.date || new Date();
      comparison = new Date(eventA) - new Date(eventB);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const pageCount = Math.ceil(sortedGuests.length / itemsPerPage);
  const paginatedGuests = sortedGuests.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
  );

  useEffect(() => {
    const pageCount = Math.ceil(sortedGuests.length / itemsPerPage);
      if (page > pageCount) setPage(1);
  }, [sortedGuests.length]);

  // Obter todos os grupos únicos
  const uniqueGroups = [...new Set(allGuests.map(guest => guest.group).filter(Boolean))];
  
  // Preparar dados para gráficos
  const prepareStatusData = () => {
    // Filtrar convidados apenas para os eventos da aba atual
    const filteredGuestsByTab = allGuests.filter(guest => selectedEventIds.includes(guest.eventId));
    
    const statusCounts = {
      confirmed: filteredGuestsByTab.filter(guest => guest.status === 'confirmed').length,
      pending: filteredGuestsByTab.filter(guest => guest.status === 'pending').length,
      declined: filteredGuestsByTab.filter(guest => guest.status === 'declined').length
    };
    
    return [
      { name: 'Confirmados', value: statusCounts.confirmed, color: theme.palette.success.main },
      { name: 'Pendentes', value: statusCounts.pending, color: theme.palette.warning.main },
      { name: 'Recusados', value: statusCounts.declined, color: theme.palette.error.main }
    ];
  };
  
  const prepareEventData = () => {
    const eventCounts = {};
    
    // Filtrar convidados apenas para os eventos da aba atual
    const filteredGuestsByTab = allGuests.filter(guest => selectedEventIds.includes(guest.eventId));
    
    filteredGuestsByTab.forEach(guest => {
      if (!eventCounts[guest.eventId]) {
        eventCounts[guest.eventId] = {
          confirmed: 0,
          pending: 0,
          declined: 0
        };
      }
      
      eventCounts[guest.eventId][guest.status]++;
    });
    
    return Object.keys(eventCounts).map(eventId => {
      const event = allEvents.find(e => e.id === eventId);
      return {
        name: event?.title || 'Evento Desconhecido',
        confirmed: eventCounts[eventId].confirmed,
        pending: eventCounts[eventId].pending,
        declined: eventCounts[eventId].declined
      };
    });
  };
  
  const prepareGroupData = () => {
    // Filtrar convidados apenas para os eventos da aba atual
    const filteredGuestsByTab = allGuests.filter(guest => selectedEventIds.includes(guest.eventId));
    
    const groupCounts = {};
    
    filteredGuestsByTab.forEach(guest => {
      const group = guest.group || 'Sem Grupo';
      if (!groupCounts[group]) {
        groupCounts[group] = 0;
      }
      
      groupCounts[group]++;
    });
    
    return Object.keys(groupCounts).map(group => ({
      name: group,
      value: groupCounts[group],
      color: stringToColor(group)
    }));
  };
  
  // Função para gerar cor baseada em string
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };
  
  // Dados para gráficos
  const statusData = prepareStatusData();
  const eventData = prepareEventData();
  const groupData = prepareGroupData();
  
  // Cores para gráficos
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    ...uniqueGroups.map(group => stringToColor(group))
  ];

  // Calcular estatísticas para o resumo rápido
  const totalGuests = filteredGuests.length;
  const confirmedGuests = filteredGuests.filter(g => g.status === 'confirmed').length;
  const pendingGuests = filteredGuests.filter(g => g.status === 'pending').length;
  const declinedGuests = filteredGuests.filter(g => g.status === 'declined').length;
  
  const confirmationRate = totalGuests > 0 
    ? Math.round((confirmedGuests / totalGuests) * 100) 
    : 0;
  
  const pendingRate = totalGuests > 0 
    ? Math.round((pendingGuests / totalGuests) * 100) 
    : 0;
  
  // Renderizar tela de carregamento
  if (loading && allGuests.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh'
      }}>
        <LoadingIndicator
          open={loading}
          type="fullscreen"
          message="Carregando Dashboard..."
        />
        {/* <CircularProgress color="primary" /> */}
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        pt: 3,
        pb: 6,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.default, 0.9) 
          : theme.palette.background.default
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header com título */}
        <Box sx={{ 
          mb: 4,
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
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
              py: 1,
              '&:hover': {
                transform: 'translateX(-4px)'
              }
            }}
          >
            Voltar para Eventos
          </StyledButton>
          
          {/* Título e subtítulo à direita */}
          <PageTitle
            title="Dashboard de Convidados"
            subtitle={`${allGuests.length} convidados em ${allEvents.length} eventos`}
            alignRight={!isMobile}
            mb={0}
          />
        </Box>

        {/* Resumo rápido */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="h6" fontWeight="600">
              {eventTabValue === 0 ? 'Resumo de Eventos Futuros' : 'Resumo de Eventos Passados'}
            </Typography>
            
            <StyledButton
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshData}
              sx={{ borderRadius: 20 }}
            >
              Atualizar Dados
            </StyledButton>
          </Box>
          
          {/* Substituindo Grid por Box para evitar distorção */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'space-between'
          }}>
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total de Convidados
              </Typography>
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {totalGuests}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedEvents.length} {eventTabValue === 0 ? 'eventos futuros' : 'eventos passados'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Taxa de Confirmação
              </Typography>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {confirmationRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {confirmedGuests} de {totalGuests} convidados
              </Typography>
            </Box>
            
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Aguardando Resposta
              </Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {pendingRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {pendingGuests} de {totalGuests} convidados
              </Typography>
            </Box>
            
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Próximo Evento
              </Typography>
              {futureEvents.length > 0 ? (
                <>
                  <Typography variant="body1" fontWeight="600" noWrap>
                    {futureEvents[0].title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {new Date(futureEvents[0].date).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric'
                    })}
                  </Typography>
                  {eventTabValue === 0 && (
                    <Box sx={{ mt: 1 }}>
                      <CountdownTimer targetDate={futureEvents[0].date} />
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Nenhum evento futuro
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Abas para eventos futuros e passados */}
        <Paper
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
          }}
        >
          <Tabs
            value={eventTabValue}
            onChange={handleEventTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="Abas de eventos"
          >
            <Tab 
              icon={<EventAvailableIcon />} 
              label={`Eventos Futuros (${futureEvents.length})`} 
              iconPosition="start"
              sx={{ 
                py: 2,
                fontWeight: 600,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            />
            <Tab 
              icon={<HistoryIcon />} 
              label={`Eventos Passados (${pastEvents.length})`} 
              iconPosition="start"
              sx={{ 
                py: 2,
                fontWeight: 600,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            />
          </Tabs>
        </Paper>
        
        {/* Cards de estatísticas */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            justifyContent: 'center'
          }}
        >
          {/* Total de Convidados */}
          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<PersonIcon fontSize="large" />}
              title="Total de Convidados"
              value={filteredGuests.length}
              subtitle={eventTabValue === 0 ? "em eventos futuros" : "em eventos passados"}
              color="primary"
            />
          </Box>

          {/* Confirmados */}
          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<CheckCircleIcon fontSize="large" />}
              title="Confirmados"
              value={filteredGuests.filter(g => g.status === 'confirmed').length}
              subtitle={filteredGuests.length > 0
                ? `${Math.round((filteredGuests.filter(g => g.status === 'confirmed').length / filteredGuests.length) * 100)}% do total`
                : '0%'}
              color="success"
            />
          </Box>

          {/* Pendentes */}
          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<HelpOutlineIcon fontSize="large" />}
              title="Pendentes"
              value={filteredGuests.filter(g => g.status === 'pending').length}
              subtitle="aguardando resposta"
              color="warning"
            />
          </Box>

          {/* Eventos */}
          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<EventIcon fontSize="large" />}
              title="Eventos"
              value={selectedEvents.length}
              subtitle={eventTabValue === 0 ? "eventos futuros" : "eventos passados"}
              color="info"
            />
          </Box>
        </Box>
        
        {/* Barra de pesquisa e filtros */}
        <Paper
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
          }}
        >
          {/* Campo de busca */}
          <Box sx={{ position: 'relative', flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
            <SearchIcon
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.palette.text.secondary
              }}
            />
            <Box
              component="input"
              placeholder="Buscar convidados..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                width: '100%',
                height: '48px',
                pl: 5,
                pr: 3,
                py: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 24,
                fontSize: '1rem',
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '&:focus': {
                  outline: 'none',
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderColor: theme.palette.primary.main
                },
                '&::placeholder': {
                  color: theme.palette.text.secondary
                }
              }}
            />
          </Box>
          
          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Botão de filtro */}
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<FilterAltIcon />}
              onClick={handleFilterMenuOpen}
              sx={{ borderRadius: 20 }}
            >
              Filtrar
              {(filterEvent !== 'all' || filterStatus !== 'all' || filterGroup !== 'all') && (
                <Badge
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </StyledButton>
            
            {/* Menu de filtros */}
            <Menu
              anchorEl={filterMenuAnchorEl}
              open={Boolean(filterMenuAnchorEl)}
              onClose={handleFilterMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  width: 250
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Filtrar por Evento
              </Typography>
              <MenuItem 
                onClick={() => handleEventFilterChange('all')}
                selected={filterEvent === 'all'}
              >
                <ListItemText primary="Todos os Eventos" />
              </MenuItem>
              <Divider />
              {selectedEvents.map(event => (
                <MenuItem 
                  key={event.id} 
                  onClick={() => handleEventFilterChange(event.id)}
                  selected={filterEvent === event.id}
                >
                  <ListItemIcon>
                    <EventIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={event.title} 
                    secondary={new Date(event.date).toLocaleDateString()}
                  />
                </MenuItem>
              ))}
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Filtrar por Status
              </Typography>
              <MenuItem 
                onClick={() => handleStatusFilterChange('all')}
                selected={filterStatus === 'all'}
              >
                <ListItemText primary="Todos os Status" />
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilterChange('confirmed')}
                selected={filterStatus === 'confirmed'}
              >
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText primary="Confirmados" />
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilterChange('pending')}
                selected={filterStatus === 'pending'}
              >
                <ListItemIcon>
                  <HelpOutlineIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText primary="Pendentes" />
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilterChange('declined')}
                selected={filterStatus === 'declined'}
              >
                <ListItemIcon>
                  <CancelIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Recusados" />
              </MenuItem>
              
              {uniqueGroups.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                    Filtrar por Grupo
                  </Typography>
                  <MenuItem 
                    onClick={() => handleGroupFilterChange('all')}
                    selected={filterGroup === 'all'}
                  >
                    <ListItemText primary="Todos os Grupos" />
                  </MenuItem>
                  {uniqueGroups.map(group => (
                    <MenuItem 
                      key={group} 
                      onClick={() => handleGroupFilterChange(group)}
                      selected={filterGroup === group}
                    >
                      <ListItemIcon>
                        <GroupIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={group} />
                    </MenuItem>
                  ))}
                </>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setFilterEvent('all');
                    setFilterStatus('all');
                    setFilterGroup('all');
                    handleFilterMenuClose();
                  }}
                >
                  Limpar Filtros
                </StyledButton>
              </Box>
            </Menu>
            
            {/* Botão de ordenação */}
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<SortByAlphaIcon />}
              onClick={handleSortMenuOpen}
              sx={{ borderRadius: 20 }}
            >
              Ordenar
            </StyledButton>
            
            {/* Menu de ordenação */}
            <Menu
              anchorEl={sortMenuAnchorEl}
              open={Boolean(sortMenuAnchorEl)}
              onClose={handleSortMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  width: 200
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Ordenar por
              </Typography>
              <MenuItem 
                onClick={() => handleSortChange('name')}
                selected={sortBy === 'name'}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Nome" />
                {sortBy === 'name' && (
                  <Typography variant="body2" color="text.secondary">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => handleSortChange('event')}
                selected={sortBy === 'event'}
              >
                <ListItemIcon>
                  <EventIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Evento" />
                {sortBy === 'event' && (
                  <Typography variant="body2" color="text.secondary">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => handleSortChange('date')}
                selected={sortBy === 'date'}
              >
                <ListItemIcon>
                  <CalendarTodayIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Data do Evento" />
                {sortBy === 'date' && (
                  <Typography variant="body2" color="text.secondary">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </MenuItem>
              <MenuItem 
                onClick={() => handleSortChange('status')}
                selected={sortBy === 'status'}
              >
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Status" />
                {sortBy === 'status' && (
                  <Typography variant="body2" color="text.secondary">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Typography>
                )}
              </MenuItem>
              {uniqueGroups.length > 0 && (
                <MenuItem 
                  onClick={() => handleSortChange('group')}
                  selected={sortBy === 'group'}
                >
                  <ListItemIcon>
                    <GroupIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Grupo" />
                  {sortBy === 'group' && (
                    <Typography variant="body2" color="text.secondary">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Typography>
                  )}
                </MenuItem>
              )}
            </Menu>
            
            {/* Botão de visualização */}
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={viewMode === 'cards' ? <VisibilityIcon /> : viewMode === 'stats' ? <PieChartIcon /> : <BarChartIcon />}
              onClick={handleViewMenuOpen}
              sx={{ borderRadius: 20 }}
            >
              Visualização
            </StyledButton>
            
            {/* Menu de visualização */}
            <Menu
              anchorEl={viewMenuAnchorEl}
              open={Boolean(viewMenuAnchorEl)}
              onClose={handleViewMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  width: 200
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Modo de Visualização
              </Typography>
              <MenuItem 
                onClick={() => handleViewModeChange('cards')}
                selected={viewMode === 'cards'}
              >
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Cards" />
              </MenuItem>
              <MenuItem 
                onClick={() => handleViewModeChange('stats')}
                selected={viewMode === 'stats'}
              >
                <ListItemIcon>
                  <PieChartIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Estatísticas" />
              </MenuItem>
              <MenuItem 
                onClick={() => handleViewModeChange('events')}
                selected={viewMode === 'events'}
              >
                <ListItemIcon>
                  <BarChartIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Por Evento" />
              </MenuItem>
            </Menu>
          </Box>
        </Paper>
        
        {/* Conteúdo principal */}
        {viewMode === 'cards' && (
          <>
            {/* Resultados da busca */}
            <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
                {filteredGuests.length} convidados encontrados
            </Typography>
            </Box>

            {filteredGuests.length > 0 ? (
            <>
                {/* grid responsivo */}
                <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',            // 1 coluna no mobile
                        sm: 'repeat(2, 1fr)', // 2 no small
                        md: 'repeat(4, 1fr)'  // 4 colunas a partir de md
                    },
                    gridAutoRows: '1fr',
                    gap: 3
                }}
                >
                {paginatedGuests.map(guest => {
                    const event = allEvents.find(e => e.id === guest.eventId);
                    return (
                    <Paper
                        key={guest.id}
                        sx={{
                            width: '100%',
                            maxWidth: '300px',
                            mx: 'auto',
                            p: 2,
                            borderRadius: 3,
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                transform: 'translateY(-4px)'
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                    >
                        {/* cabeçalho */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip
                                label={guest.status === 'confirmed' ? 'Confirmado'
                                    : guest.status === 'pending'   ? 'Pendente'
                                    : 'Recusado'}
                                size="small"
                                sx={{
                                    backgroundColor: guest.status === 'confirmed' ? alpha(theme.palette.success.main, 0.1)
                                        : guest.status === 'pending' ? alpha(theme.palette.warning.main, 0.1)
                                        : alpha(theme.palette.error.main, 0.1),
                                    color: guest.status === 'confirmed' ? theme.palette.success.main
                                        : guest.status === 'pending' ? theme.palette.warning.main
                                        : theme.palette.error.main,
                                    fontWeight: 600,
                                    borderRadius: 8,
                                    border: theme.palette.mode === 'light' ? `1px solid ${alpha(
                                      guest.status === 'confirmed' ? theme.palette.success.main : 
                                      guest.status === 'pending' ? theme.palette.warning.main : 
                                      theme.palette.error.main, 0.3)}` : 'none',
                                }}
                                icon={guest.status === 'confirmed' ? <CheckCircleIcon fontSize="small" />
                                    : guest.status === 'pending' ? <HelpOutlineIcon fontSize="small" />
                                    : <CancelIcon fontSize="small" />
                                }
                            />
                            {guest.group && (
                                <Chip
                                    label={guest.group}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        borderRadius: 8,
                                        border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                                    }}
                                />
                            )}
                        </Box>

                        {/* avatar e nome */}
                        <Box sx={{ mb: 2 }}>
                            <Avatar
                                src={guest.imageUrl || ''}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    mx: 'auto',
                                    mb: 1,
                                    backgroundColor: theme.palette.primary.main,
                                    fontSize: '1.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {guest.name.charAt(0)}
                            </Avatar>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': { color: theme.palette.primary.main }
                                }}
                                onClick={() => handleNavigateToGuest(guest.eventId, guest.id)}
                            >
                                {guest.name}
                            </Typography>
                        </Box>

                        {/* contatos */}
                        <Box sx={{ mb: 2 }}>
                            {guest.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
                                    <MailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {guest.email}
                                    </Typography>
                                </Box>
                            )}
                            {guest.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {guest.phone}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* rodapé com evento */}
                        <Box sx={{ 
                          mt: 'auto', 
                          pt: 2, 
                          borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` 
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleNavigateToEvent(guest.eventId)}
                            >
                            {event?.title || 'Evento Desconhecido'}
                            </Typography>
                        </Box>
                        {event?.date && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(event.date).toLocaleDateString('pt-BR', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                                })}
                            </Typography>
                            </Box>
                        )}
                        {event?.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {event.location}
                            </Typography>
                            </Box>
                        )}
                        
                        {/* Status do evento */}
                        {event?.date && (
                            <Box sx={{ mt: 1 }}>
                              <EventStatusChip date={event.date} />
                            </Box>
                        )}
                        
                        {/* Contador regressivo para eventos futuros */}
                        {eventTabValue === 0 && event?.date && new Date(event.date) > new Date() && (
                            <Box sx={{ mt: 1 }}>
                              <CountdownTimer targetDate={event.date} />
                            </Box>
                        )}
                        </Box>
                    </Paper>
                    );
                })}
                </Box>

                {/* paginação */}
                {pageCount > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                    />
                </Box>
                )}
            </>
            ) : (
            <EmptyState
                icon={<PersonIcon sx={{ fontSize: 60 }} />}
                title="Nenhum convidado encontrado"
                description="Tente ajustar os filtros ou termos de busca."
            />
            )}
          </>
        )}
        
        {viewMode === 'stats' && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Gráfico de Status - Ajustado para ocupar metade do espaço */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                flex: '1 1 50%',
                border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Distribuição por Status
              </Typography>
              <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [`${value} convidados`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            
            {/* Gráfico de Grupos - Ajustado para ocupar metade do espaço */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                flex: '1 1 50%',
                border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Distribuição por Grupo
              </Typography>
              <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={groupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {groupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [`${value} convidados`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        )}
        
        {viewMode === 'events' && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: theme.palette.mode === 'light' ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Convidados por Evento
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <RechartsTooltip formatter={(value, name) => {
                    const label = name === 'confirmed' ? 'Confirmados' : 
                                 name === 'pending' ? 'Pendentes' : 'Recusados';
                    return [`${value} convidados`, label];
                  }} />
                  <Legend />
                  <Bar dataKey="confirmed" name="Confirmados" fill={theme.palette.success.main} />
                  <Bar dataKey="pending" name="Pendentes" fill={theme.palette.warning.main} />
                  <Bar dataKey="declined" name="Recusados" fill={theme.palette.error.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}
      </Container>
      {/* Loading Indicator */}
      <LoadingIndicator 
        open={isLoading} 
        type="overlay" 
        message="Carregando dados..."
      />
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
    </Box>
  );
};

export default Dashboard;
