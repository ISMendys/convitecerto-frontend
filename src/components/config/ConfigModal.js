import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Switch,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Tooltip,
  Alert,
  useMediaQuery,
  Slide,
  AppBar,
  Toolbar,
  Fab,
  Collapse,
  Card,
  CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  RestoreOutlined as RestoreIcon,
  InfoOutlined as InfoOutlinedIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { 
  setTheme, 
  setThemeStyle,
  setInterfaceDensity, 
  setFontSize, 
  setNotifications, 
  setEmailNotifications,
  setLanguage,
  setDateFormat,
  setTimeFormat,
  resetConfig
} from '../../store/slices/configSlice';
import { updateUserConfig } from '../../store/actions/configActions';
import NotificationSettings from '../notifications/NotificationSettings';

// Transição para mobile
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Componente TabPanel para as abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

// Propriedades para as abas
function a11yProps(index) {
  return {
    id: `config-tab-${index}`,
    'aria-controls': `config-tabpanel-${index}`,
  };
}

const ConfigModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const [tabValue, setTabValue] = useState(0);
  const [localConfig, setLocalConfig] = useState({...config});
  const [saveStatus, setSaveStatus] = useState({ success: false, error: null });
  const [loading, setLoading] = useState(false);
  
  // Estados para seções colapsáveis em mobile
  const [expandedSections, setExpandedSections] = useState({
    themeStyle: true,
    themeMode: !isMobile,
    language: !isMobile
  });

  // Atualizar o estado local quando as configurações globais mudarem
  useEffect(() => {
    setLocalConfig({...config});
  }, [config]);

  // Lidar com a mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Lidar com mudanças nos campos
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setLocalConfig({
      ...localConfig,
      [field]: value
    });
  };

  // Lidar com mudança no slider
  const handleSliderChange = (field) => (event, newValue) => {
    setLocalConfig({
      ...localConfig,
      [field]: newValue
    });
  };

  // Manipular expansão de seções
  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Salvar configurações
  const handleSave = async () => {
    try {
      setLoading(true);
      // Atualizar configurações no Redux
      dispatch(setTheme(localConfig.theme));
      dispatch(setThemeStyle(localConfig.themeStyle));
      dispatch(setInterfaceDensity(localConfig.interfaceDensity));
      dispatch(setFontSize(localConfig.fontSize));
      dispatch(setNotifications(localConfig.notifications));
      dispatch(setEmailNotifications(localConfig.emailNotifications));
      dispatch(setLanguage(localConfig.language));
      dispatch(setDateFormat(localConfig.dateFormat));
      dispatch(setTimeFormat(localConfig.timeFormat));
      
      // Enviar para o backend
      await dispatch(updateUserConfig(localConfig)).unwrap();
      
      // Mostrar mensagem de sucesso
      setSaveStatus({ success: true, error: null });
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSaveStatus({ success: false, error: null });
      }, 3000);
    } catch (error) {
      setSaveStatus({ success: false, error: error.message || 'Erro ao salvar configurações' });
    } finally {
      setLoading(false);
    }
  };

  // Restaurar configurações padrão
  const handleReset = () => {
    dispatch(resetConfig());
    setLocalConfig({
      theme: 'light',
      themeStyle: 'purple',
      notifications: true,
      emailNotifications: true,
      interfaceDensity: 'default',
      fontSize: 16,
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
    });
  };

  // Componente de seção colapsável para mobile
  const CollapsibleSection = ({ title, icon, children, sectionKey, defaultExpanded = false }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <Card 
        sx={{ 
          mb: 2,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        {isMobile ? (
          <>
            <Box
              onClick={() => handleSectionToggle(sectionKey)}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderBottom: isExpanded ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {icon}
                <Typography variant="subtitle1" fontWeight={600}>
                  {title}
                </Typography>
              </Box>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={isExpanded}>
              <CardContent sx={{ pt: 2 }}>
                {children}
              </CardContent>
            </Collapse>
          </>
        ) : (
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              {icon}
              <Typography variant="subtitle1" fontWeight={600}>
                {title}
              </Typography>
            </Box>
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  // Ícones para as abas
  const tabIcons = [
    <PaletteIcon />,
    <NotificationsIcon />,
    <SecurityIcon />,
    <SettingsIcon />
  ];

  const tabLabels = ['Geral', 'Notificações', 'Privacidade', 'Avançado'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth={!isMobile}
      maxWidth={isMobile ? false : "sm"}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        elevation: isMobile ? 0 : 5,
        sx: {
          borderRadius: isMobile ? 0 : 2,
          overflow: 'hidden',
          height: isMobile ? '100vh' : '700px',
          bgcolor: isMobile ? theme.palette.background.default : theme.palette.background.paper
        }
      }}
    >
      {/* Header mobile */}
      {isMobile ? (
        <AppBar 
          position="sticky" 
          sx={{ 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={onClose}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Configurações
            </Typography>
            <Tooltip title="Restaurar padrões">
              <IconButton onClick={handleReset} size="small">
                <RestoreIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      ) : (
        /* Header desktop */
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 1
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Configurações
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Restaurar padrões">
              <IconButton onClick={handleReset} size="small">
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      
      {/* Navegação por abas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "fullWidth" : "scrollable"}
          scrollButtons="auto"
          sx={{
            px: isMobile ? 0 : 2,
            '& .MuiTab-root': {
              minWidth: isMobile ? 'auto' : 'auto',
              px: isMobile ? 1 : 2,
              py: 1.5,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              minHeight: isMobile ? 48 : 'auto'
            }
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab 
              key={index}
              label={isMobile ? '' : label}
              icon={tabIcons[index]}
              iconPosition={isMobile ? "top" : "start"}
              {...a11yProps(index)}
              sx={{
                '& .MuiTab-iconWrapper': {
                  mb: isMobile ? 0.5 : 0,
                  mr: isMobile ? 0 : 1
                }
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      <DialogContent 
        sx={{ 
          pt: 2,
          px: isMobile ? 2 : 3,
          pb: isMobile ? 10 : 2, // Espaço para FAB em mobile
          height: isMobile ? 'calc(100vh - 120px)' : 'auto',
          overflow: 'auto'
        }}
      >
        {/* Aba Geral */}
        <TabPanel value={tabValue} index={0}>
          <CollapsibleSection
            title="Estilo do Tema"
            icon={<PaletteIcon color="primary" />}
            sectionKey="themeStyle"
            defaultExpanded={true}
          >
            <FormControl component="fieldset" fullWidth>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Escolha o estilo visual</FormLabel>
                <Tooltip title="Escolha o estilo visual da interface">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                name="themeStyle"
                value={localConfig.themeStyle}
                onChange={handleChange('themeStyle')}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    mb: 1,
                    '& .MuiRadio-root': {
                      p: 1.5
                    }
                  }
                }}
              >
                <FormControlLabel 
                  value="purple" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>Roxo (Customizado)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tema personalizado com cores vibrantes
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="blue" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>Azul (Material-UI)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tema padrão do Material Design
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </CollapsibleSection>
          
          <CollapsibleSection
            title="Modo do Tema"
            icon={<SettingsIcon color="primary" />}
            sectionKey="themeMode"
          >
            <FormControl component="fieldset" fullWidth>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Aparência da interface</FormLabel>
                <Tooltip title="Escolha entre claro, escuro ou seguir o sistema">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                name="theme"
                value={localConfig.theme}
                onChange={handleChange('theme')}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    mb: 1,
                    '& .MuiRadio-root': {
                      p: 1.5
                    }
                  }
                }}
              >
                <FormControlLabel value="light" control={<Radio />} label="Claro" />
                <FormControlLabel value="dark" control={<Radio />} label="Escuro" />
                <FormControlLabel value="system" control={<Radio />} label="Sistema" />
              </RadioGroup>
            </FormControl>
          </CollapsibleSection>
          
          <CollapsibleSection
            title="Idioma e Formato"
            icon={<SettingsIcon color="primary" />}
            sectionKey="language"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormLabel component="legend" sx={{ fontWeight: 500 }}>Idioma</FormLabel>
                  <Tooltip title="Selecione o idioma da interface">
                    <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Select
                  value={localConfig.language}
                  onChange={handleChange('language')}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="es-ES">Español</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Formato de Data</InputLabel>
                <Select
                  value={localConfig.dateFormat}
                  label="Formato de Data"
                  onChange={handleChange('dateFormat')}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Formato de Hora</InputLabel>
                <Select
                  value={localConfig.timeFormat}
                  label="Formato de Hora"
                  onChange={handleChange('timeFormat')}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="12h">12 horas (AM/PM)</MenuItem>
                  <MenuItem value="24h">24 horas</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CollapsibleSection>
        </TabPanel>
        
        {/* Aba Notificações */}
        <TabPanel value={tabValue} index={1}>
          <NotificationSettings />
        </TabPanel>
        
        {/* Aba Privacidade */}
        <TabPanel value={tabValue} index={2}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <SecurityIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Configurações de Privacidade
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta seção será implementada em breve com controles avançados de privacidade.
            </Typography>
          </Card>
        </TabPanel>
        
        {/* Aba Avançado */}
        <TabPanel value={tabValue} index={3}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <SettingsIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Configurações Avançadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configurações avançadas do sistema serão implementadas em breve.
            </Typography>
          </Card>
        </TabPanel>
        
        {/* Mensagens de status */}
        {saveStatus.success && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 80 : 'auto',
              left: isMobile ? 16 : 'auto',
              right: isMobile ? 16 : 'auto',
              zIndex: isMobile ? 1300 : 'auto'
            }}
          >
            Configurações salvas com sucesso!
          </Alert>
        )}
        
        {saveStatus.error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 80 : 'auto',
              left: isMobile ? 16 : 'auto',
              right: isMobile ? 16 : 'auto',
              zIndex: isMobile ? 1300 : 'auto'
            }}
          >
            {saveStatus.error}
          </Alert>
        )}
      </DialogContent>
      
      {/* Botões desktop */}
      {!isMobile && (
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      )}

      {/* FAB para salvar em mobile */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={handleSave}
          disabled={loading}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
        </Fab>
      )}
    </Dialog>
  );
};

export default ConfigModal;
