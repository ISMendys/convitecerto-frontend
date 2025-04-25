import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Mail as MailIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const items = [
  {
    href: '/',
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
    icon: MailIcon,
    title: 'Criar Evento'
  },
  {
    href: '/settings',
    icon: SettingsIcon,
    title: 'Configurações'
  }
];

const Sidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  React.useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose, openMobile]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Typography
          color="textPrimary"
          variant="h5"
          sx={{ mt: 2 }}
        >
          {user?.name || 'Usuário'}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user?.email || 'usuario@exemplo.com'}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <ListItem
              disableGutters
              key={item.title}
              component={NavLink}
              to={item.href}
              sx={{
                display: 'flex',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                '&.active': {
                  backgroundColor: 'rgba(94, 53, 177, 0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(94, 53, 177, 0.04)'
                }
              }}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          p: 2,
          m: 2,
          bgcolor: 'background.dark',
          borderRadius: 1
        }}
      >
        <Typography
          align="center"
          variant="body2"
          color="textSecondary"
        >
          Precisa de ajuda?
        </Typography>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
        >
          Suporte
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 280
            }
          }}
        >
          {content}
        </Drawer>
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 280,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
