import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const MobileEventInfo = ({ 
  event,
  formatDate 
}) => {
  const theme = useTheme();

  const infoItems = [
    {
      icon: <EventIcon />,
      label: 'Título',
      value: event.title,
      color: 'primary'
    },
    {
      icon: <CalendarIcon />,
      label: 'Data e Hora',
      value: formatDate(event.date),
      color: 'primary'
    },
    {
      icon: <LocationIcon />,
      label: 'Local',
      value: event.location || 'Não especificado',
      color: 'primary'
    },
    {
      icon: <CategoryIcon />,
      label: 'Tipo',
      value: event.type === 'birthday' ? 'Aniversário' :
             event.type === 'wedding' ? 'Casamento' :
             event.type === 'corporate' ? 'Corporativo' :
             event.type === 'party' ? 'Festa' : 'Outro',
      color: 'primary'
    }
  ];

  return (
    <Box sx={{ px: 2 }}>
      {/* Informações principais */}
      <Box sx={{ mb: 3 }}>
        {infoItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 2.5,
              p: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[item.color].main, 0.1),
                color: theme.palette[item.color].main,
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              {item.icon}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                {item.label}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mt: 0.5,
                  lineHeight: 1.4
                }}
              >
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Descrição - CORRIGIDA com alinhamento consistente */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          p: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            <DescriptionIcon />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Descrição
            </Typography>
            
            <Box sx={{ mt: 1 }}>
              <Typography 
                variant="body1"
                sx={{ 
                  lineHeight: 1.6,
                  color: theme.palette.text.primary,
                  fontWeight: 400
                }}
              >
                {event.description || 'Sem descrição disponível para este evento.'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Observações (se existir) - CORRIGIDA com alinhamento consistente */}
      {event.notes && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            p: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              <DescriptionIcon />
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                Observações
              </Typography>
              
              <Box sx={{ mt: 1 }}>
                <Typography 
                  variant="body1"
                  sx={{ 
                    lineHeight: 1.6,
                    color: theme.palette.text.primary,
                    fontWeight: 400
                  }}
                >
                  {event.notes}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MobileEventInfo;
