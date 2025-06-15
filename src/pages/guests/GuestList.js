import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Snackbar,
  Alert,
  useMediaQuery,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  ListItemIcon,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  SelectAll as SelectAllIcon,
  Link as LinkIcon,
  Send as SendIcon,
  Group as GroupIcon,
  ArrowUpward as ArrowUpwardIcon,
  SwapHoriz as SwapHorizIcon,
  ArrowDownward as ArrowDownwardIcon,
  ForwardToInbox as ForwardToInboxIcon
} from '@mui/icons-material';
import { fetchGuests, deleteGuest, updateGuestStatus } from '../../store/actions/guestActions';
import { fetchInvites, linkGuestsToInvite } from '../../store/actions/inviteActions';
import { sendWhatsappBulk, sendWhatsappReminder } from '../../store/actions/whatsappActions';
import GuestCard from '../../components/GuestCard';

import EventSelectorModal from '../../components/EventSelectorModal';

// Componentes reutilizáveis
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import StyledButton from '../../components/StyledButton';
import { StyledTabs, TabPanel } from '../../components/StyledTabs';
import ConfirmDialog from '../../components/ConfirmDialog';
import SearchFilterBar from '../../components/SearchFilterBar';
import ActionMenu from '../../components/ActionMenu';
import EmptyState from '../../components/EmptyState';
import LoadingIndicator from '../../components/LoadingIndicator';

// Componente de importação
import GuestImport from './GuestImport';

// Componentes mobile melhorados
import MobileFilterDrawer from './MobileFilterDrawer';
import MobileGuestCard from './MobileGuestCard';
import MobileStatsGrid from './MobileStatsGrid';
import MobileTabs from './MobileTabs';

// Função para gerar cor baseada em string
const stringToColor = (string) => {
  if (!string) return '#5e35b1'; // Cor padrão se não houver string
  
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

const GuestList = () => {
  const { eventId } = useParams() || currentEventId;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { guests, loading, error } = useSelector(state => state.guests);
  const { invites, loading: invitesLoading, linkingGuests, linkingSuccess } = useSelector(state => state.invites);
  const { currentEvent } = useSelector(state => state.events);

  const [showEventSelector, setShowEventSelector] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(eventId);
  const [currentEventData, setCurrentEventData] = useState();

  // Estados existentes
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [actionMenuGuest, setActionMenuGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [linkInviteDialogOpen, setLinkInviteDialogOpen] = useState(false);
  const [selectedInviteId, setSelectedInviteId] = useState('');
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Novo estado para controle do drawer mobile
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Todos os useEffects e funções existentes permanecem inalterados
  useEffect(() => {
    if (bulkAction) {
      handleBulkAction();
      setBulkAction(''); 
    }
  }, [bulkAction]);

  useEffect(() => {
    if (!eventId && !currentEventId && !currentEvent) {
      setShowEventSelector(true);
      return;
    }
    setShowEventSelector(false);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchGuests(eventId || currentEventId || currentEvent?.id)),
          dispatch(fetchInvites(eventId || currentEventId || currentEvent?.id))
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, currentEventId]);

  const handleEventSelect = (selectedEventId, eventData) => {
    console.log('Evento selecionado:', selectedEventId, eventData);
    setShowEventSelector(false);
    setCurrentEventId(selectedEventId);
    setCurrentEventData(eventData);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchGuests(selectedEventId)),
          dispatch(fetchInvites(selectedEventId))
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  const handleChangeEvent = () => {
    setShowEventSelector(true);
  };

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
  useEffect(() => {
    if (linkingSuccess) {
      setSnackbarMessage(`Convidados vinculados com sucesso ao convite!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedGuests([]);
      setLinkInviteDialogOpen(false);
      dispatch(fetchGuests(eventId || currentEventId || currentEvent?.id));
    }
  }, [linkingSuccess, dispatch, eventId || currentEventId || currentEvent?.id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleMenuOpen = (event, guest) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActionMenuGuest(guest);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActionMenuGuest(null);
  };
  
  const handleDeleteGuest = async () => {
    if (!guestToDelete || !guestToDelete?.id) {
      setSnackbarMessage('Erro: Convidado não selecionado corretamente');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      await dispatch(deleteGuest(guestToDelete?.id)).unwrap();
      setSnackbarMessage('Convidado excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err?.message || 'Erro ao excluir convidado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setGuestToDelete(null);
    }
  };
  
  const handleUpdateStatus = async (guestId, newStatus) => {
    setIsLoading(true);
    try {
      await dispatch(updateGuestStatus({ id: guestId, status: newStatus })).unwrap();
      setSnackbarMessage('Status atualizado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err?.message || 'Erro ao atualizar status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      handleMenuClose();
    }
  };
  
  const handleOpenLinkInviteDialog = () => {
    if (selectedGuests.length === 0) {
      setSnackbarMessage('Selecione pelo menos um convidado para vincular a um convite');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    if (invites.length === 0) {
      setSnackbarMessage('Não há convites disponíveis para este evento. Crie um convite primeiro.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setSelectedInviteId(invites[0]?.id || '');
    setLinkInviteDialogOpen(true);
    setSpeedDialOpen(false);
  };
  
  const handleLinkGuestsToInvite = async () => {
    if (!selectedInviteId) {
      setSnackbarMessage('Selecione um convite para vincular aos convidados');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await dispatch(linkGuestsToInvite({
        inviteId: selectedInviteId,
        guestIds: selectedGuests
      })).unwrap();
    } catch (err) {
      setSnackbarMessage(err?.message || 'Erro ao vincular convidados ao convite');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLinkInviteDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenSendMessageDialog = (unique = false) => {
    if (selectedGuests.length === 0 && !unique) {
      setSnackbarMessage('Selecione pelo menos um convidado para enviar mensagem');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    const guestsWithoutInvite = selectedGuests.filter(
      guestId => !guests.find(g => g?.id === guestId)?.inviteId
    );
    
    if (guestsWithoutInvite.length > 0) {
      setSnackbarMessage('Alguns convidados selecionados não possuem convite vinculado. Vincule um convite primeiro.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setMessageText(`Olá! Gostaria de confirmar sua presença no evento ${currentEventData?.title || currentEvent?.title || 'nosso evento'}. Por favor, acesse o link do convite para responder.`);
    setSendMessageDialogOpen(true);
    setSpeedDialOpen(false);
  };
  
  const handleSendMessage = async () => {
    if (!messageText || selectedGuests.length === 0) {
      setSnackbarMessage("Erro: Mensagem ou convidados não definidos.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      const sendPromises = selectedGuests.map(guestId => {
        const guest = guests.find(g => g?.id === guestId);
        if (!guest) {
          console.error(`Convidado com ID ${guestId} não encontrado na lista.`);
          return Promise.reject(`Convidado ${guestId} não encontrado.`);
        }
        
        const rsvpUrl = `${window.location.origin}/rsvp/${guest?.id}`;
        const finalMessage = `${messageText}\n\nResponda aqui:\n ${rsvpUrl}`;
        
        const payload = {
          guestId: guest?.id,
          message: finalMessage
        };
        return dispatch(sendWhatsappReminder(payload)).unwrap();
      });

      const results = await Promise.allSettled(sendPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          errorCount++;
          const guestInfo = guests.find(g => g?.id === selectedGuests[index]);
          errors.push(`Falha ao enviar para ${guestInfo?.name || selectedGuests[index]}: ${result.reason}`);
          console.error(`Erro ao enviar para ${selectedGuests[index]}:`, result.reason);
        }
      });

      if (errorCount === 0) {
        setSnackbarMessage(`Mensagem enviada com sucesso para ${successCount} convidado(s)!`);
        setSnackbarSeverity("success");
      } else if (successCount > 0) {
        setSnackbarMessage(`Mensagem enviada para ${successCount} convidado(s), mas falhou para ${errorCount}. Verifique o console para detalhes.`);
        setSnackbarSeverity("warning");
      } else {
        setSnackbarMessage(`Falha ao enviar mensagem para todos os ${errorCount} convidado(s) selecionados. Verifique o console para detalhes.`);
        setSnackbarSeverity("error");
      }

      setSnackbarOpen(true);
      setSendMessageDialogOpen(false);
      setMessageText("");
      if (errorCount === 0) {
         setSelectedGuests([]);
      }

    } catch (err) {
      console.error("Erro inesperado no handleSendMessage:", err);
      setSnackbarMessage(err?.message || "Erro inesperado ao processar envio de mensagens.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBulkAction = async () => {
    if (!bulkAction) return;
    
    setIsLoading(true);
    try {
      if (bulkAction === 'delete') {
        for (const guestId of selectedGuests) {
          await dispatch(deleteGuest(guestId)).unwrap();
        }
        setSnackbarMessage(`${selectedGuests.length} convidados excluídos com sucesso!`);
      } else if (bulkAction === 'status') {
        for (const guestId of selectedGuests) {
          await dispatch(updateGuestStatus({ id: guestId, status: 'confirmed' })).unwrap();
        }
        setSnackbarMessage(`${selectedGuests.length} convidados atualizados com sucesso!`);
      } else if (bulkAction === 'link') {
        handleOpenLinkInviteDialog();
        setBulkActionDialogOpen(false);
        setIsLoading(false);
        return;
      } else if (bulkAction === 'message') {
        handleOpenSendMessageDialog();
        setBulkActionDialogOpen(false);
        setIsLoading(false);
        return;
      } else if (bulkAction === 'export') {
        handleExportCsv();
        setBulkActionDialogOpen(false);
        setIsLoading(false);
        return;
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedGuests([]);
    } catch (err) {
      setSnackbarMessage(err?.message || 'Erro ao executar ação em massa');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setBulkActionDialogOpen(false);
      setBulkAction('');
    }
  };
  
  const handleCancelBulkAction = () => {
    setBulkActionDialogOpen(false);
    setBulkAction('');
  };
  
  const handleSelectGuest = (guestId) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      } else {
        return [...prev, guestId];
      }
    });
  };
  
  const handleSelectAllGuests = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map(guest => guest?.id));
    }
  };
  
  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const handleExportCsv = () => {
    const guestsToExport = selectedGuests.length > 0
      ? guests.filter(guest => selectedGuests.includes(guest?.id))
      : guests;
    
    const headers = ['id', 'name', 'email', 'phone', 'whatsapp', 'group', 'status', 'inviteId'];
    
    const rows = guestsToExport.map(guest => {
      return headers.map(header => {
        if (header === 'whatsapp') {
          return guest[header] ? 'true' : 'false';
        }
        return guest[header] !== undefined ? guest[header] : '';
      }).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `convidados_${eventId || currentEventId || currentEvent?.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbarMessage(`${guestsToExport.length} convidados exportados com sucesso!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const handleImportSuccess = (results) => {
    setSnackbarMessage(`${results.imported} convidados importados com sucesso!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    dispatch(fetchGuests(eventId || currentEventId || currentEvent?.id));
  };
  
  // Filtrar e ordenar convidados (lógica existente)
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (guest.phone && guest.phone.includes(searchTerm));
    
    const matchesGroup = filterGroup === 'all' || guest.group === filterGroup;
    
    const matchesStatus = 
      (tabValue === 0) ||
      (tabValue === 1 && guest.status === 'confirmed') ||
      (tabValue === 2 && guest.status === 'pending') ||
      (tabValue === 3 && guest.status === 'declined');
    
    return matchesSearch && matchesGroup && matchesStatus;
  });
  
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'group') {
      comparison = (a.group || '').localeCompare(b.group || '');
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Dados de configuração (existentes)
  const groups = [
    { id: 'all', name: 'Todos os Grupos' },
    { id: 'default', name: 'Geral' },
    { id: 'family', name: 'Família' },
    { id: 'friends', name: 'Amigos' },
    { id: 'colleagues', name: 'Colegas de Trabalho' },
    { id: 'vip', name: 'VIP' }
  ];
  
  const sortOptions = [
    { id: 'name', name: 'Nome' },
    { id: 'status', name: 'Status' },
    { id: 'group', name: 'Grupo' }
  ];
  
  const tabsConfig = [
    { label: `Todos (${guests.length})`, icon: <PersonIcon />, iconPosition: 'start' },
    { label: `Confirmados (${guests.filter(guest => guest.status === 'confirmed').length})`, icon: <CheckCircleIcon />, iconPosition: 'start' },
    { label: `Pendentes (${guests.filter(guest => guest.status === 'pending').length})`, icon: <HelpOutlineIcon />, iconPosition: 'start' },
    { label: `Recusados (${guests.filter(guest => guest.status === 'declined').length})`, icon: <CancelIcon />, iconPosition: 'start' }
  ];
  
  const getGuestMenuActions = (guest) => [
    {
      label: 'Editar',
      icon: <EditIcon fontSize="small" />,
      onClick: () => navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests/edit/${guest?.id}`),
      color: 'primary'
    },
    {
      label: 'Marcar como Confirmado',
      icon: <CheckCircleIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest?.id, 'confirmed'),
      color: 'success',
      disabled: guest.status === 'confirmed'
    },
    {
      label: 'Marcar como Pendente',
      icon: <HelpOutlineIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest?.id, 'pending'),
      color: 'warning',
      disabled: guest.status === 'pending'
    },
    {
      label: 'Marcar como Recusado',
      icon: <CancelIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest?.id, 'declined'),
      color: 'error',
      disabled: guest.status === 'declined'
    },
    {
      label: 'Enviar Mensagem',
      icon: <SendIcon fontSize="small" />,
      onClick: () => {
        setSelectedGuests([guest?.id]);
        handleOpenSendMessageDialog();
      },
      color: 'primary'
    },
    {
      label: 'Exportar Dados',
      icon: <FileDownloadIcon fontSize="small" />,
      onClick: () => {
        setSelectedGuests([guest?.id]);
        handleExportCsv();
        handleMenuClose();
      },
      color: 'primary'
    },
    {
      label: 'Excluir',
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => {
        setGuestToDelete(guest);
        setDeleteDialogOpen(true);
      },
      color: 'error'
    }
  ];
  
  const speedDialActions = [
    { 
      icon: <AddIcon />, 
      name: 'Adicionar Convidado', 
      action: () => navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests/new`),
      color: theme.palette.success.main
    },
    { 
      icon: <CheckCircleIcon />, 
      name: 'Confirmar Todos', 
      action: () => {
        setBulkAction('status');
      },
      color: theme.palette.success.main
    },
    { 
      icon: <DeleteIcon />, 
      name: 'Excluir Todos', 
      action: () => {
        setBulkAction('delete');
      },
      color: theme.palette.error.main
    },
    { 
      icon: <LinkIcon />, 
      name: 'Vincular Convite', 
      action: handleOpenLinkInviteDialog,
      color: theme.palette.primary.main
    },
    { 
      icon: <SendIcon />, 
      name: 'Enviar Mensagem', 
      action: handleOpenSendMessageDialog,
      color: theme.palette.info.main
    },
    { 
      icon: <FileDownloadIcon />, 
      name: 'Exportar Selecionados', 
      action: handleExportCsv,
      color: theme.palette.secondary.main
    }
  ];
  
  const statusFilters = [ null, 'confirmed', 'pending', 'declined' ];
  const emptyConfigs = [
    { message: 'Nenhum convidado encontrado',    icon: <PersonIcon/>,        color: 'primary' },
    { message: 'Nenhum confirmado',              icon: <CheckCircleIcon/>,   color: 'success' },
    { message: 'Nenhum pendente',                icon: <HelpOutlineIcon/>,    color: 'warning' },
    { message: 'Nenhum recusado',                icon: <CancelIcon/>,         color: 'error' },
  ];

  // Handlers para o drawer mobile
  const handleMobileAddGuest = () => {
    navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests/new`);
    setMobileFilterOpen(false);
  };

  const handleMobileImport = () => {
    setImportDialogOpen(true);
    setMobileFilterOpen(false);
  };

  const handleMobileBulkMessage = () => {
    setBulkAction('message');
    setMobileFilterOpen(false);
  };

  const handleMobileBulkActions = () => {
    setBulkActionDialogOpen(true);
    setMobileFilterOpen(false);
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <EventSelectorModal
        open={showEventSelector}
        onClose={() => setShowEventSelector(false)}
        onSelectEvent={handleEventSelect}
        apiEndpoint="/api/events" 
      />

      {/* Header - Adaptado para mobile */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Box sx={{ 
          display: 'flex',
          gap: 2,
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/events/${eventId || currentEventId || currentEvent?.id}`)}
            startIcon={<ArrowBackIcon />}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
          >
            Voltar ao Evento
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleChangeEvent}
            startIcon={<SwapHorizIcon />}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
          >
            Trocar Evento
          </Button>
        </Box>

        {/* Título */}
        <PageTitle
          title={currentEventData?.title || currentEvent?.title || 'Lista de Convidados'}
          subtitle={`${currentEventData?.title || currentEvent?.title || 'Evento'} - ${guests.length} convidados`}
          alignRight={!isMobile}
          sx={{
            mb: isMobile ? 3 : 5,
            ml: isMobile ? 0 : '35%',
            textAlign: isMobile ? 'center' : 'right'
          }}
        />
      </Box>

      {/* Cards de estatísticas - Condicional para mobile */}
      {isMobile ? (
        <MobileStatsGrid guests={guests} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            justifyContent: 'center'
          }}
        >
          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<PersonIcon fontSize="large" />}
              title="Convidados"
              value={guests.length}
              subtitle="convidados"
              color="primary"
            />
          </Box>

          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<CheckCircleIcon fontSize="large" />}
              title="Confirmados"
              value={guests.filter(g => g.status === 'confirmed').length}
              subtitle={guests.length > 0
                ? `${Math.round((guests.filter(g => g.status === 'confirmed').length / guests.length) * 100)}% do total`
                : '0%'}
              color="success"
            />
          </Box>

          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<HelpOutlineIcon fontSize="large" />}
              title="Pendentes"
              value={guests.filter(g => g.status === 'pending').length}
              subtitle="aguardando resposta"
              color="warning"
            />
          </Box>

          <Box sx={{
            flexBasis: { xs: '100%', sm: '48%', md: '23%' },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<CancelIcon fontSize="large" />}
              title="Recusados"
              value={guests.filter(g => g.status === 'declined').length}
              subtitle="não comparecerão"
              color="error"
            />
          </Box>
        </Box>
      )}
        
      {/* Barra de pesquisa e filtros - Oculta no mobile */}
      {!isMobile && (
        <Paper 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Buscar convidados..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                />
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    color="primary"
                    onClick={handleToggleSortDirection}
                    sx={{ 
                      mr: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                  
                  <FormControl fullWidth size="small">
                    <InputLabel id="sort-label">Ordenar por</InputLabel>
                    <Select
                      labelId="sort-label"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Ordenar por"
                      sx={{
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      {sortOptions.map(option => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="group-filter-label">Grupo</InputLabel>
                  <Select
                    labelId="group-filter-label"
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    label="Grupo"
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    {groups.map(group => (
                      <MenuItem key={group?.id} value={group?.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Tooltip title={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0 ? "Desmarcar todos" : "Selecionar todos"}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<SelectAllIcon />}
                      onClick={handleSelectAllGuests}
                      disabled={filteredGuests.length === 0}
                      size="small"
                      sx={{
                        borderRadius: 10,
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      {selectedGuests.length === filteredGuests.length && filteredGuests.length > 0 ? "Desmarcar todos" : "Selecionar todos"}
                    </Button>
                  </Tooltip>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileUploadIcon />}
                    onClick={() => setImportDialogOpen(true)}
                    size="small"
                    sx={{
                      borderRadius: 10,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
                      background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`,
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(255, 152, 0, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Importar
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests/new`)}
                    size="small"
                    sx={{
                      borderRadius: 10,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                      background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Adicionar
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ForwardToInboxIcon />}
                    onClick={() => {
                      setBulkAction('message');
                    }}
                    size="small"
                    sx={{
                      borderRadius: 10,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 20%, ${theme.palette.error.main} 90%)`,
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Convidar
                  </Button>
                  
                  {selectedGuests.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setBulkActionDialogOpen(true)}
                      startIcon={selectedGuests.length > 1 ? <GroupIcon /> : <PersonIcon />}
                      size="small"
                      sx={{
                        borderRadius: 10,
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(94, 53, 177, 0.3)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Ações ({selectedGuests.length})
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {/* Abas desktop */}
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            tabs={tabsConfig}
            variant="standard"
          />
        </Paper>
      )}

      {/* Abas para mobile (melhoradas) */}
      {isMobile && (
        <Paper 
          sx={{ 
            mb: 2,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}
        >
          <MobileTabs
            value={tabValue}
            onChange={handleTabChange}
            guests={guests}
          />
        </Paper>
      )}
          
      {/* Conteúdo das abas - Lista de convidados */}
      {statusFilters.map((status, index) => (
        <TabPanel value={tabValue} index={index} key={index}>
          {filteredGuests.length === 0 ? (
            <EmptyState 
              message={emptyConfigs[index].message}
              icon={emptyConfigs[index].icon}
              color={emptyConfigs[index].color}
              actionText={index === 0 ? "Adicionar Convidado" : null}
              actionIcon={<AddIcon />}
              onAction={index === 0 ? () => navigate(`/events/${eventId || currentEventId || currentEvent?.id}/guests/new`) : null}
            />
          ) : (
            <Box sx={{ 
              display: isMobile ? 'block' : 'grid', 
              gridTemplateColumns: {
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
                lg: '1fr 1fr 1fr 1fr'
              },
              gap: isMobile ? 0 : 3,
              p: isMobile ? 0 : 2
            }}>
              {sortedGuests.map(guest => (
                isMobile ? (
                  <MobileGuestCard
                    key={guest?.id}
                    guest={guest}
                    selected={selectedGuests.includes(guest?.id)}
                    onSelect={handleSelectGuest}
                    onMenuOpen={handleMenuOpen}
                    onDelete={(guest) => {
                      setGuestToDelete(guest);
                      setDeleteDialogOpen(true);
                    }}
                    groups={groups}
                    event={currentEvent || currentEventData}
                    navigate={navigate}
                  />
                ) : (
                  <GuestCard
                    key={guest?.id}
                    guest={guest}
                    selected={selectedGuests.includes(guest?.id)}
                    onSelect={handleSelectGuest}
                    onMenuOpen={handleMenuOpen}
                    handleOpenSendMessageDialog={handleOpenSendMessageDialog}
                    onDelete={(guest) => {
                      setGuestToDelete(guest);
                      setDeleteDialogOpen(true);
                    }}
                    groups={groups}
                    event={currentEvent || currentEventData}
                    navigate={navigate}
                  />
                )
              ))}
            </Box>
          )}
        </TabPanel>
      ))}

      {/* Drawer de filtros mobile */}
      {isMobile && (
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(!mobileFilterOpen)}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          onToggleSortDirection={handleToggleSortDirection}
          filterGroup={filterGroup}
          setFilterGroup={setFilterGroup}
          groups={groups}
          sortOptions={sortOptions}
          selectedGuests={selectedGuests}
          filteredGuests={filteredGuests}
          onSelectAllGuests={handleSelectAllGuests}
          onAddGuest={handleMobileAddGuest}
          onImport={handleMobileImport}
          onBulkMessage={handleMobileBulkMessage}
          onBulkActions={handleMobileBulkActions}
          eventId={eventId}
          currentEventId={currentEventId}
          currentEvent={currentEvent}
        />
      )}

      {/* Todos os diálogos existentes permanecem inalterados */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            mt: 1,
            minWidth: 200
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actionMenuGuest && getGuestMenuActions(actionMenuGuest).map((action, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              action.onClick();
              handleMenuClose();
            }}
            disabled={action.disabled}
            sx={{ 
              py: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: action.color 
                  ? alpha(theme.palette[action.color].main, 0.1)
                  : alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ color: action.color ? theme.palette[action.color].main : theme.palette.primary.main }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" color={action.color ? action.color : 'inherit'}>
                  {action.label}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteGuest}
        title="Excluir Convidado"
        content={`Tem certeza que deseja excluir ${guestToDelete?.name || 'este convidado'}? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="error"
      />
      
      <Dialog
        open={bulkActionDialogOpen}
        onClose={handleCancelBulkAction}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ mr: 1 }} />
            Ações em Massa ({selectedGuests.length} convidados)
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 3 }}>
            Escolha uma ação para aplicar aos convidados selecionados:
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  setBulkAction('status');
                }}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                }}
              >
                Confirmar Todos
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setBulkAction('delete');
                }}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                }}
              >
                Excluir Todos
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<LinkIcon />}
                onClick={() => {
                  setBulkAction('link');
                }}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                Vincular Convite
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={() => {
                  setBulkAction('message');
                }}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(3, 169, 244, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.light} 90%)`,
                }}
              >
                Enviar Mensagem
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<FileDownloadIcon />}
                onClick={() => {
                  setBulkAction('export');
                }}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                }}
              >
                Exportar
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCancelBulkAction} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={linkInviteDialogOpen}
        onClose={() => setLinkInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkIcon sx={{ mr: 1 }} />
            Vincular Convidados a um Convite
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Selecione um convite para vincular aos {selectedGuests.length} convidados selecionados:
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="invite-select-label">Convite</InputLabel>
            <Select
              labelId="invite-select-label"
              value={selectedInviteId}
              onChange={(e) => setSelectedInviteId(e.target.value)}
              label="Convite"
            >
              {invites.map(invite => (
                <MenuItem key={invite?.id} value={invite?.id}>
                  {invite.title || `Convite #${invite?.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setLinkInviteDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLinkGuestsToInvite} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              '&:hover': {
                boxShadow: '0 6px 16px rgba(94, 53, 177, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Vincular
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={sendMessageDialogOpen}
        onClose={() => setSendMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.info.main, 
          color: 'white',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SendIcon sx={{ mr: 1 }} />
            Enviar Mensagem para Convidados
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Envie uma mensagem para os {selectedGuests.length} convidados selecionados:
          </DialogContentText>
          
          <TextField
            fullWidth
            multiline
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            label="Mensagem"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              color="primary"
              fullWidth
              onClick={handleSendMessage}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
              }}
            >
              Enviar via WhatsApp
            </Button>
            
            <Button
              variant="contained"
              startIcon={<MailIcon />}
              color="primary"
              disabled={true}
              fullWidth
              onClick={handleSendMessage}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              }}
            >
              Enviar via Email
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setSendMessageDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      
      <GuestImport
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        eventId={eventId || currentEventId || currentEvent?.id}
        onSuccess={handleImportSuccess}
      />
      
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
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
            color: 'white',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* SpeedDial - Oculto no mobile */}
      {!isMobile && (
        <SpeedDial
          ariaLabel="Ações"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
          direction="up"
          FabProps={{
            sx: {
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              boxShadow: '0 4px 20px rgba(94, 53, 177, 0.3)',
            }
          }}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen={isMobile}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action.action();
              }}
              FabProps={{
                sx: {
                  bgcolor: action.color,
                  color: '#fff',
                  '&:hover': {
                    bgcolor: alpha(action.color, 0.8),
                  }
                }
              }}
            />
          ))}
        </SpeedDial>
      )}

      {!eventId || !currentEventId || !currentEvent?.id || isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <LoadingIndicator
            open={loading}
            type="fullscreen"
            message="Carregando..."
          />
        </Box>
      ) : null}
    </Container>
  );
};

export default GuestList;

