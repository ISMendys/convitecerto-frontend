import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';

/**
 * Componente de botão estilizado reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.variant='contained'] - Variante do botão (contained, outlined, text)
 * @param {string} [props.color='primary'] - Cor do botão
 * @param {React.ReactNode} [props.startIcon] - Ícone no início do botão
 * @param {React.ReactNode} [props.endIcon] - Ícone no final do botão
 * @param {Function} [props.onClick] - Função de clique
 * @param {React.ReactNode} props.children - Conteúdo do botão
 * @param {string} [props.tooltip] - Texto do tooltip (opcional)
 * @param {string} [props.tooltipPlacement='top'] - Posição do tooltip
 * @param {string} [props.size='medium'] - Tamanho do botão (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Se o botão deve ocupar toda a largura disponível
 * @param {boolean} [props.disabled=false] - Se o botão está desabilitado
 * @param {Object} [props.sx] - Estilos adicionais
 */
const StyledButton = ({
  variant = 'contained',
  color = 'primary',
  startIcon,
  endIcon,
  onClick,
  children,
  tooltip,
  tooltipPlacement = 'top',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  sx = {}
}) => {
  const theme = useTheme();
  
  const buttonStyles = {
    borderRadius: 10,
    fontWeight: 600,
    transition: 'all 0.2s ease',
    ...(variant === 'contained' && color === 'primary' && {
      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 4px 12px rgba(149, 117, 205, 0.3)' 
        : '0 4px 12px rgba(94, 53, 177, 0.3)',
      '&:hover': {
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 6px 16px rgba(149, 117, 205, 0.4)' 
          : '0 6px 16px rgba(94, 53, 177, 0.4)',
        transform: 'translateY(-2px)'
      }
    }),
    ...(variant === 'outlined' && {
      borderColor: theme.palette.mode === 'dark' 
        ? alpha(theme.palette.primary.main, 0.5) 
        : undefined,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        transform: 'translateY(-2px)'
      }
    }),
    ...(size === 'small' && {
      px: 2,
      py: 0.5,
      fontSize: '0.8125rem'
    }),
    ...(size === 'medium' && {
      px: 3,
      py: 1,
      fontSize: '0.875rem'
    }),
    ...(size === 'large' && {
      px: 4,
      py: 1.5,
      fontSize: '0.9375rem'
    }),
    ...(fullWidth && {
      width: '100%'
    }),
    ...sx
  };
  
  const button = (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disabled}
      sx={buttonStyles}
    >
      {children}
    </Button>
  );
  
  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement={tooltipPlacement} TransitionComponent={Zoom}>
        {button}
      </Tooltip>
    );
  }
  
  return button;
};

export default StyledButton;
