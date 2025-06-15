import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CardMedia,
  Chip,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const MobileEventDetailHeader = ({ 
  event, 
  onBack,
  formatDate,
  formatTime 
}) => {
  const theme = useTheme();
  
  const isUpcoming = new Date(event.date) >= new Date();
  const statusColor = isUpcoming ? 'success' : 'error';
  const statusLabel = isUpcoming ? 'Ativo' : 'Finalizado';

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header com botão voltar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        px: 1
      }}>
        <IconButton
          onClick={onBack}
          sx={{
            mr: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateX(-4px)'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h5" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
              lineHeight: 1.2
            }}
          >
            {event.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={statusLabel}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                bgcolor: isUpcoming 
                  ? alpha(theme.palette.success.main, 0.15)
                  : alpha(theme.palette.error.main, 0.15),
                color: isUpcoming 
                  ? theme.palette.success.dark 
                  : theme.palette.error.dark,
                border: `2px solid ${isUpcoming 
                  ? theme.palette.success.main 
                  : theme.palette.error.main}`
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Imagem do evento */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <CardMedia
          component="img"
          height="200"
          image={event.image || 'https://picsum.photos/400/200?random=1'}
          alt={event.title}
          sx={{
            borderRadius: 3,
            transition: 'transform 0.5s ease',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />
        
        {/* Overlay com informações principais */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(transparent, ${alpha('#000', 0.7)})`,
            borderRadius: '0 0 12px 12px',
            p: 2,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              {formatDate(event.date)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography variant="body2">
              {formatTime(event.date)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography 
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {event.location || 'Local não especificado'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Informações adicionais em cards compactos - CORRIGIDO para não cortar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1.5,
        mb: 2
      }}>
        {/* Primeira linha */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5,
          '& > *': { flex: 1 }
        }}>
          {/* Tipo do evento */}
          <Box sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            >
              Tipo
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={700} 
              color="primary"
              sx={{ 
                fontSize: '0.8rem',
                lineHeight: 1.2,
                mt: 0.5
              }}
            >
              {
                event.type === 'birthday' ? 'Aniversário' :
                event.type === 'wedding' ? 'Casamento' :
                event.type === 'corporate' ? 'Corporativo' :
                event.type === 'party' ? 'Festa' : 'Outro'
              }
            </Typography>
          </Box>

          {/* Status */}
          <Box sx={{ 
            bgcolor: alpha(theme.palette[statusColor].main, 0.08),
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            >
              Status
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={700} 
              color={`${statusColor}.dark`}
              sx={{ 
                fontSize: '0.8rem',
                lineHeight: 1.2,
                mt: 0.5
              }}
            >
              {statusLabel}
            </Typography>
          </Box>
        </Box>

        {/* Segunda linha */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5,
          '& > *': { flex: 1 }
        }}>
          {/* Data de criação */}
          <Box sx={{ 
            bgcolor: alpha(theme.palette.info.main, 0.08),
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            >
              Criado em
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={700} 
              color="info.dark"
              sx={{ 
                fontSize: '0.8rem',
                lineHeight: 1.2,
                mt: 0.5
              }}
            >
              {new Date(event.createdAt || event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
              })}
            </Typography>
          </Box>

          {/* Placeholder para manter simetria */}
          <Box sx={{ 
            bgcolor: alpha(theme.palette.secondary.main, 0.08),
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            >
              Categoria
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={700} 
              color="secondary.dark"
              sx={{ 
                fontSize: '0.8rem',
                lineHeight: 1.2,
                mt: 0.5
              }}
            >
              Evento
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileEventDetailHeader;
