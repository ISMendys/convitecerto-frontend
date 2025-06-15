import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Percent as PercentIcon // Importando o ícone de porcentagem
} from '@mui/icons-material';

const MobileEventCard = ({
  event,
  onClick,
  onMenuOpen,
  formatDate,
  formatTime
}) => {
  const theme = useTheme();

  const isUpcoming = new Date(event.date) >= new Date();
  const statusColor = isUpcoming ? 'success' : 'error';
  const statusLabel = isUpcoming ? 'Ativo' : 'Finalizado';

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
      onClick={onClick}
    >
      {/* Header com imagem e informações principais */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="120"
          image={event.image || 'https://picsum.photos/400/200?random=1'}
          alt={event.title}
          sx={{
            transition: 'transform 0.5s ease',
            filter: !isUpcoming ? 'grayscale(30%)' : 'none',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />

        {/* Overlay com data */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.primary.main }} />
          <Typography variant="caption" fontWeight={600} color="primary">
            {formatDate(event.date)}
          </Typography>
        </Box>

        {/* Status chip - CORRIGIDO com cores mais visíveis */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12
          }}
        >
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
                : theme.palette.error.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Box>

        {/* Menu de ações */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onMenuOpen(e, event);
          }}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              transform: 'scale(1.1)'
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Título e horário */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              lineHeight: 1.3,
              color: theme.palette.text.primary
            }}
          >
            {event.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon
              fontSize="small"
              sx={{
                mr: 0.5,
                color: theme.palette.text.secondary,
                fontSize: 16
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {formatTime(event.date)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon
              fontSize="small"
              sx={{
                mr: 0.5,
                color: theme.palette.text.secondary,
                fontSize: 16
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {event.location || 'Local não especificado'}
            </Typography>
          </Box>
        </Box>

        {/* Estatísticas em linha - CORRIGIDAS com melhor visibilidade */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          pt: 1.5,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          flexWrap: 'wrap',
        }}>
          {/* Total de convidados */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column', // Alterado para coluna para centralizar verticalmente
            alignItems: 'center', // Centraliza horizontalmente
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            borderRadius: 2,
            px: 1, // Reduzido para otimizar espaço
            py: 0.5, // Reduzido para otimizar espaço
            flex: '1 1 calc(50% - 0.5rem)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            minWidth: '120px' // Reduzido o minWidth
          }}>
            <Box sx={{ textAlign: 'center',display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 24, // Reduzido o tamanho do Avatar
                  height: 24, // Reduzido o tamanho do Avatar
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.main,
                  mb: 0.5 // Adicionado margem inferior para separar do texto
                }}
              >
                <PeopleIcon sx={{ fontSize: 14 }} /> {/* Reduzido o tamanho do ícone */}
              </Avatar>
              <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                >
                  Convidados
                </Typography>
              </Box>
            <Box sx={{ textAlign: 'center' }}> {/* Centraliza o texto */}
              <Typography
                variant="body2"
                fontWeight={800}
                color="primary"
                sx={{ fontSize: '0.9rem' }}
              >
                {event.guestsCount || 0}
              </Typography>
            </Box>
          </Box>

          {/* Confirmados */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column', // Alterado para coluna para centralizar verticalmente
            alignItems: 'center', // Centraliza horizontalmente
            bgcolor: alpha(theme.palette.success.main, 0.12),
            borderRadius: 2,
            px: 1, // Reduzido para otimizar espaço
            py: 0.5, // Reduzido para otimizar espaço
            flex: '1 1 calc(50% - 0.5rem)',
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            minWidth: '120px' // Reduzido o minWidth
          }}>
            <Box sx={{ textAlign: 'center',display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.main,
                  mb: 0.5
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} /> {/* Reduzido o tamanho do ícone */}
              </Avatar>
              <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                >
                  Confirmados
                </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}> {/* Centraliza o texto */}
              <Typography
                variant="body2"
                fontWeight={800}
                color="success.dark"
                sx={{ fontSize: '0.9rem' }}
              >
                {event.confirmedCount || 0}
              </Typography>
            </Box>
          </Box>

          {/* Percentual */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column', // Alterado para coluna para centralizar verticalmente
            alignItems: 'center', // Centraliza horizontalmente
            bgcolor: alpha(theme.palette.warning.main, 0.12),
            borderRadius: 2,
            px: 1, // Reduzido para otimizar espaço
            py: 0.5, // Reduzido para otimizar espaço
            flex: '1 1 100%',
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            mt: 1
          }}>
            <Box sx={{ textAlign: 'center',display: 'flex', gap: 2, alignItems: 'center', mb: 1, ml: -5 }}>
              <Avatar
                sx={{
                  width: 24, // Reduzido o tamanho do Avatar
                  height: 24, // Reduzido o tamanho do Avatar
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  color: theme.palette.warning.main,
                  mb: 0.5 // Adicionado margem inferior para separar do texto
                }}
              >
                <PercentIcon sx={{ fontSize: 14 }} /> {/* Adicionado e padronizado o ícone */}
              </Avatar>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
              >
                Taxa
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography
                variant="body2"
                fontWeight={800}
                color="warning.dark"
                sx={{ fontSize: '0.9rem' }}
              >
                {event.guestsCount > 0
                  ? Math.round((event.confirmedCount / event.guestsCount) * 100)
                  : 0}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MobileEventCard;


