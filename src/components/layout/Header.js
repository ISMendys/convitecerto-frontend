import React, { useState, useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  Button,
  useMediaQuery,
  Tooltip,
  Badge,
  Fade,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import { logoutUser } from '../../store/actions/authActions';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ColorModeContext } from '../../theme/ThemeConfig';
import ConfigModal from '../config/ConfigModal';

// Importação do logo (caminho relativo à raiz do projeto)
// Nota: Ajuste o caminho conforme a estrutura do seu projeto
import logoImage from '../../convitecerto.svg';

const Header = ({ onMobileNavOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector(state => state.auth);
  
  const colorMode = useContext(ColorModeContext);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  
  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    setConfigModalOpen(true);
    handleClose();
  };

  const handleHelp = () => {
    navigate('/support');
    handleClose();
  };

  return (
    <>
      <AppBar 
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.98),
          color: 'text.primary',
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          height: 72,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${alpha(theme.palette.primary.main, 0.7)})`
          }
        }}
      >
        <Toolbar 
          sx={{ 
            height: '100%', 
            px: { xs: 2, sm: 3 },
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {/* Seção esquerda: Menu mobile e Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMobileNavOpen}
              sx={{
                mr: 2,
                display: { md: 'none' },
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo e nome da aplicação */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  '& .logo-image': {
                    transform: 'scale(1.05)',
                  },
                  '& .logo-text': {
                    letterSpacing: '0px',
                  }
                }
              }}
            >
              {/* Logo */}
              <Box 
                sx={{ 
                  height: 80,
                  width: 150,
                  backgroundColor: theme.palette.primary.main,
                  maskImage: `url(${logoImage})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  // Estilos anteriores
                  ml: 2.5,
                  mr: 1.5,
                  transition: 'transform 0.3s ease',
                }}
              />
              
              {/* Nome da aplicação */}
              {/* <Typography
                variant="h5"
                color="primary"
                className="logo-text"
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '-0.5px',
                  display: { xs: 'none', sm: 'block' },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                Digital Invites
              </Typography> */}
            </Box>
          </Box>
          
          {/* Seção direita: Tema, Notificações e Perfil */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botão de alternância de tema */}
            <Tooltip title={theme.palette.mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={colorMode.toggleColorMode}
                sx={{
                  borderRadius: '50%',
                  p: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? 
                  <Brightness7Icon sx={{ color: theme.palette.primary.light }} /> : 
                  <Brightness4Icon sx={{ color: theme.palette.primary.main }} />
                }
              </IconButton>
            </Tooltip>
            
            {/* Ícone de notificações */}
            <Tooltip title="Notificações">
              <IconButton 
                color="inherit" 
                sx={{
                  borderRadius: '50%',
                  p: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(0.95)' },
                        '70%': { transform: 'scale(1)' },
                        '100%': { transform: 'scale(0.95)' }
                      }
                    }
                  }}
                >
                  <NotificationsIcon sx={{ color: theme.palette.primary.main }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Perfil do usuário */}
            <Button
              onClick={handleClick}
              sx={{ 
                ml: { xs: 1, sm: 2 },
                display: 'flex',
                alignItems: 'center',
                textTransform: 'none',
                borderRadius: 10,
                px: 2,
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  height: 40, 
                  width: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  }
                }}
                src={user?.avatar || ''}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              
              {!isMobile && (
                <Box sx={{ ml: 1.5, textAlign: 'left' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}
                  >
                    {user?.name || 'Usuário'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem'
                    }}
                  >
                    {user?.email || 'usuario@email.com'}
                  </Typography>
                </Box>
              )}
            </Button>
            
            {/* Menu do perfil */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 200,
                  overflow: 'hidden',
                  mt: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '& .MuiList-root': {
                    py: 1
                  }
                }
              }}
            >
              <Box sx={{ 
                px: 2, 
                py: 1.5, 
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.paper, 0.01)})`,
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.name || 'Usuário'}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                  {user?.email || 'usuario@email.com'}
                </Typography>
              </Box>
              
              <MenuItem 
                onClick={handleProfile}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" fontWeight={500}>Meu Perfil</Typography>
                } />
              </MenuItem>
              
              <MenuItem 
                onClick={handleSettings}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" fontWeight={500}>Configurações</Typography>
                } />
              </MenuItem>
              
              <MenuItem 
                onClick={handleHelp}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <ListItemIcon>
                  <HelpOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" fontWeight={500}>Ajuda</Typography>
                } />
              </MenuItem>
              
              <Divider sx={{ my: 1 }} />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.08)
                  }
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" fontWeight={500} color="error.main">Sair</Typography>
                } />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Modal de Configurações */}
      <ConfigModal 
        open={configModalOpen} 
        onClose={() => setConfigModalOpen(false)} 
      />
    </>
  );
};

export default Header;

