import React from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de card de informações do evento reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.event - Dados do evento
 * @param {Array} [props.infoItems] - Itens de informação a serem exibidos (ícone, label, value)
 * @param {Object} [props.sx] - Estilos adicionais
 */
const EventInfoCard = ({ 
  event, 
  infoItems = [],
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 3,
        border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : '#e0e0e0'}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        p: 3,
        mb: 3,
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8) 
          : theme.palette.background.paper,
        ...sx
      }}
    >
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: theme.palette.primary.main,
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
        }}
      >
        Informações do Evento
      </Typography>
      
      <Grid container spacing={2}>
        {infoItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              mb: 2
            }}>
              <Box sx={{ 
                color: theme.palette.primary.main,
                mr: 1.5,
                mt: 0.5
              }}>
                {item.icon}
              </Box>
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1">
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {event.type && (
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={event.type} 
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 500,
              borderRadius: 1
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default EventInfoCard;
