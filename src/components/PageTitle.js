import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de título de página com linha gradiente opcional
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título principal
 * @param {React.ReactNode} [props.subtitle] - Subtítulo ou elemento adicional
 * @param {boolean} [props.alignRight=false] - Alinhar à direita
 * @param {number|string} [props.mb=2] - Margem inferior
 * @param {Object} [props.sx] - Estilos adicionais
 */
const PageTitle = ({ 
  title, 
  subtitle, 
  alignRight = false,
  mb = 2,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        textAlign: alignRight ? 'right' : 'left',
        mb,
        ...sx
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: theme.palette.primary.main,
          textShadow: '0 2px 4px rgba(0,0,0,0.08)',
          position: 'relative',
          display: 'inline-block',
          mb: 0.5, // Reduzido para diminuir o espaço
          // '&::after': {
          //   content: '""',
          //   position: 'absolute',
          //   bottom: -4,
          //   left: alignRight ? 'auto' : 0,
          //   right: alignRight ? 0 : 'auto',
          //   width: alignRight ? '40%' : '30%',
          //   height: '3px',
          //   background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
          // }
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Box sx={{ mt: 0.5 }}> {/* Reduzido para diminuir o espaço */}
          {subtitle}
        </Box>
      )}
    </Box>
  );
};

export default PageTitle;
