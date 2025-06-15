import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  useMediaQuery,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Tabs,
  Tab,
  ButtonGroup,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Fab
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InfoIcon from '@mui/icons-material/Info';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PageTitle from '../../components/PageTitle';
// Importando componentes
import LoadingIndicator from '../../components/LoadingIndicator';
import ConfirmDialog from '../../components/ConfirmDialog';
import ColorPicker from './components/ColorPicker';
import FontPicker from './components/FontPicker';
import InvitePreview from './components/InvitePreview';
import FormContent from './components/FormContent';

// Importando actions do Redux
import { fetchEvents } from '../../store/actions/eventActions';
import {
  fetchInvite,
  createInvite,
  updateInvite
} from '../../store/actions/inviteActions';

// Botão estilizado
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transform: 'translateY(-1px)'
  }
}));

// Estilização das abas
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: '3px 3px 0 0'
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    minHeight: 48,
    padding: '12px 16px',
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  }
}));

// Container para o formulário com tamanho fixo
const FormContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: '450px', // Largura fixa para o formulário
  height: 'fit-content',
  maxHeight: '80vh', // Altura máxima
  overflow: 'auto',
  position: 'sticky',
  top: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    position: 'relative',
    maxHeight: 'none'
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[300],
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.grey[400],
    },
  },
}));

// Container para o preview com largura fixa e altura livre
const PreviewContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: '600px', // Largura fixa para o preview
  minHeight: '400px', // Altura mínima
  height: 'auto', // Altura livre
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible', // Permite altura livre
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    minHeight: 'auto'
  }
}));

// Container para os botões flutuantes
const FloatingButtonsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 1000,
  [theme.breakpoints.down('md')]: {
    position: 'sticky',
    bottom: 0,
    right: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    width: '100%'
  }
}));

const InviteCreate = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { inviteId } = useParams();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Selecionando dados do Redux store
  const { events } = useSelector(state => state.events);
  const { currentInvite, loading: inviteLoading, error: inviteError } = useSelector(state => state.invites);
  // Usando o estado de autenticação diretamente do Redux
  const { currentUser } = useSelector(state => state.auth);

  // Estado para controlar as abas
  const [tabValue, setTabValue] = useState(0);

  // Estado para controlar o tipo de dispositivo
  const [deviceType, setDeviceType] = useState('mobile');

  // Estado para controlar o drawer mobile
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [showPreviewFullscreen, setShowPreviewFullscreen] = useState(false);

  // Configurações de tamanho para cada dispositivo - dimensões reais
  const deviceSizes = {
    mobile: {
      width: 320,
      height: 580,
      icon: <SmartphoneIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    tablet: {
      width: 768,
      height: 1024,
      icon: <TabletIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    desktop: {
      width: 1280,
      height: 800,
      icon: <LaptopIcon sx={{ fontSize: 20, mr: 1 }} />
    }
  };

  // Estados locais
  const [formData, setFormData] = useState({
    title: '',
    eventId: '',
    description: '',
    customText: '',
    bgColor: '#6a1b9a',
    accentColor: '#e91e63',
    textColor: '#ffffff',
    fontFamily: 'Roboto, sans-serif'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState('Carregando...');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentEvent, setCurrentEvent] = useState(null);

  // Manipulador para mudança de abas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Função para mudar o tipo de dispositivo
  const handleDeviceChange = (type) => {
    setDeviceType(type);
  };

  // Efeito para carregar eventos e convite (se estiver editando)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setMessageLoading('Carregando dados...');

      try {
        // Carregar eventos do usuário
        if (!events.length) {
          await dispatch(fetchEvents());
        }

        // Se for edição, carregar dados do convite
        if (inviteId) {
          await dispatch(fetchInvite(inviteId));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showSnackbar('Erro ao carregar dados. Tente novamente.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, inviteId, events.length]);

  // Efeito para preencher o formulário quando o convite atual mudar
  useEffect(() => {
    if (currentInvite && inviteId) {
      setFormData({
        title: currentInvite.title || '',
        eventId: currentInvite.eventId || '',
        description: currentInvite.description || '',
        customText: currentInvite.customText || '',
        bgColor: currentInvite.bgColor || '#6a1b9a',
        accentColor: currentInvite.accentColor || '#e91e63',
        textColor: currentInvite.textColor || '#ffffff',
        fontFamily: currentInvite?.fontFamily || 'Roboto, sans-serif'
      });

      // Encontrar o evento atual
      const event = events.find(e => e.id === currentInvite.eventId);
      if (event) {
        setCurrentEvent(event);
      }
    }
  }, [currentInvite, inviteId, events]);

  // Efeito para atualizar o evento atual quando o eventId mudar
  useEffect(() => {
    if (formData.eventId && events.length) {
      const event = events.find(e => e.id === formData.eventId);
      setCurrentEvent(event || null);
    } else {
      setCurrentEvent(null);
    }
  }, [formData.eventId, events]);

  // Efeito para mostrar erros do Redux
  useEffect(() => {
    if (inviteError) {
      showSnackbar(inviteError, 'error');
    }
  }, [inviteError]);

  // Manipuladores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = useCallback((color, type) => {
    setFormData(prev => ({ ...prev, [type]: color }));
  }, []);

  const handleFontChange = (font) => {
    setFormData(prev => ({ ...prev, fontFamily: font }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      showSnackbar('Por favor, informe um título para o convite.', 'warning');
      return;
    }

    if (!formData.eventId) {
      showSnackbar('Por favor, selecione um evento para o convite.', 'warning');
      return;
    }

    setIsLoading(true);
    setMessageLoading(inviteId ? 'Atualizando convite...' : 'Criando convite...');

    try {
      if (inviteId) {
        await dispatch(updateInvite({ id: inviteId, inviteData: formData }));
        showSnackbar('Convite atualizado com sucesso!', 'success');
      } else {
        const result = await dispatch(createInvite(formData));
        if (result.payload && result.payload.id) {
          showSnackbar('Convite criado com sucesso!', 'success');
          // Redirecionar para a página de edição após criar
          navigate(`/events`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar convite:', error);
      showSnackbar('Erro ao salvar convite. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(true);
  };

  const handleCancel = () => {
    setConfirmDialogOpen(false);
    navigate('/events');
  };

  const handleWhatsAppTest = () => {
    // Implementar lógica para testar no WhatsApp
    showSnackbar('Função de teste no WhatsApp em desenvolvimento.', 'info');
  };

  // Função para exibir snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };  

  // Componente do preview com largura fixa e altura livre
  const PreviewContent = () => (
    <PreviewContainer elevation={0}>
      {/* Header do preview */}
      {!isMobile && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Visualização do Convite
          </Typography>
          
          <ButtonGroup size="small" variant="outlined">
            {Object.entries(deviceSizes).map(([key, device]) => (
              <Button
                key={key}
                onClick={() => handleDeviceChange(key)}
                variant={deviceType === key ? 'contained' : 'outlined'}
                sx={{
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                {device.icon}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      )}

      {/* Preview do convite com altura livre */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: isMobile ? 'flex-start' : 'center',
        minHeight: '300px', // Altura mínima para o conteúdo
        width: '100%'
      }}>
        <InvitePreview
          title={formData.title}
          eventTitle={currentEvent?.title}
          customText={formData.customText}
          bgColor={formData.bgColor}
          accentColor={formData.accentColor}
          fontFamily={formData.fontFamily}
          showActions={!isMobile}
          deviceViewMode={isMobile ? 'mobile' : deviceType}
          onWhatsAppTest={handleWhatsAppTest}
        />
      </Box>
    </PreviewContainer>
  );

  // Layout para mobile
  if (isMobile) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Loading indicator */}
        {isLoading && <LoadingIndicator message={messageLoading} />}

        {/* Preview em tela cheia no mobile */}
        {showPreviewFullscreen ? (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.default',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Preview content ocupando tela inteira */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Botão de fechar flutuante */}
              <IconButton
                onClick={() => setShowPreviewFullscreen(false)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1000,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 0,
                  border: 'none',
                  p: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  overflow: 'auto',
                  height: '100%'
                }}>
                  <InvitePreview
                    title={formData.title}
                    eventTitle={currentEvent?.title}
                    customText={formData.customText}
                    bgColor={formData.bgColor}
                    accentColor={formData.accentColor}
                    fontFamily={formData.fontFamily}
                    showActions={false}
                    deviceViewMode="mobile"
                    onWhatsAppTest={handleWhatsAppTest}
                  />
                </Box>
              </Paper>
            </Box>
          </Box>
        ) : (
          <>
            {/* Header principal */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  onClick={() => navigate('/events')}
                  sx={{ mr: 2 }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {inviteId ? 'Editar Convite' : 'Criar Convite'}
                </Typography>
                <IconButton
                  onClick={() => setShowPreviewFullscreen(true)}
                  sx={{ mr: 1 }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Conteúdo principal */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <FormContent
              formData={formData}
              setFormData={setFormData}
              tabValue={tabValue}
              handleTabChange={handleTabChange}
              handleFontChange={handleFontChange}
              events={events}
            />
            </Box>
          </>
        )}

        {/* Botões flutuantes para mobile */}
        <FloatingButtonsContainer>
          <Button
            variant="outlined"
            onClick={handleCancelConfirm}
            sx={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{ flex: 1 }}
            disabled={isLoading}
          >
            {inviteId ? 'Atualizar' : 'Criar'}
          </Button>
        </FloatingButtonsContainer>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Dialog de confirmação */}
        <ConfirmDialog
          open={confirmDialogOpen}
          title="Cancelar edição"
          message="Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
          onConfirm={handleCancel}
          onCancel={() => setConfirmDialogOpen(false)}
        />
      </Box>
    );
  }

  // Layout para desktop/tablet com containers fixos
  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 12 }}>
      {/* Loading indicator */}
      {isLoading && <LoadingIndicator message={messageLoading} />}

      {/* Título da página */}
      <PageTitle 
        title={inviteId ? 'Editar Convite' : 'Criar Convite'}
        subtitle="Personalize seu convite e visualize em tempo real"
      />

      {/* Layout principal com containers fixos */}
      <Box sx={{ 
        display: 'flex', 
        gap: 4, 
        mt: 3,
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        {/* Formulário com tamanho fixo */}
        <FormContainer elevation={0}>
          <FormContent
            formData={formData}
            setFormData={setFormData}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            handleFontChange={handleFontChange}
            events={events}
          />
        </FormContainer>

        {/* Preview com largura fixa e altura livre */}
        <PreviewContent />
      </Box>

      {/* Botões flutuantes para desktop */}
      <FloatingButtonsContainer>
        <StyledButton
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          size="large"
          disabled={isLoading}
          sx={{
            minWidth: 180,
            boxShadow: theme.shadows[8],
            '&:hover': {
              boxShadow: theme.shadows[12]
            }
          }}
        >
          {inviteId ? 'Atualizar Convite' : 'Criar Convite'}
        </StyledButton>

        <StyledButton
          variant="outlined"
          color="success"
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsAppTest}
          size="large"
          sx={{
            minWidth: 180,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[8]
            }
          }}
        >
          Testar no WhatsApp
        </StyledButton>

        <Button
          variant="outlined"
          onClick={handleCancelConfirm}
          size="large"
          sx={{
            minWidth: 180,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Cancelar
        </Button>
      </FloatingButtonsContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog de confirmação */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Cancelar edição"
        message="Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
        onConfirm={handleCancel}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </Container>
  );
};

export default InviteCreate;

