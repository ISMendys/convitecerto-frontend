import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, Backdrop, Fade, useTheme, alpha } from '@mui/material';
import { keyframes } from '@mui/system';

// Animação de pulso para o fundo
const pulseAnimation = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
`;

// Animação de rotação para o ícone secundário
const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Animação de brilho para o círculo externo
const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(94, 53, 177, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(94, 53, 177, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(94, 53, 177, 0.3);
  }
`;

/**
 * Componente de loading elegante que pode ser usado em diferentes contextos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Controla se o loading está visível
 * @param {string} props.type - Tipo de loading: 'fullscreen', 'container', 'inline', 'overlay' (padrão: 'container')
 * @param {string} props.message - Mensagem opcional para exibir durante o loading
 * @param {string} props.color - Cor do loading (padrão: 'primary')
 * @param {number} props.size - Tamanho do indicador de loading (padrão: 40)
 * @param {number} props.thickness - Espessura do CircularProgress (padrão: 4)
 * @param {Object} props.sx - Estilos adicionais para o componente
 */
const LoadingIndicator = ({
  open = false,
  type = 'container',
  message = 'Carregando...',
  color = 'primary',
  size = 40,
  thickness = 4,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  
  // Configurações com base no tipo
  const configs = {
    fullscreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: theme.zIndex.modal + 1,
      backgroundColor: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: 'blur(4px)',
    },
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      backgroundColor: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: 'blur(2px)',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      backgroundColor: alpha(theme.palette.background.paper, 0.5),
      backdropFilter: 'blur(1px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inline: {
      display: 'inline-flex',
      position: 'relative',
    }
  };
  
  // Componente interno de loading
  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size * 1.2,
          height: size * 1.2,
          borderRadius: '50%',
          animation: `${glowAnimation} 2s ease-in-out infinite`,
        }}
      >
        {/* Círculo principal */}
        <CircularProgress
          color={color}
          size={size}
          thickness={thickness}
          {...props}
        />
        
        {/* Círculo secundário com animação diferente */}
        <CircularProgress
          color={color === 'primary' ? 'secondary' : 'primary'}
          size={size * 0.7}
          thickness={thickness * 0.8}
          sx={{
            position: 'absolute',
            animation: `${rotateAnimation} 3s linear infinite`,
            opacity: 0.7,
          }}
          {...props}
        />
      </Box>
      
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
  
  // Renderização com base no tipo
  if (type === 'fullscreen') {
    return (
      <Backdrop
        open={open}
        sx={{
          ...configs.fullscreen,
          ...sx,
        }}
      >
        <Fade in={open}>
          <Box>
            <LoadingContent />
          </Box>
        </Fade>
      </Backdrop>
    );
  }
  
  if (type === 'container') {
    return open ? (
      <Box
        sx={{
          ...configs.container,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <Fade in={open}>
          <Box>
            <LoadingContent />
          </Box>
        </Fade>
      </Box>
    ) : null;
  }
  
  if (type === 'overlay') {
    return open ? (
      <Fade in={open}>
        <Box
          sx={{
            ...configs.overlay,
            ...sx,
          }}
        >
          <LoadingContent />
        </Box>
      </Fade>
    ) : null;
  }
  
  // Inline loading
  return open ? (
    <Box
      sx={{
        ...configs.inline,
        ...sx,
      }}
    >
      <LoadingContent />
    </Box>
  ) : null;
};

/**
 * Componente de loading global que monitora o estado de loading do Redux
 */
const GlobalLoadingIndicator = () => {
  const loading = useSelector(state => state.app?.loading || false);
  
  return (
    <LoadingIndicator
      open={loading}
      type="fullscreen"
      message="Processando sua solicitação..."
    />
  );
};

export { LoadingIndicator, GlobalLoadingIndicator };
export default LoadingIndicator;
