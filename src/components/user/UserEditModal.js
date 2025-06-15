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
  TextField,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  useMediaQuery,
  Slide,
  AppBar,
  Toolbar,
  Fab,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  changeUserPassword 
} from '../../store/actions/userActions';
import { clearUserError } from '../../store/slices/userSlice';

// Transição para mobile
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserEditModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  
  const { 
    profile, 
    loading, 
    error, 
    updateLoading, 
    updateError, 
    passwordLoading, 
    passwordError 
  } = useSelector((state) => state.user);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' ou 'password'
  const [saveStatus, setSaveStatus] = useState({ success: false, error: null });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Carregar perfil do usuário quando o modal abrir
  useEffect(() => {
    if (open && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [open, profile, dispatch]);

  // Atualizar dados locais quando o perfil for carregado
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.avatar || ''
      });
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  // Limpar erros quando o modal fechar
  useEffect(() => {
    if (!open) {
      dispatch(clearUserError());
      setSaveStatus({ success: false, error: null });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setAvatarPreview(null);
      setUploadingAvatar(false);
    }
  }, [open, dispatch]);

  const handleProfileChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      setSaveStatus({ success: true, error: null });
      onClose()
      setTimeout(() => {
        setSaveStatus({ success: false, error: null });
      }, 3000);
    } catch (error) {
      setSaveStatus({ success: false, error: error });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setSaveStatus({ success: false, error: 'As senhas não coincidem' });
      return;
    }
    
    try {
      await dispatch(changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      })).unwrap();
      
      setSaveStatus({ success: true, error: null });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      setTimeout(() => {
        setSaveStatus({ success: false, error: null });
      }, 3000);
    } catch (error) {
      setSaveStatus({ success: false, error: error });
    }
  };

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleAvatarUpload;
    input.click();
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setSaveStatus({ success: false, error: 'Por favor, selecione apenas arquivos de imagem.' });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({ success: false, error: 'A imagem deve ter no máximo 5MB.' });
      return;
    }

    setUploadingAvatar(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setAvatarPreview(base64String);
        setProfileData(prev => ({
          ...prev,
          avatar: base64String
        }));
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        setSaveStatus({ success: false, error: 'Erro ao processar a imagem.' });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setSaveStatus({ success: false, error: 'Erro ao processar a imagem.' });
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setProfileData(prev => ({
      ...prev,
      avatar: ''
    }));
  };

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
          height: isMobile ? 'auto' : 'auto',
          maxHeight: isMobile ? '120vh' : '120vh',
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
              Meu Perfil
            </Typography>
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
            Meu Perfil
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}
      
      {/* Navegação por abas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', px: isMobile ? 0 : 3 }}>
          <Button
            onClick={() => setActiveTab('profile')}
            sx={{
              flex: 1,
              py: 2,
              borderBottom: activeTab === 'profile' ? 2 : 0,
              borderColor: 'primary.main',
              borderRadius: 0,
              color: activeTab === 'profile' ? 'primary.main' : 'text.secondary',
              fontWeight: activeTab === 'profile' ? 600 : 500
            }}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Perfil
          </Button>
          <Button
            onClick={() => setActiveTab('password')}
            sx={{
              flex: 1,
              py: 2,
              borderBottom: activeTab === 'password' ? 2 : 0,
              borderColor: 'primary.main',
              borderRadius: 0,
              color: activeTab === 'password' ? 'primary.main' : 'text.secondary',
              fontWeight: activeTab === 'password' ? 600 : 500
            }}
          >
            <LockIcon sx={{ mr: 1 }} />
            Senha
          </Button>
        </Box>
      </Box>
      
      <DialogContent 
        sx={{ 
          pt: 3,
          px: isMobile ? 2 : 3,
          pb: isMobile ? 10 : 2, // Espaço para FAB em mobile
          height: isMobile ? 'calc(100vh - 160px)' : 'auto',
          overflow: 'auto'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Aba Perfil */}
            {activeTab === 'profile' && (
              <Box>
                {/* Avatar */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar
                        src={avatarPreview || profileData.avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          mx: 'auto',
                          fontSize: '3rem',
                          fontWeight: 700,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: uploadingAvatar ? 0.7 : 1,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            borderColor: theme.palette.primary.main
                          }
                        }}
                        onClick={handleAvatarClick}
                      >
                        {uploadingAvatar ? (
                          <CircularProgress size={40} color="primary" />
                        ) : (
                          profileData.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </Avatar>
                      
                      {/* Botão de upload */}
                      <Tooltip title="Alterar foto">
                        <Fab
                          size="small"
                          color="primary"
                          onClick={handleAvatarClick}
                          disabled={uploadingAvatar}
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: -8,
                            width: 40,
                            height: 40
                          }}
                        >
                          {uploadingAvatar ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <PhotoCameraIcon fontSize="small" />
                          )}
                        </Fab>
                      </Tooltip>
                      
                      {/* Botão de remover (só aparece se houver imagem) */}
                      {(avatarPreview || profileData.avatar) && (
                        <Tooltip title="Remover foto">
                          <IconButton
                            onClick={handleRemoveAvatar}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: theme.palette.error.main,
                              color: 'white',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                bgcolor: theme.palette.error.dark,
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      Foto do Perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Clique na imagem para alterar sua foto
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Formatos aceitos: JPG, PNG, GIF, WebP (máx. 5MB)
                    </Typography>
                  </CardContent>
                </Card>

                {/* Dados do perfil */}
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <EditIcon sx={{ mr: 1 }} />
                      Informações Pessoais
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={profileData.name}
                        onChange={handleProfileChange('name')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ borderRadius: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange('email')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Aba Senha */}
            {activeTab === 'password' && (
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LockIcon sx={{ mr: 1 }} />
                    Alterar Senha
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Senha Atual"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange('currentPassword')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('current')}
                              edge="end"
                            >
                              {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Divider />
                    
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange('newPassword')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('new')}
                              edge="end"
                            >
                              {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange('confirmNewPassword')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirm')}
                              edge="end"
                            >
                              {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Mensagens de status */}
        {(saveStatus.success || saveStatus.error || updateError || passwordError) && (
          <Alert 
            severity={saveStatus.success ? "success" : "error"}
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
            {saveStatus.success 
              ? (activeTab === 'profile' ? 'Perfil atualizado com sucesso!' : 'Senha alterada com sucesso!')
              : (saveStatus.error || updateError || passwordError)
            }
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
            onClick={activeTab === 'profile' ? handleSaveProfile : handleChangePassword}
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={activeTab === 'profile' ? updateLoading : passwordLoading}
            startIcon={
              (activeTab === 'profile' ? updateLoading : passwordLoading) 
                ? <CircularProgress size={16} color="inherit" /> 
                : null
            }
          >
            {(activeTab === 'profile' ? updateLoading : passwordLoading) 
              ? 'Salvando...' 
              : 'Salvar'
            }
          </Button>
        </DialogActions>
      )}

      {/* FAB para salvar em mobile */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={activeTab === 'profile' ? handleSaveProfile : handleChangePassword}
          disabled={activeTab === 'profile' ? updateLoading : passwordLoading}
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
          {(activeTab === 'profile' ? updateLoading : passwordLoading) 
            ? <CircularProgress size={24} color="inherit" /> 
            : <SaveIcon />
          }
        </Fab>
      )}
    </Dialog>
  );
};

export default UserEditModal;
