import React from 'react';
import { Box, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente para exibir chips de status de convidado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status do convidado ('confirmed', 'pending', 'declined')
 * @param {string} [props.size='small'] - Tamanho do chip ('small', 'medium')
 * @param {Object} [props.sx] - Estilos adicionais
 */
const StatusChip = ({ 
  status, 
  size = 'small',
  sx = {}
}) => {
  const theme = useTheme();
  
  // Mapear status para configurações visuais
  const statusConfig = {
    confirmed: {
      label: 'Confirmado',
      color: theme.palette.success,
      bgcolor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
    },
    pending: {
      label: 'Pendente',
      color: theme.palette.warning,
      bgcolor: alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
    },
    declined: {
      label: 'Recusado',
      color: theme.palette.error,
      bgcolor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
    }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Chip 
      label={config.label}
      size={size}
      sx={{ 
        bgcolor: config.bgcolor,
        color: config.color.main,
        fontWeight: 500,
        borderRadius: 1,
        ...sx
      }}
    />
  );
};

export default StatusChip;
