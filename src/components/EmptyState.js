import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import StyledButton from './StyledButton';

/**
 * Componente para exibir estado vazio com mensagem e botão de ação opcional
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem a ser exibida
 * @param {React.ReactNode} props.icon - Ícone a ser exibido
 * @param {string} [props.buttonText] - Texto do botão (opcional)
 * @param {Function} [props.buttonAction] - Função de clique do botão
 * @param {string} [props.color='primary'] - Cor do componente
 * @param {Object} [props.sx] - Estilos adicionais
 */
const EmptyState = ({
  message,
  icon,
  buttonText,
  buttonAction,
  color = 'primary',
  sx = {}
}) => {
  const theme = useTheme();
  
  // Mapear cor para configurações visuais
  const getColorConfig = () => {
    if (color === 'success') {
      return {
        color: theme.palette.success,
        bgColor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
      };
    } else if (color === 'warning') {
      return {
        color: theme.palette.warning,
        bgColor: alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
      };
    } else if (color === 'error') {
      return {
        color: theme.palette.error,
        bgColor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
      };
    } else {
      return {
        color: theme.palette.primary,
        bgColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
      };
    }
  };
  
  const colorConfig = getColorConfig();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        backgroundColor: colorConfig.bgColor,
        borderRadius: 3,
        ...sx
      }}
    >
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: '50%',
          backgroundColor: alpha(colorConfig.color.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
          color: colorConfig.color.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48
        }}
      >
        {icon}
      </Box>
      
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: theme.palette.mode === 'dark' ? colorConfig.color.light : colorConfig.color.dark,
          fontWeight: 600
        }}
      >
        {message}
      </Typography>
      
      {buttonText && buttonAction && (
        <StyledButton
          variant="contained"
          color={color}
          onClick={buttonAction}
          sx={{ mt: 2 }}
        >
          {buttonText}
        </StyledButton>
      )}
    </Box>
  );
};

export default EmptyState;
