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
  Toolbar
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

  // Altura fixa para o conteúdo das abas - reduzida para ficar mais compacta
  const tabContentHeight = isMobile ? 'auto' : 600;

  // Calcular escala para o dispositivo atual
  const calculateScale = () => {
    // Largura disponível para o preview (estimativa)
    const availableWidth = isMobile ? 280 : 500;

    // Calcular escala baseada na largura do dispositivo
    return Math.min(1, availableWidth / deviceSizes[deviceType].width);
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
        alignItems: 'center'
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

      {/* Conteúdo das abas com altura fixa */}
      <Box sx={{
        height: tabContentHeight,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Aba de Informações */}
        <Box
          sx={{
            p: 3,
            overflow: 'auto',
            display: tabValue === 0 ? 'block' : 'none'
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
            rows={isMobile ? 3 : 4}
            helperText="Mensagem que será exibida no convite"
          />
        </Box>

        {/* Aba de Personalização */}
        <Box
          sx={{
            p: 3,
            overflow: 'auto',
            display: tabValue === 1 ? 'block' : 'none'
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 2
            }}
          >
            Cores
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ColorPicker
                label="Cor de Fundo"
                color={formData.bgColor}
                onChange={(color) => handleColorChange(color, 'bgColor')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ColorPicker
                label="Cor de Destaque"
                color={formData.accentColor}
                onChange={(color) => handleColorChange(color, 'accentColor')}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 2,
              mt: 3
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
            mt: 2,
            p: 2,
            borderRadius: 1,
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
        p: isMobile ? 2 : 3,
        width: isMobile ? '100%' : 750,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? 'auto' : tabContentHeight + 48
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexShrink: 0,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: isMobile ? 'none' : 'block'
          }}
        >
          Pré-visualização do Convite
        </Typography>

        {/* Seletor de dispositivos dentro da aba de pré-visualização */}
        <ButtonGroup
          variant="outlined"
          size="small"
          aria-label="device selection"
          sx={{
            '& .MuiButton-root': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              padding: isMobile ? '4px 8px' : '6px 16px'
            }
          }}
        >
          {Object.keys(deviceSizes).map((type) => (
            <Button
              key={type}
              variant={deviceType === type ? "contained" : "outlined"}
              startIcon={isMobile ? null : deviceSizes[type].icon}
              onClick={() => handleDeviceChange(type)}
              sx={{
                textTransform: 'capitalize',
                backgroundColor: deviceType === type ? theme.palette.primary.main : 'transparent',
                color: deviceType === type ? '#fff' : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: deviceType === type
                    ? alpha(theme.palette.primary.main, 0.9)
                    : alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              {type}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Preview com diferenciação clara entre dispositivos */}
      <Box sx={{
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
        height: isMobile ? '400px' : tabContentHeight - 10
      }}>
        {/* Container do dispositivo com moldura */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          pt: 1
        }}>
          <Box sx={{
            width: isMobile ? '100%' : `${deviceSizes[deviceType].width}px`,
            height: isMobile ? '100%' : `${deviceSizes[deviceType].height}px`,
            transform: isMobile ? 'none' : `scale(${calculateScale()})`,
            transformOrigin: 'top center',
            border: isMobile ? 'none' : `12px solid ${alpha('#000', 0.8)}`,
            borderRadius: isMobile ? '8px' : (deviceType === 'mobile' ? '20px' : '8px'),
            boxShadow: isMobile ? 'none' : `0 10px 30px ${alpha('#000', 0.2)}`,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: deviceType === 'mobile' ? '60px' : '100px',
              height: '12px',
              backgroundColor: alpha('#000', 0.9),
              borderRadius: '8px 8px 0 0',
              display: (deviceType !== 'mobile' && !isMobile) ? 'block' : 'none'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: deviceType === 'mobile' ? '40px' : '0',
              height: '8px',
              backgroundColor: alpha('#000', 0.9),
              borderRadius: '0 0 10px 10px',
              display: (deviceType === 'mobile' && !isMobile) ? 'block' : 'none'
            }
          }}>
            <Box sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              backgroundColor: '#fff'
            }}>
              <InvitePreview
                title={formData.title}
                eventTitle={currentEvent?.title}
                customText={formData.customText}
                bgColor={formData.bgColor}
                accentColor={formData.accentColor}
                fontFamily={formData.fontFamily}
                showActions={false}
                onWhatsAppTest={handleWhatsAppTest}
                deviceViewMode={deviceType}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ py: isMobile ? 1 : 3, height: '100%' }}>
      {/* AppBar para mobile */}
      {isMobile && (
        <AppBar
          position="sticky"
          elevation={1}
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {inviteId ? 'Editar Convite' : 'Criar Convite'}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="preview"
              onClick={() => setPreviewDrawerOpen(true)}
            >
              <VisibilityIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 3 }}>
        {!isMobile && (
          <PageTitle
            title={inviteId ? 'Editar Convite' : 'Criar Novo Convite'}
            subtitle={'Crie convites, personalize do seu jeito.'}
            alignRight={false}
            mb={2}
          />
        )}

        {/* Layout Desktop/Tablet */}
        {!isMobile && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3}}>
            {/* Lado esquerdo - Formulário com abas */}
            <Box>
              <FormContent />
            </Box>

            {/* Lado direito - Preview sempre visível */}
            <Box>
              <PreviewContent />
            </Box>
          </Box>
        )}

        {/* Layout Mobile - O conteúdo do formulário agora será exibido em um Drawer */}
        {isMobile && (
          <Box sx={{ p: 2, display: 'none' }}>
            {/* O FormContent não é mais renderizado diretamente aqui, mas sim no Drawer */}
          </Box>
        )}

        {/* Botões de ação */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: isMobile ? 'center' : 'end',
            mt: 3,
            px: isMobile ? 2 : 0,
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <StyledButton
            variant="outlined"
            color="inherit"
            onClick={handleCancelConfirm}
            fullWidth={isMobile}
          >
            Cancelar
          </StyledButton>

          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!formData.title || !formData.eventId || isLoading || inviteLoading}
            fullWidth={isMobile}
          >
            {inviteId ? 'Atualizar Convite' : 'Criar Convite'}
          </StyledButton>
        </Box>
      </Container>

      {/* Drawer para formulário mobile */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '90%',
            maxWidth: 400,
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6">
            Configurações
          </Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <FormContent />
        </Box>
      </Drawer>

      {/* Drawer para preview mobile */}
      <Drawer
        anchor="right"
        open={previewDrawerOpen}
        onClose={() => setPreviewDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '95%',
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6">
            Pré-visualização
          </Typography>
          <IconButton onClick={() => setPreviewDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <PreviewContent />
        </Box>
      </Drawer>

      <LoadingIndicator
        open={isLoading || inviteLoading}
        type="overlay"
        message={messageLoading}
      />

      {/* Diálogo de confirmação para cancelamento */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleCancel}
        title={`Cancelar ${inviteId ? 'Edição' : 'Criação'}`}
        message="Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
        cancelText="Voltar"
        confirmText={`Cancelar ${inviteId ? 'Edição' : 'Criação'}`}
        confirmColor="error"
      />

      {/* Snackbar para feedback */}
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

export default InviteCreate;

