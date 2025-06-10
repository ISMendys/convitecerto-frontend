import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Mail as MailIcon,
  Celebration as CelebrationIcon,
  Settings as SettingsIcon,
  PeopleOutline as PeopleOutlineIcon,
  QuestionMark as QuestionMarkIcon
} from '@mui/icons-material';
import ConfigModal from '../config/ConfigModal';

// Componente para o item do menu
const NavItem = ({ href, icon: Icon, title, isNew, onClick }) => {
  const location = useLocation();
  const theme = useTheme();
  const isActive = location.pathname === href || location.pathname.startsWith(`${href}/`);
  
  return (
    <ListItem
      disableGutters
      component={onClick ? 'div' : NavLink}
      to={onClick ? undefined : href}
      onClick={onClick}
      sx={{
        display: 'flex',
        py: 1.5,
        px: 2,
        borderRadius: 2,
        mb: 0.5,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&.active, &.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '10%',
            height: '80%',
            width: 4,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '0 4px 4px 0'
          },
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main
          }
        },
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transform: 'translateX(4px)'
        }
      }}
    >
      <ListItemIcon sx={{ 
        minWidth: 40,
        color: isActive ? theme.palette.primary.main : theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : alpha(theme.palette.common.black, 0.6),
      }}>
        <Icon />
      </ListItemIcon>
      <ListItemText 
        primary={
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: isActive ? 600 : 500,
              color: isActive ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main
            }}
          >
            {title}
          </Typography>
        } 
      />
      {isNew && (
        <Chip 
          label="Novo" 
          size="small" 
          color="secondary"
          sx={{ 
            height: 20, 
            fontSize: '0.625rem',
            fontWeight: 600,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.95)' },
              '70%': { transform: 'scale(1)' },
              '100%': { transform: 'scale(0.95)' }
            }
          }}
        />
      )}
    </ListItem>
  );
};

const Sidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose, openMobile]);

  const handleSettings = () => {
    setConfigModalOpen(true);
  };

  const items = [
    {
      href: '/dashboard',
      icon: DashboardIcon,
      title: 'Dashboard'
    },
    {
      href: '/events',
      icon: EventIcon,
      title: 'Meus Eventos'
    },
    {
      href: '/events/create',
      icon: CelebrationIcon,
      title: 'Criar Evento'
    },
    {
      href: '/invites/new',
      icon: MailIcon,
      title: 'Criar Convite'
    },
    {
      href: '/events/:id/guests',
      icon: PeopleOutlineIcon,
      title: 'Convidados',
      isNew: true
    }
  ];

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.95)
          : alpha(theme.palette.background.paper, 0.98),
      }}
    >
      {/* Perfil do usuário */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontSize: '2rem',
            fontWeight: 700,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: theme.palette.primary.main,
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            }
          }}
          src={user?.avatar || ''}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 600,
            textAlign: 'center',
            mb: 0.5
          }}
        >
          {user?.name || 'Usuário'}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            textAlign: 'center',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {user?.email || 'usuario@exemplo.com'}
        </Typography>
      </Box>
      
      {/* Menu de navegação */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <List sx={{ '& > *': { mb: 0.5 } }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isNew={item.isNew}
            />
          ))}
          <NavItem
            key="config"
            icon={SettingsIcon}
            title="Configurações"
            onClick={handleSettings}
          />
        </List>
      </Box>
      
      {/* Seção de suporte */}
      <Box
        sx={{
          p: 3,
          mx: 2,
          mb: 2,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              mr: 2
            }}
          >
            <QuestionMarkIcon fontSize="small" />
          </Avatar>
          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Precisa de ajuda?
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2 }}
        >
          Nossa equipe está pronta para ajudar com qualquer dúvida.
        </Typography>
        <Button
          component={NavLink}
          to="/support"
          color="primary"
          fullWidth
          variant="contained"
          sx={{ 
            borderRadius: 2,
            py: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            }
          }}
        >
          Suporte
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Drawer mobile */}
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 280,
              borderRadius: '0 16px 16px 0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}
          ModalProps={{
            keepMounted: true // Melhor desempenho em dispositivos móveis
          }}
        >
          {content}
        </Drawer>
      </Box>
      
      {/* Drawer desktop */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 280,
              top: 72, // Altura do header
              height: 'calc(100% - 72px)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
            }
          }}
        >
          {content}
        </Drawer>
      </Box>
      
      {/* Modal de Configurações */}
      <ConfigModal 
        open={configModalOpen} 
        onClose={() => setConfigModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;

