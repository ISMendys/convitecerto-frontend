import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de seção de formulário reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da seção
 * @param {React.ReactNode} props.icon - Ícone da seção
 * @param {React.ReactNode} props.children - Conteúdo da seção
 * @param {boolean} [props.withDivider=true] - Se deve mostrar o divisor
 * @param {number} [props.mb=3] - Margem inferior
 * @param {Object} [props.sx] - Estilos adicionais
 */
const FormSection = ({ 
  title, 
  icon, 
  children, 
  withDivider = true,
  mb = 3,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb, ...sx }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        pb: withDivider ? 2 : 0,
        borderBottom: withDivider 
          ? `1px solid ${theme.palette.mode === 'dark' 
              ? alpha(theme.palette.divider, 0.8) 
              : alpha(theme.palette.divider, 0.6)}`
          : 'none'
      }}>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
            color: theme.palette.primary.main,
            mr: 2
          }}
        >
          {icon}
        </Avatar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          {title}
        </Typography>
      </Box>
      
      {children}
    </Box>
  );
};

export default FormSection;
