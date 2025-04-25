import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { Fab, Tooltip } from '@mui/material';

/**
 * Componente de botão de ação flutuante com tooltip
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.icon - Ícone do botão
 * @param {string} props.tooltip - Texto do tooltip
 * @param {Function} props.onClick - Função de clique
 * @param {string} [props.color='primary'] - Cor do botão
 * @param {string} [props.size='large'] - Tamanho do botão
 * @param {Object} [props.sx] - Estilos adicionais
 */
const ActionButton = ({
  icon,
  tooltip,
  onClick,
  color = 'primary',
  size = 'large',
  sx = {}
}) => {
  const theme = useTheme();
  
  // Configurações de cores baseadas no tema
  const getColorStyles = () => {
    if (color === 'primary') {
      return {
        bgcolor: theme.palette.primary.main,
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
        }
      };
    } else if (color === 'secondary') {
      return {
        bgcolor: theme.palette.secondary.main,
        '&:hover': {
          bgcolor: theme.palette.secondary.dark,
        }
      };
    } else if (color === 'error') {
      return {
        bgcolor: theme.palette.error.main,
        '&:hover': {
          bgcolor: theme.palette.error.dark,
        }
      };
    } else if (color === 'success') {
      return {
        bgcolor: theme.palette.success.main,
        '&:hover': {
          bgcolor: theme.palette.success.dark,
        }
      };
    } else if (color === 'warning') {
      return {
        bgcolor: theme.palette.warning.main,
        '&:hover': {
          bgcolor: theme.palette.warning.dark,
        }
      };
    } else if (color === 'info') {
      return {
        bgcolor: theme.palette.info.main,
        '&:hover': {
          bgcolor: theme.palette.info.dark,
        }
      };
    }
    
    return {};
  };
  
  const button = (
    <Fab
      color={color}
      size={size}
      onClick={onClick}
      sx={{
        boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: `0 6px 16px ${alpha(theme.palette[color].main, 0.4)}`,
          transform: 'translateY(-2px)'
        },
        ...getColorStyles(),
        ...sx
      }}
    >
      {icon}
    </Fab>
  );
  
  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="left" arrow>
        {button}
      </Tooltip>
    );
  }
  
  return button;
};

export default ActionButton;
