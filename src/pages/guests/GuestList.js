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
  CircularProgress,
  useMediaQuery,
  Button
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
  Group as GroupIcon
} from '@mui/icons-material';
import { fetchGuests, deleteGuest, updateGuestStatus } from '../../store/actions/guestActions';

// Componentes reutilizáveis
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import StyledButton from '../../components/StyledButton';
import { StyledTabs, TabPanel } from '../../components/StyledTabs';
import ConfirmDialog from '../../components/ConfirmDialog';
import SearchFilterBar from '../../components/SearchFilterBar';
import ActionMenu from '../../components/ActionMenu';
import ActionButton from '../../components/ActionButton';
import EmptyState from '../../components/EmptyState';
import GuestsGallery from './GuestsGallery';

const GuestList = () => {
  const { eventId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { guests, loading, error } = useSelector(state => state.guests);
  const { currentEvent } = useSelector(state => state.events);
  
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
  
  // Carregar convidados
  useEffect(() => {
    if (eventId) {
      dispatch(fetchGuests(eventId));
    }
  }, [dispatch, eventId]);
  
  // Exibir erro se houver
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
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
    try {
      await dispatch(deleteGuest(guestToDelete.id)).unwrap();
      setSnackbarMessage('Convidado excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao excluir convidado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setGuestToDelete(null);
  };
  
  // Atualizar status do convidado
  const handleUpdateStatus = async (guestId, newStatus) => {
    try {
      await dispatch(updateGuestStatus({ id: guestId, status: newStatus })).unwrap();
      setSnackbarMessage('Status atualizado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao atualizar status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };
  
  // Executar ação em massa
  const handleBulkAction = async () => {
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
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedGuests([]);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao executar ação em massa');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setBulkActionDialogOpen(false);
    setBulkAction('');
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const statusFilters = [ null, 'confirmed', 'pending', 'declined' ];
  const emptyConfigs = [
    { message: 'Nenhum convidado encontrado',    icon: <PersonIcon/>,        color: 'primary' },
    { message: 'Nenhum confirmado',              icon: <CheckCircleIcon/>,   color: 'success' },
    { message: 'Nenhum pendente',                icon: <HelpOutlineIcon/>,    color: 'warning' },
    { message: 'Nenhum recusado',                icon: <CancelIcon/>,         color: 'error' },
  ];
    
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
      onClick: () => navigate(`/events/${eventId}/guests/edit/${guest.id}`)
    },
    {
      label: 'Marcar como Confirmado',
      icon: <CheckCircleIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest.id, 'confirmed'),
      color: 'success',
      disabled: guest.status === 'confirmed'
    },
    {
      label: 'Marcar como Pendente',
      icon: <HelpOutlineIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest.id, 'pending'),
      color: 'warning',
      disabled: guest.status === 'pending'
    },
    {
      label: 'Marcar como Recusado',
      icon: <CancelIcon fontSize="small" />,
      onClick: () => handleUpdateStatus(guest.id, 'declined'),
      color: 'error',
      disabled: guest.status === 'declined'
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
  
  // Ações da barra de filtros
  const filterBarActions = [
    {
      label: 'Importar',
      icon: <FileUploadIcon />,
      onClick: () => {/* Implementar importação */},
      variant: 'outlined'
    },
    {
      label: 'Exportar',
      icon: <FileDownloadIcon />,
      onClick: () => {/* Implementar exportação */},
      variant: 'outlined'
    }
  ];
  
  // Adicionar ação de massa se houver convidados selecionados
  if (selectedGuests.length > 0) {
    filterBarActions.push({
      label: `Ações (${selectedGuests.length})`,
      onClick: () => {
        setBulkAction('status');
        setBulkActionDialogOpen(true);
      },
      variant: 'contained',
      color: 'primary',
      sx: { 
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
        '&:hover': {
          boxShadow: '0 6px 16px rgba(94, 53, 177, 0.3)',
          transform: 'translateY(-2px)'
        }
      }
    });
  }
  
  // Renderizar tela de carregamento
  if (loading && guests.length === 0) {
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
        {/* Header com botão voltar à esquerda e título à direita */}
        <Box sx={{ 
          mb: 4,
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            onClick={() => navigate(`/events/${currentEvent.id}`)}
            sx={{ 
              borderRadius: 10,
              px: 2,
              py: 1,
              '&:hover': {
                transform: 'translateX(-4px)'
              }
            }}
          >
            Voltar para o Evento
          </StyledButton>
          
          {/* Título e subtítulo à direita */}
          <PageTitle
            title="Lista de Convidados"
            subtitle={`${currentEvent?.title || 'Evento'} - ${guests.length} convidados`}
            alignRight={true}
            mb={0}
          />
        </Box>
        
        {/* Cards de estatísticas */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,               // espaço entre os cards
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
        
        {/* Botão de adicionar convidado (flutuante) */}
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 1000 
          }}
        >
          {/* Substituído o componente Zoom por um botão normal para evitar o erro */}
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/events/${eventId}/guests/new`)}
            sx={{ 
              borderRadius: 10,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              '&:hover': {
                boxShadow: '0 6px 16px rgba(94, 53, 177, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Adicionar Convidado
          </StyledButton>
        </Box>
        
        {/* Painel de busca e filtros */}
        <Box
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`,
            overflow: 'hidden',
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8) 
              : theme.palette.background.paper
          }}
        >
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            // filterIcon={<SearchIcon color="primary" />}
            filterValue={filterGroup}
            onFilterChange={(e) => setFilterGroup(e.target.value)}
            filterOptions={groups}
            filterLabel="Grupo"
            filterIcon={<GroupIcon color="primary" fontSize="small" />}
            sortValue={sortBy}
            onSortChange={(e) => setSortBy(e.target.value)}
            sortOptions={sortOptions}
            sortIcon={<SortIcon color="primary" fontSize="small" />}
            actions={filterBarActions}
          />
          
          <Divider />
          
          {/* Abas de status */}
          <Box sx={{ px: 2 }}>
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              tabs={tabsConfig}
              variant={isMobile ? "scrollable" : "standard"}
            />
          </Box>

          {tabsConfig.map((_, idx) => {
            // filtra os convidados por status (idx 0 == all)
            const filtered = idx === 0
              ? sortedGuests
              : sortedGuests.filter(g => g.status === statusFilters[idx]);

            return (
              <TabPanel key={idx} value={tabValue} index={idx}>
                {filtered.length > 0
                  ? <GuestsGallery
                      guests={filtered}
                      onEdit={guest => navigate(`/events/${eventId}/guests/edit/${guest.id}`)}
                      onMenuOpen={handleMenuOpen}
                      onSelect={id => {
                        setSelectedGuests(prev =>
                          prev.includes(id)
                            ? prev.filter(x => x !== id)
                            : [...prev, id]
                        );
                      }}
                      selectedGuests={selectedGuests}
                    />
                  : <EmptyState
                      message={emptyConfigs[idx].message}
                      icon={React.cloneElement(emptyConfigs[idx].icon, { fontSize: 'large' })}
                      buttonText="Adicionar Convidado"
                      buttonAction={() => navigate(`/events/${eventId}/guests/new`)}
                      color={emptyConfigs[idx].color}
                    />
                }
              </TabPanel>
            );
          })}
        </Box>
        
        {/* Menu de ações do convidado */}
        <ActionMenu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          actions={actionMenuGuest ? getGuestMenuActions(actionMenuGuest) : []}
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
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        
        {/* Diálogo de confirmação de exclusão */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteGuest}
          title="Excluir convidado"
          message={`Deseja realmente excluir ${guestToDelete?.name || 'este convidado'}? Esta ação não pode ser desfeita.`}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          confirmColor="error"
        />
        
        {/* Diálogo de ação em massa */}
        <ConfirmDialog
          open={bulkActionDialogOpen}
          onClose={() => setBulkActionDialogOpen(false)}
          onConfirm={handleBulkAction}
          title="Ação em massa"
          message={`Deseja realmente atualizar ${selectedGuests.length} convidados? Esta ação não pode ser desfeita.`}
          cancelText="Cancelar"
          confirmText="Sim, continuar"
          confirmColor="primary"
        />
      </Container>
    </Box>
  );
};

export default GuestList;
