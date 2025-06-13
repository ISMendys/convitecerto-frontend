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
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/RestoreOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const [tabValue, setTabValue] = useState(0);
  const [localConfig, setLocalConfig] = useState({...config});
  const [saveStatus, setSaveStatus] = useState({ success: false, error: null });
  const [loading, setLoading] = useState(false);

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

  return (
  <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          height: '700px' // <-- Defina uma altura fixa aqui (ajuste o valor conforme necessário)
        }
      }}
    >
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
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2,
              py: 1.5,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem'
            }
          }}
        >
          <Tab label="Geral" {...a11yProps(0)} />
          <Tab label="Notificações" {...a11yProps(1)} />
          <Tab label="Privacidade" {...a11yProps(2)} />
          <Tab label="Avançado" {...a11yProps(3)} />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ pt: 2 }}>
        {/* Aba Geral */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Estilo do Tema</FormLabel>
                <Tooltip title="Escolha o estilo visual da interface">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                row
                name="themeStyle"
                value={localConfig.themeStyle}
                onChange={handleChange('themeStyle')}
              >
                <FormControlLabel value="purple" control={<Radio />} label="Roxo (Customizado)" />
                <FormControlLabel value="blue" control={<Radio />} label="Azul (Material-UI)" />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Modo do Tema</FormLabel>
                <Tooltip title="Escolha entre claro, escuro ou seguir o sistema">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                row
                name="theme"
                value={localConfig.theme}
                onChange={handleChange('theme')}
              >
                <FormControlLabel value="light" control={<Radio />} label="Claro" />
                <FormControlLabel value="dark" control={<Radio />} label="Escuro" />
                <FormControlLabel value="system" control={<Radio />} label="Sistema" />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Densidade da Interface</FormLabel>
                <Tooltip title="Ajuste o espaçamento entre os elementos da interface">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                row
                name="interfaceDensity"
                value={localConfig.interfaceDensity}
                onChange={handleChange('interfaceDensity')}
              >
                <FormControlLabel value="compact" control={<Radio />} label="Compacta" />
                <FormControlLabel value="default" control={<Radio />} label="Padrão" />
                <FormControlLabel value="comfortable" control={<Radio />} label="Confortável" />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" fontWeight={500}>Tamanho da Fonte</Typography>
              <Tooltip title="Ajuste o tamanho da fonte em toda a aplicação">
                <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ px: 1 }}>
              <Slider
                value={localConfig.fontSize}
                onChange={handleSliderChange('fontSize')}
                min={12}
                max={20}
                step={1}
                marks={[
                  { value: 12, label: 'A' },
                  { value: 16, label: 'A' },
                  { value: 20, label: 'A' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box> */}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormLabel component="legend" sx={{ fontWeight: 500 }}>Idioma</FormLabel>
                <Tooltip title="Selecione o idioma da interface">
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={localConfig.language}
                label="Idioma"
                onChange={handleChange('language')}
              >
                <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                <MenuItem value="en-US">English (US)</MenuItem>
                <MenuItem value="es-ES">Español</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="date-format-select-label">Formato de Data</InputLabel>
              <Select
                labelId="date-format-select-label"
                id="date-format-select"
                value={localConfig.dateFormat}
                label="Formato de Data"
                onChange={handleChange('dateFormat')}
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="time-format-select-label">Formato de Hora</InputLabel>
              <Select
                labelId="time-format-select-label"
                id="time-format-select"
                value={localConfig.timeFormat}
                label="Formato de Hora"
                onChange={handleChange('timeFormat')}
              >
                <MenuItem value="12h">12 horas (AM/PM)</MenuItem>
                <MenuItem value="24h">24 horas</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TabPanel>
        
        {/* Aba Notificações */}
        <TabPanel value={tabValue} index={1}>
          <NotificationSettings />
        </TabPanel>
        
        {/* Aba Privacidade */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Configurações de privacidade serão implementadas em breve.
          </Typography>
        </TabPanel>
        
        {/* Aba Avançado */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1">
            Configurações avançadas serão implementadas em breve.
          </Typography>
        </TabPanel>
        
        {/* Mensagens de status */}
        {saveStatus.success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Configurações salvas com sucesso!
          </Alert>
        )}
        
        {saveStatus.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {saveStatus.error}
          </Alert>
        )}
      </DialogContent>
      
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
    </Dialog>
  );
};

export default ConfigModal;

