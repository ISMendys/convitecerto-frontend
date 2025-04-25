import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Paper, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  MoreVert as MoreVertIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon
} from '@mui/icons-material';

/**
 * Componente de card de convidado para o dashboard
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.guest - Dados do convidado
 * @param {Object} props.event - Dados do evento
 * @param {Function} props.onViewDetails - Função para visualizar detalhes
 * @param {Function} props.onMenuOpen - Função para abrir menu de ações
 */
const GuestCard = ({ guest, event, onViewDetails, onMenuOpen }) => {
  const theme = useTheme();
  
  // Função para gerar cor baseada em string
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };
  
  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return theme.palette.success;
      case 'pending':
        return theme.palette.warning;
      case 'declined':
        return theme.palette.error;
      default:
        return theme.palette.primary;
    }
  };
  
  // Obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'declined':
        return 'Recusado';
      default:
        return 'Desconhecido';
    }
  };
  
  // Obter ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <HelpOutlineIcon fontSize="small" />;
      case 'declined':
        return <CancelIcon fontSize="small" />;
      default:
        return <HelpOutlineIcon fontSize="small" />;
    }
  };
  
  const statusColor = getStatusColor(guest.status);
  
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: theme.palette.mode === 'light'
                             ? `2px solid ${theme.palette.divider}`
                             : 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Cabeçalho do card */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip
          icon={getStatusIcon(guest.status)}
          label={getStatusText(guest.status)}
          
          size="small"
          sx={{ 
            borderRadius: 8,
            color:  guest.status === 'confirmed' 
              ? theme.palette.success.main
              : guest.status === 'pending'
                ? theme.palette.warning.main
                : theme.palette.error.main,
            backgroundColor:  guest.status === 'confirmed' 
              ? alpha(theme.palette.success.main, 0.2)
              : guest.status === 'pending'
                ? alpha(theme.palette.warning.main, 0.2)
                : alpha(theme.palette.error.main, 0.2)
           }}
        />
        <IconButton
          size="small"
          onClick={(e) => onMenuOpen(e, guest)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Informações do convidado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: stringToColor(guest.name),
            width: 50,
            height: 50,
            mr: 2
          }}
        >
          {guest.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {guest.name}
          </Typography>
          {guest.group && (
            <Chip
              label={guest.group}
              size="small"
              sx={{ 
                borderRadius: 8, 
                fontSize: '0.7rem',
                height: 20,
                bgcolor: alpha(stringToColor(guest.group), 0.1),
                color: stringToColor(guest.group),
                border: `1px solid ${alpha(stringToColor(guest.group), 0.3)}`,
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            />
          )}
        </Box>
      </Box>
      
      {/* Informações de contato */}
      <Box sx={{ mb: 2 }}>
        {guest.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MailIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {guest.email}
            </Typography>
          </Box>
        )}
        {guest.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {guest.whatsapp ? (
              <WhatsAppIcon fontSize="small" color="success" sx={{ mr: 1, flexShrink: 0 }} />
            ) : (
              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {guest.phone}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Informações do evento */}
      {event && (
        <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon fontSize="small" color="primary" sx={{ mr: 1, flexShrink: 0 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              onClick={() => onViewDetails(event.id)}
            >
              {event.title}
            </Typography>
          </Box>
          {event.date && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {new Date(event.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          )}
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {event.location}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default GuestCard;
