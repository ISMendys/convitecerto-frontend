import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Fab
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const MobileActionBar = ({ 
  eventId,
  onEdit,
  onDelete,
  onManageGuests,
  onShare
}) => {
  const theme = useTheme();

  const actions = [
    {
      icon: <PeopleIcon />,
      label: 'Convidados',
      color: 'primary',
      onClick: onManageGuests
    },
    {
      icon: <EditIcon />,
      label: 'Editar',
      color: 'info',
      onClick: onEdit
    },
    {
      icon: <ShareIcon />,
      label: 'Compartilhar',
      color: 'success',
      onClick: onShare
    },
    {
      icon: <DeleteIcon />,
      label: 'Excluir',
      color: 'error',
      onClick: onDelete
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        p: 2,
        pb: 3, // Extra padding para safe area
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: 400,
          mx: 'auto'
        }}
      >
        {actions.map((action, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <IconButton
              onClick={action.onClick}
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(theme.palette[action.color].main, 0.1),
                color: theme.palette[action.color].main,
                border: `2px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette[action.color].main, 0.2),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${alpha(theme.palette[action.color].main, 0.3)}`
                },
                '&:active': {
                  transform: 'translateY(0px)'
                }
              }}
            >
              {action.icon}
            </IconButton>
            
            <Typography
              variant="caption"
              sx={{
                color: theme.palette[action.color].main,
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            >
              {action.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Indicador de safe area */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 4,
          bgcolor: alpha(theme.palette.text.secondary, 0.3),
          borderRadius: 2
        }}
      />
    </Box>
  );
};

export default MobileActionBar;

