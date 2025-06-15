// Arquivo InviteCreate.js com responsividade para mobile e correções de layout
import React, { useState, useEffect } from 'react';
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

// Componente FontPicker otimizado
const OptimizedFontPicker = ({ value, onChange }) => {
  const theme = useTheme();

  // Lista de fontes disponíveis
  const fonts = [
    { id: 'Roboto, sans-serif', name: 'Roboto' },
    { id: 'Montserrat, sans-serif', name: 'Montserrat' },
    { id: 'Open Sans, sans-serif', name: 'Open Sans' },
    { id: 'Lato, sans-serif', name: 'Lato' },
    { id: 'Poppins, sans-serif', name: 'Poppins' },
    { id: 'Playfair Display, serif', name: 'Playfair Display' },
    { id: 'Merriweather, serif', name: 'Merriweather' },
    { id: 'Raleway, sans-serif', name: 'Raleway' },
    { id: 'Ubuntu, sans-serif', name: 'Ubuntu' },
    { id: 'Dancing Script, cursive', name: 'Dancing Script' }
  ];

  const handleFontChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="font-select-label">Fonte</InputLabel>
      <Select
        labelId="font-select-label"
        value={value || fonts[0].id}
        onChange={handleFontChange}
        label="Fonte"
        inputProps={{ style: { fontFamily: value } }}
        sx={{
          '& .MuiSelect-select': {
            fontFamily: value
          }
        }}
      >
        {fonts.map((font) => (
          <MenuItem
            key={font.id}
            value={font.id}
            sx={{
              fontFamily: font.id
            }}
          >
            {font.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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
        fontFamily: currentInvite.fontFamily || 'Roboto, sans-serif'
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

  const handleColorChange = (color, type) => {
    setFormData(prev => ({ ...prev, [type]: color }));
  };

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

  // Componente do formulário
  const FormContent = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isMobile ? 0 : 2,
        border: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        height: '100%',
        width: isMobile ? '100%' : 400,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Abas com altura fixa */}
      <Box sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ width: '100%' }}
        >
          <Tab
            icon={<InfoIcon />}
            label="Informações"
            iconPosition="start"
          />
          <Tab
            icon={<ColorLensIcon />}
            label="Personalização"
            iconPosition="start"
          />
        </StyledTabs>
      </Box>

      {/* Conteúdo das abas com scroll */}
      <Box sx={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Aba de Informações */}
        <Box
          sx={{
            p: 3,
            height: '100%',
            overflow: 'auto',
            display: tabValue === 0 ? 'block' : 'none',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <TextField
            fullWidth
            label="Título do Convite"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Ex: Aniversário de 30 anos"
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Evento</InputLabel>
            <Select
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              label="Evento"
            >
              <MenuItem value="">Selecione ou crie um novo evento</MenuItem>
              {events.map(event => (
                <MenuItem key={event.id} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descrição (opcional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            helperText="Uma breve descrição do convite"
          />

          <TextField
            fullWidth
            label="Mensagem Personalizada"
            name="customText"
            value={formData.customText}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            helperText="Mensagem que será exibida no convite"
          />

          {/* Espaço extra para garantir scroll */}
          <Box sx={{ height: 100 }} />
        </Box>

        {/* Aba de Personalização */}
        <Box
          sx={{
            p: 3,
            height: '100%',
            overflow: 'auto',
            display: tabValue === 1 ? 'block' : 'none',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 3
            }}
          >
            Cores
          </Typography>

          <Box sx={{ mb: 4 }}>
            <ColorPicker
              label="Cor de Fundo"
              color={formData.bgColor}
              onChange={(color) => handleColorChange(color, 'bgColor')}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <ColorPicker
              label="Cor de Destaque"
              color={formData.accentColor}
              onChange={(color) => handleColorChange(color, 'accentColor')}
            />
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 3,
              mt: 4
            }}
          >
            Tipografia
          </Typography>

          <OptimizedFontPicker
            value={formData.fontFamily}
            onChange={handleFontChange}
          />

          {/* Amostra da fonte selecionada */}
          <Box sx={{
            mt: 3,
            p: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            fontFamily: formData.fontFamily,
            textAlign: 'center'
          }}>
            <Typography variant="body1" sx={{
              fontWeight: 500
            }}>
              Amostra da fonte: Aa Bb Cc 123
            </Typography>
          </Box>

          {/* Espaço extra para garantir scroll */}
          <Box sx={{ height: 100 }} />
        </Box>
      </Box>
    </Paper>
  );

  // Componente do preview
  const PreviewContent = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isMobile ? 0 : 2,
        border: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
        p: isMobile ? 0 : 3,
        width: isMobile ? '100%' : 'auto',
        height: isMobile ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header do preview - REMOVIDO NO MOBILE */}
      {!isMobile && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Visualização
          </Typography>
          
          <ButtonGroup size="small" variant="outlined">
            {Object.entries(deviceSizes).map(([key, device]) => (
              <Button
                key={key}
                onClick={() => handleDeviceChange(key)}
                variant={deviceType === key ? 'contained' : 'outlined'}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5
                }}
              >
                {device.icon}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      )}

      {/* Preview do convite */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: isMobile ? 'flex-start' : 'center',
        overflow: 'auto',
        height: isMobile ? '100%' : 'auto'
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
    </Paper>
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
            {/* Header do preview fullscreen - REMOVIDO */}
            
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
              
              <PreviewContent />
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
              <FormContent />
            </Box>

            {/* Botões de ação fixos */}
            <Box sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              gap: 2,
              flexShrink: 0
            }}>
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
            </Box>
          </>
        )}

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

  // Layout para desktop/tablet
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Loading indicator */}
      {isLoading && <LoadingIndicator message={messageLoading} />}

      {/* Título da página */}
      <PageTitle 
        title={inviteId ? 'Editar Convite' : 'Criar Convite'}
        subtitle="Personalize seu convite e visualize em tempo real"
      />

      {/* Layout principal */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Formulário */}
        <Grid item xs={12} md={5}>
          <FormContent />
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={7}>
          <PreviewContent />
        </Grid>
      </Grid>

      {/* Botões de ação */}
      <Box sx={{
        mt: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          variant="outlined"
          onClick={handleCancelConfirm}
          size="large"
        >
          Cancelar
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <StyledButton
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppTest}
            size="large"
          >
            Testar no WhatsApp
          </StyledButton>

          <StyledButton
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            size="large"
            disabled={isLoading}
          >
            {inviteId ? 'Atualizar Convite' : 'Criar Convite'}
          </StyledButton>
        </Box>
      </Box>

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

