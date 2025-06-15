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

const MobileEmptyState = ({ 
  icon: Icon,
  title,
  description,
  actionText = "Criar Novo Evento",
  onAction,
  illustration
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 6,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.light, 0.01)} 100%)`,
        borderRadius: 4,
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 60,
          height: 60,
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
          borderRadius: '50%'
        }
      }}
    >
      {/* Ícone principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${alpha(theme.palette.primary.main, 0.2)}, transparent, ${alpha(theme.palette.primary.main, 0.2)})`,
              animation: 'spin 8s linear infinite'
            },
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Icon 
              sx={{ 
                fontSize: 40, 
                color: theme.palette.primary.main
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Título */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
          position: 'relative',
          zIndex: 1
        }}
      >
        {title}
      </Typography>
      
      {/* Descrição */}
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          lineHeight: 1.6,
          maxWidth: '280px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {description}
      </Typography>

      {/* Botão de ação */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAction}
        size="large"
        sx={{ 
          mt: 2,
          borderRadius: 12,
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 8px 24px rgba(94, 53, 177, 0.25)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            boxShadow: '0 12px 32px rgba(94, 53, 177, 0.35)',
            transform: 'translateY(-3px)',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
          },
          '&:active': {
            transform: 'translateY(-1px)'
          }
        }}
      >
        {actionText}
      </Button>

      {/* Ilustração adicional (opcional) */}
      {illustration && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            opacity: 0.1,
            fontSize: 60,
            color: theme.palette.primary.main,
            transform: 'rotate(15deg)'
          }}
        >
          {illustration}
        </Box>
      )}
    </Box>
  );
};

export default MobileEmptyState;

