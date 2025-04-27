import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Save as SaveIcon,
  Image as ImageIcon,
  TextFields as TextFieldsIcon,
  Preview as PreviewIcon,
  WhatsApp as WhatsAppIcon,
  FormatColorFill as FormatColorFillIcon,
  FormatColorText as FormatColorTextIcon,
  Palette as PaletteIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { createInvite, updateInvite, fetchInvite } from '../../store/actions/inviteActions';

// Componentes personalizados
import { LoadingIndicator } from '../../components/LoadingIndicator';
import ColorPicker from './components/ColorPicker';
import { StyledTabs, TabPanel } from '../../components/StyledTabs';
import StyledButton from '../../components/StyledButton';
import StyledTextField from '../../components/StyledTextField';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageTitle from '../../components/PageTitle';
import ImageUploadFieldBase64 from '../../components/ImageUploadField';

const InviteCreate = () => {
  const { eventId, inviteId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentInvite, loading, error } = useSelector(state => state.invites);
  const { currentEvent } = useSelector(state => state.events);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateId: 'template1',
    bgColor: '#5e35b1',
    textColor: '#000000',
    fontFamily: 'Roboto',
    imageUrl: '',
    customText: ''
  });

  const [messageLoading, setMessageLoading] = useState('Carregando dados...');
  const [isLoading, setIsLoading] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Carregar dados do convite se estiver editando
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];
        if (inviteId) {
          promises.push(dispatch(fetchInvite(inviteId)));
        }
        await Promise.all(promises);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    
  }, [dispatch, inviteId]);
  
  // Preencher formulário com dados do convite se estiver editando
  useEffect(() => {
    if (inviteId && currentInvite) {
      setFormData({
        title: currentInvite.title || '',
        description: currentInvite.description || '',
        templateId: currentInvite.templateId || 'template1',
        bgColor: currentInvite.bgColor || '#5e35b1',
        textColor: currentInvite.textColor || '#f5f5f5',
        fontFamily: currentInvite.fontFamily || 'Roboto',
        imageUrl: currentInvite.imageUrl || '',
        customText: currentInvite.customText || ''
      });
    }
  }, [inviteId, currentInvite]);
  
    // Preparar dados para envio
    const prepareFormData = () => {

      // Preparar dados da imagem
      let imageData = null;
      
      if (formData.imageUrl.type === 'url' && formData.imageUrl.url) {
        imageData = formData.imageUrl.url;
      } else if (formData.imageUrl.type === 'file' && formData.imageUrl.base64) {
        imageData = formData.imageUrl.base64;
      }
      
      return {
        ...formData,
        // Substituir objetos complexos por strings
        imageUrl: imageData,
        eventId: eventId
      };
    };
  
  // Exibir erro se houver
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipular mudança na imagem
  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData
    }));
  }

  // Manipular mudança direta em um campo específico
  const handleFieldChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Mudar aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Salvar convite
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const inviteData = prepareFormData();

      if (inviteId) {
        await dispatch(updateInvite({ id: inviteId, inviteData })).unwrap();
        setSnackbarMessage('Convite atualizado com sucesso!');
      } else {
        await dispatch(createInvite(inviteData)).unwrap();
        setSnackbarMessage('Convite criado com sucesso!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      navigate(`/events/${eventId}`);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao salvar convite');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Confirmar cancelamento
  const handleCancelConfirm = () => {
    setConfirmDialogOpen(true);
  };
  
  // Cancelar criação/edição
  const handleCancel = () => {
    navigate(`/events/${eventId}`);
  };
  
  // Templates disponíveis
  const templates = [
    { id: 'template1', name: 'Elegante', description: 'Design minimalista e elegante' },
    { id: 'template2', name: 'Festivo', description: 'Design colorido e festivo' },
    { id: 'template3', name: 'Corporativo', description: 'Design profissional para eventos corporativos' },
    { id: 'template4', name: 'Casamento', description: 'Design romântico para casamentos' },
    { id: 'template5', name: 'Aniversário', description: 'Design divertido para aniversários' }
  ];
  
  // Fontes disponíveis
  const fonts = [
    { id: 'Roboto', name: 'Roboto' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Playfair Display', name: 'Playfair Display' },
    { id: 'Dancing Script', name: 'Dancing Script' },
    { id: 'Oswald', name: 'Oswald' }
  ];
  
  // Configuração das abas
  const tabsConfig = [
    { label: 'Conteúdo', icon: <TextFieldsIcon />, iconPosition: 'start' },
    { label: 'Aparência', icon: <PaletteIcon />, iconPosition: 'start' }
  ];
  
  // Renderizar tela de carregamento
  if (loading && inviteId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh'
      }}>
        <LoadingIndicator />
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh',
      pb: 4
    }}>
      <Container maxWidth="lg">
        {/* Título da página e botão voltar */}
        <Box sx={{ mb: 4 }}>
          <PageTitle 
            title={inviteId ? 'Editar Convite' : 'Criar Novo Convite'}
            subtitle="Personalize seu convite com cores, fontes e imagens"
            backButton={{
              label: 'Voltar para o Evento',
              onClick: () => navigate(`/events/${eventId}`)
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: 3, 
          mb: 4
        }}>
          {/* Coluna de edição */}
          <Paper 
            elevation={0} 
            sx={{ 
              flex: '1 1 65%',
              borderRadius: 1,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              tabs={tabsConfig}
              variant="fullWidth"
            />
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <StyledTextField
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    label="Título do Convite"
                    placeholder="Digite o título do convite"
                    required
                    startIcon={<TitleIcon />}
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <StyledTextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    label="Descrição"
                    placeholder="Digite uma descrição breve"
                    startIcon={<DescriptionIcon />}
                    fullWidth
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <StyledTextField
                  name="customText"
                  value={formData.customText}
                  onChange={handleChange}
                  label="Mensagem Personalizada"
                  placeholder="Digite a mensagem que será exibida no convite"
                  multiline
                  rows={4}
                  startIcon={<MessageIcon />}
                  helperText="Esta mensagem será exibida no convite e enviada via WhatsApp"
                  fullWidth
                />
              </Box>
              

                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <ImageUploadFieldBase64
                    value={formData.imageUrl}
                    onChange={handleImageChange}
                    helperText={"Insira uma url ou faça upload de uma imagem"}
                    required
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="template-label">Template</InputLabel>
                    <Select
                      labelId="template-label"
                      id="templateId"
                      name="templateId"
                      value={formData.templateId}
                      onChange={handleChange}
                      label="Template"
                    >
                      {templates.map(template => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 6, mt: 6 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="font-label">Fonte</InputLabel>
                  <Select
                    labelId="font-label"
                    id="fontFamily"
                    name="fontFamily"
                    value={formData.fontFamily}
                    onChange={handleChange}
                    label="Fonte"
                  >
                    {fonts.map(font => (
                      <MenuItem key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                        {font.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <ColorPicker
                    value={formData.bgColor}
                    onChange={handleFieldChange('bgColor')}
                    label="Cor Principal"
                    icon={<FormatColorFillIcon />}
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <ColorPicker
                    value={formData.textColor}
                    onChange={handleFieldChange('textColor')}
                    label="Cor do Texto"
                    icon={<FormatColorTextIcon />}
                  />
                </Box>
              </Box>
            </TabPanel>
          </Paper>
          
          {/* Coluna de visualização */}
          <Paper 
            elevation={0} 
            sx={{ 
              flex: '1 1 35%',
              borderRadius: 1,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.default
            }}>
              <PreviewIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="subtitle1" fontWeight="500">
                Pré-visualização
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                bgcolor: theme.palette.background.default
              }}
            >
              <Box 
                sx={{ 
                  maxWidth: 320,
                  width: '100%',
                  mx: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  fontFamily: formData.fontFamily,
                  bgcolor: theme.palette.background.paper
                }}
              >
                {formData.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={formData.imageUrl && formData.imageUrl.type === 'url' ? formData.imageUrl.url : formData.imageUrl.base64}
                    alt={formData.title}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 180, 
                      bgcolor: formData.bgColor,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                  </Box>
                )}
                
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    gutterBottom
                    sx={{ 
                      color: formData.bgColor,
                      fontFamily: 'inherit',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {formData.title || 'Título do Convite'}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1.5,
                      fontFamily: 'inherit',
                      textAlign: 'center',
                      color: formData.textColor
                    }}
                  >
                    {currentEvent?.title || 'Nome do Evento'}
                  </Typography>
                  
                  {formData.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1.5,
                        fontFamily: 'inherit',
                        color: formData.textColor
                      }}
                    >
                      {formData.description}
                    </Typography>
                  )}
                  
                  <Divider sx={{ mb: 1.5 }} />
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1.5,
                      fontFamily: 'inherit',
                      color: formData.textColor
                    }}
                  >
                    {formData.customText || 'Mensagem personalizada do convite...'}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontFamily: 'inherit',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      display: 'block'
                    }}
                  >
                    Confirme sua presença respondendo este convite.
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
              <StyledButton
                variant="outlined"
                color="success"
                startIcon={<WhatsAppIcon />}
                sx={{ 
                  color: '#25D366',
                  borderColor: '#25D366',
                  '&:hover': {
                    borderColor: '#25D366',
                    backgroundColor: 'rgba(37, 211, 102, 0.1)'
                  }
                }}
              >
                Testar no WhatsApp
              </StyledButton>
            </Box>
          </Paper>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'flex-end',
            mb: 4
          }}
        >
          <StyledButton
            variant="outlined"
            color="inherit"
            onClick={handleCancelConfirm}
          >
            Cancelar
          </StyledButton>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!formData.title}
          >
            {inviteId ? 'Atualizar Convite' : 'Criar Convite'}
          </StyledButton>
        </Box>
      </Container>

      <LoadingIndicator 
        open={isLoading} 
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
