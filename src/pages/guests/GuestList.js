import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Divider,
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
  Checkbox,
  Tooltip,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Fade,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
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
  ArrowDownward as ArrowDownwardIcon,
  MoreHoriz as MoreHorizIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
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

// Componente de card de convidado

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

    // Carregar convidados e convites quando o eventId estiver disponível
    useEffect(() => {
      if (!eventId && !currentEventId) {
        setShowEventSelector(true);
        return;
      }
      setShowEventSelector(false);
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            dispatch(fetchGuests(eventId || currentEventId)),
            dispatch(fetchInvites(eventId || currentEventId))
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      
    }, [dispatch, currentEventId]);

  // Função para lidar com a seleção de evento no modal
  const handleEventSelect = (selectedEventId, eventData) => {
    console.log('Evento selecionado:', selectedEventId, eventData);
    setShowEventSelector(false);
    setCurrentEventId(selectedEventId);
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


  // Função para mostrar o modal de seleção novamente (pode ser útil para trocar de evento)
  const handleChangeEvent = () => {
    setShowEventSelector(true);
  };

  // Exibir erro se houver
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
  // Exibir mensagem de sucesso após vincular convidados
  useEffect(() => {
    if (linkingSuccess) {
      setSnackbarMessage(`Convidados vinculados com sucesso ao convite!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedGuests([]);
      setLinkInviteDialogOpen(false);
      // Recarregar a lista de convidados para mostrar as atualizações
      dispatch(fetchGuests(eventId));
    }
  }, [linkingSuccess, dispatch, eventId]);
  
  // Manipular mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Manipular busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Abrir menu de ações
  const handleMenuOpen = (event, guest) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActionMenuGuest(guest);
  };
  
  // Fechar menu de ações
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActionMenuGuest(null);
  };
  
  // Excluir convidado
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
  
  // Atualizar status do convidado
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
  
  // Abrir diálogo de vinculação de convites
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
  
  // Vincular convidados ao convite selecionado
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
  
  // Abrir diálogo de envio de mensagens
  const handleOpenSendMessageDialog = () => {
    if (selectedGuests.length === 0) {
      setSnackbarMessage('Selecione pelo menos um convidado para enviar mensagem');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    // Verificar se todos os convidados selecionados têm convites vinculados
    const guestsWithoutInvite = selectedGuests.filter(
      guestId => !guests.find(g => g?.id === guestId)?.inviteId
    );
    
    if (guestsWithoutInvite.length > 0) {
      setSnackbarMessage('Alguns convidados selecionados não possuem convite vinculado. Vincule um convite primeiro.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setMessageText(`Olá! Gostaria de confirmar sua presença no evento ${currentEvent?.title || 'nosso evento'}. Por favor, acesse o link do convite para responder.`);
    setSendMessageDialogOpen(true);
    setSpeedDialOpen(false);
  };
  
  // Enviar mensagens para os convidados selecionados (individual ou em massa)
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
      // Iterar sobre os convidados selecionados e enviar mensagem individualmente
      // Usamos sendWhatsappReminder que aceita guestId e message
      const sendPromises = selectedGuests.map(guestId => {
        // Encontrar o objeto convidado completo para obter o ID
        const guest = guests.find(g => g?.id === guestId);
        if (!guest) {
          console.error(`Convidado com ID ${guestId} não encontrado na lista.`);
          // Retorna uma promessa rejeitada para que seja contada como erro
          return Promise.reject(`Convidado ${guestId} não encontrado.`);
        }
        
        // Construir a URL RSVP
        // Usar window.location.origin para obter a base da URL atual
        const rsvpUrl = `${window.location.origin}/rsvp/${guest?.id}`;
        
        // Montar a mensagem final com o link RSVP
        const finalMessage = `${messageText}\n\nResponda aqui: ${rsvpUrl}`;
        
        const payload = {
          guestId: guest?.id, // Usar guest?.id que já temos
          message: finalMessage // Usar a mensagem com o link
        };
        return dispatch(sendWhatsappReminder(payload)).unwrap();
      });

      // Aguardar todas as promessas de envio
      const results = await Promise.allSettled(sendPromises);

      // Processar resultados
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

      // Lidar com o resultado geral
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
      // Limpar seleção apenas se todos os envios foram bem-sucedidos
      if (errorCount === 0) {
         setSelectedGuests([]);
      }

    } catch (err) {
      // Erro inesperado (não deveria acontecer com Promise.allSettled)
      console.error("Erro inesperado no handleSendMessage:", err);
      setSnackbarMessage(err?.message || "Erro inesperado ao processar envio de mensagens.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Executar ação em massa
  const handleBulkAction = async () => {
    if (!bulkAction) return;
    
    setIsLoading(true);
    try {
      if (bulkAction === 'delete') {
        // Implementar exclusão em massa
        for (const guestId of selectedGuests) {
          await dispatch(deleteGuest(guestId)).unwrap();
        }
        setSnackbarMessage(`${selectedGuests.length} convidados excluídos com sucesso!`);
      } else if (bulkAction === 'status') {
        // Implementar atualização de status em massa
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
  
  // Cancelar ação em massa
  const handleCancelBulkAction = () => {
    setBulkActionDialogOpen(false);
    setBulkAction('');
  };
  
  // Selecionar/deselecionar convidado
  const handleSelectGuest = (guestId) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      } else {
        return [...prev, guestId];
      }
    });
  };
  
  // Selecionar/deselecionar todos os convidados
  const handleSelectAllGuests = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map(guest => guest?.id));
    }
  };
  
  // Alternar direção de ordenação
  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Exportar CSV
  const handleExportCsv = () => {
    // Determinar quais convidados exportar
    const guestsToExport = selectedGuests.length > 0
      ? guests.filter(guest => selectedGuests.includes(guest?.id))
      : guests;
    
    // Definir cabeçalhos
    const headers = ['id', 'name', 'email', 'phone', 'whatsapp', 'group', 'status', 'inviteId'];
    
    // Criar linhas de dados
    const rows = guestsToExport.map(guest => {
      return headers.map(header => {
        // Tratar valores especiais
        if (header === 'whatsapp') {
          return guest[header] ? 'true' : 'false';
        }
        return guest[header] !== undefined ? guest[header] : '';
      }).join(',');
    });
    
    // Montar conteúdo CSV
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `convidados_${eventId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensagem de sucesso
    setSnackbarMessage(`${guestsToExport.length} convidados exportados com sucesso!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Manipular sucesso na importação
  const handleImportSuccess = (results) => {
    setSnackbarMessage(`${results.imported} convidados importados com sucesso!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Recarregar a lista de convidados
    dispatch(fetchGuests(eventId));
  };
  
  // Filtrar convidados
  const filteredGuests = guests.filter(guest => {
    // Filtrar por termo de busca
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (guest.phone && guest.phone.includes(searchTerm));
    
    // Filtrar por grupo
    const matchesGroup = filterGroup === 'all' || guest.group === filterGroup;
    
    // Filtrar por status (aba)
    const matchesStatus = 
      (tabValue === 0) || // Todos
      (tabValue === 1 && guest.status === 'confirmed') || // Confirmados
      (tabValue === 2 && guest.status === 'pending') || // Pendentes
      (tabValue === 3 && guest.status === 'declined'); // Recusados
    
    return matchesSearch && matchesGroup && matchesStatus;
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
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Grupos disponíveis
  const groups = [
    { id: 'all', name: 'Todos os Grupos' },
    { id: 'default', name: 'Geral' },
    { id: 'family', name: 'Família' },
    { id: 'friends', name: 'Amigos' },
    { id: 'colleagues', name: 'Colegas de Trabalho' },
    { id: 'vip', name: 'VIP' }
  ];
  
  // Opções de ordenação
  const sortOptions = [
    { id: 'name', name: 'Nome' },
    { id: 'status', name: 'Status' },
    { id: 'group', name: 'Grupo' }
  ];
  
  // Configuração das abas
  const tabsConfig = [
    { label: `Todos (${guests.length})`, icon: <PersonIcon />, iconPosition: 'start' },
    { label: `Confirmados (${guests.filter(guest => guest.status === 'confirmed').length})`, icon: <CheckCircleIcon />, iconPosition: 'start' },
    { label: `Pendentes (${guests.filter(guest => guest.status === 'pending').length})`, icon: <HelpOutlineIcon />, iconPosition: 'start' },
    { label: `Recusados (${guests.filter(guest => guest.status === 'declined').length})`, icon: <CancelIcon />, iconPosition: 'start' }
  ];
  
  // Ações do menu de convidado
  const getGuestMenuActions = (guest) => [
    {
      label: 'Editar',
      icon: <EditIcon fontSize="small" />,
      onClick: () => navigate(`/events/${eventId || currentEvent?.id}/guests/edit/${guest?.id}`)
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
  
  // Ações do SpeedDial
  const speedDialActions = [
    { 
      icon: <AddIcon />, 
      name: 'Adicionar Convidado', 
      action: () => navigate(`/events/${eventId || currentEvent?.id}/guests/new`),
      color: theme.palette.success.main
    },
    { 
      icon: <CheckCircleIcon />, 
      name: 'Confirmar Todos', 
      action: () => {
        setBulkAction('status');
        handleBulkAction();
      },
      color: theme.palette.success.main
    },
    { 
      icon: <DeleteIcon />, 
      name: 'Excluir Todos', 
      action: () => {
        setBulkAction('delete');
        handleBulkAction();
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
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <EventSelectorModal
        open={showEventSelector}
        onClose={() => setShowEventSelector(false)}
        onSelectEvent={handleEventSelect}
        apiEndpoint="/api/events" 
      />
      <Box>
        {/* Botão para trocar de evento */}
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleChangeEvent}
            startIcon={<ArrowBackIcon />}
          >
            Trocar Evento
          </Button>
        </Box>
        </Box>
        <>
          {/* Título e subtítulo à direita */}
          <PageTitle
            title={currentEvent?.title || 'Lista de Convidados'}
            subtitle={`${currentEvent?.title || 'Evento'} - ${guests.length} convidados`}
            alignRight={true}
            mb={0}
          />
        
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
          {/* Convidados */}
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

          {/* Confirmados */}
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

          {/* Pendentes */}
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

          {/* Recusados */}
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
        
        {/* Barra de pesquisa e filtros */}
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
                  {/* Botão Selecionar Todos */}
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
                  
                  {/* Botão Importar */}
                  <Button
                    variant="contained"
                    color="warning"
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
                  
                  {/* Botão Adicionar Convidado */}
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/events/${eventId || currentEvent?.id}/guests/new`)}
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
          
          {/* Abas */}
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            tabs={tabsConfig}
            variant={isMobile ? "fullWidth" : "standard"}
          />
          
          {/* Conteúdo das abas */}
          {statusFilters.map((status, index) => (
            <TabPanel value={tabValue} index={index} key={index}>
              {filteredGuests.length === 0 ? (
                <EmptyState 
                  message={emptyConfigs[index].message}
                  icon={emptyConfigs[index].icon}
                  color={emptyConfigs[index].color}
                  actionText={index === 0 ? "Adicionar Convidado" : null}
                  actionIcon={<AddIcon />}
                  onAction={index === 0 ? () => navigate(`/events/${eventId || currentEvent?.id}/guests/new`) : null}
                />
              ) : (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr 1fr',
                    lg: '1fr 1fr 1fr 1fr'
                  },
                  gap: 3,
                  p: 2
                }}>
                  {sortedGuests.map(guest => (
                    <GuestCard
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
                      eventId={eventId}
                      navigate={navigate}
                    />
                  ))}
                </Box>
              )}
            </TabPanel>
          ))}
        </Paper>

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
      
      {/* Diálogo de confirmação de exclusão */}
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
      
      {/* Diálogo de ação em massa */}
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
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  setBulkAction('status');
                  handleBulkAction();
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
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setBulkAction('delete');
                  handleBulkAction();
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
                  handleBulkAction();
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
                color="info"
                startIcon={<SendIcon />}
                onClick={() => {
                  setBulkAction('message');
                  handleBulkAction();
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
                  handleBulkAction();
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
      
      {/* Diálogo de vinculação de convites */}
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
      
      {/* Diálogo de envio de mensagens */}
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
            // rows={4}
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
              color="success"
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
      
      {/* Diálogo de importação de CSV */}
      <GuestImport
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        eventId={eventId || currentEventId || currentEvent?.id}
        onSuccess={handleImportSuccess}
      />
      
      {/* Snackbar para mensagens */}
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
      
      {/* SpeedDial para ações */}
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

      </>
      {!currentEventId || isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <LoadingIndicator
                open={loading}
                type="fullscreen"
                message="Carregando..."
              />
          </Box>
        ) : (null)}
  </Container>
)}

export default GuestList;
