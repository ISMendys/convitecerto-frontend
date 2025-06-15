import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';

const MobileEventHeader = ({ 
  title = "Meus Eventos",
  subtitle = "Gerencie seus eventos, convites e confirmações em um só lugar.",
  onNewEvent
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        mb: 4,
        textAlign: 'center',
        position: 'relative',
        py: 3,
        px: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '4px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          borderRadius: '0 0 4px 4px'
        }
      }}
    >
      {/* Título principal */}
      <Typography 
        variant="h4" 
        component="h1"
        sx={{ 
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: theme.palette.primary.main,
          mb: 1,
          fontSize: { xs: '1.75rem', sm: '2rem' },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {title}
      </Typography>
      
      {/* Subtítulo */}
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          mb: 3,
          lineHeight: 1.6,
          maxWidth: '300px',
          mx: 'auto',
          fontSize: '0.95rem'
        }}
      >
        {subtitle}
      </Typography>

      {/* Botão de ação */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onNewEvent}
        size="large"
        sx={{ 
          borderRadius: 12,
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 8px 24px rgba(94, 53, 177, 0.3)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(94, 53, 177, 0.4)',
            transform: 'translateY(-3px)',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
          },
          '&:active': {
            transform: 'translateY(-1px)'
          }
        }}
      >
        Novo Evento
      </Button>

      {/* Decoração inferior */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(to right, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`
        }}
      />
    </Box>
  );
};

export default MobileEventHeader;

