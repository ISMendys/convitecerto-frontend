import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de card de estatísticas reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.icon - Ícone do card
 * @param {string} props.title - Título do card
 * @param {string|number} props.value - Valor principal a ser exibido
 * @param {string} [props.subtitle] - Texto secundário (opcional)
 * @param {React.ReactNode} [props.subtitleIcon] - Ícone do texto secundário (opcional)
 * @param {string} [props.color='primary'] - Cor do card (primary, success, warning, error, info)
 * @param {Object} [props.sx] - Estilos adicionais
 */
const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  subtitleIcon, 
  color = 'primary',
  sx = {}
}) => {
  const theme = useTheme();
  
  // Mapear a cor para as cores do tema
  const getColorFromTheme = (colorName) => {
    const colorMap = {
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      success: theme.palette.success,
      warning: theme.palette.warning,
      error: theme.palette.error,
      info: theme.palette.info
    };
    
    return colorMap[colorName] || colorMap.primary;
  };
  
  const themeColor = getColorFromTheme(color);
  
  return (
    <Card 
      sx={{ 
        flex: 1,
        borderRadius: 3,
        border: `1px solid ${theme.palette.mode === 'dark' ? alpha(themeColor.main, 0.3) : '#e0e0e0'}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
        bgcolor: theme.palette.mode === 'dark' 
          ? alpha(themeColor.main, 0.1) 
          : alpha(themeColor.main, 0.05),
        textAlign: 'center',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)'
        },
        ...sx
      }}
    >
      <CardContent>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            justifyContent: 'center'
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(themeColor.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
              color: themeColor.main,
              mr: 0.7
            }}
          >
            {icon}
          </Avatar>
          <Typography 
            variant="subtitle1"
            fontWeight={600}
            color="text.secondary"
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h3"
          sx={{
            fontWeight: 700,
            color: themeColor.main,
            mb: 0.5,
            textAlign: 'center'
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {subtitleIcon && React.cloneElement(subtitleIcon, { 
              sx: { 
                fontSize: 16, 
                mr: 0.5, 
                color: themeColor.main 
              } 
            })}
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
