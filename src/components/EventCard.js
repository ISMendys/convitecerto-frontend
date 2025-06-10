import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const EventCard = ({ event,
        onClick,
        extraContent = null,
    }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        cursor: 'pointer', 
        borderRadius: 3,
        maxWidth: 250,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 30px rgba(94, 53, 177, 0.15)'
        } 
      }}
      onClick={() => onClick && onClick(event)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={event.image || 'https://picsum.photos/400/200?random=1'}
          alt={event.title}
          sx={{
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(4px)',
            borderRadius: 10,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.primary.main }} />
          <Typography variant="caption" fontWeight={600}>
            {formatDate(event.date)}
          </Typography>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          mb={1}
          sx={{ 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
            pb: 1 
          }}
        >
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1
          }}
        >
          {event.title}
        </Typography>
        {extraContent && (
          <Box sx={{ mb: 2 }}>
            {React.cloneElement(extraContent, { event })}
          </Box>
        )}
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1
          }}
        >
          <EventIcon 
            fontSize="small" 
            sx={{ 
              mr: 1,
              color: theme.palette.primary.main
            }}
          /> 
          {formatTime(event.date)}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          noWrap
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}
        >
          <LocationIcon 
            fontSize="small" 
            sx={{ 
              mr: 1,
              color: theme.palette.primary.main
            }}
          /> 
          {event.location}
        </Typography>

        {event.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {event.description}
          </Typography>
        )}
        
        <Divider sx={{ my: 1.5 }}/>
        
        <Box 
          display="flex" 
          justifyContent="space-between" 
          mt={2}
          gap={1}
        >
          <Chip 
            label={`${event.confirmedCount || 0} confirmados`} 
            size="small" 
            color="success"
            sx={{
              borderRadius: 10,
              backgroundColor: alpha(theme.palette.success.main, 0.2),
              color: theme.palette.success.main,
              fontWeight: 500
            }}
          />
          <Chip 
            label={`${event.pendingCount || 0} pendentes`} 
            size="small"
            color="warning"
            sx={{
              backgroundColor: alpha(theme.palette.warning.main, 0.2),
              color: theme.palette.warning.main,
              borderRadius: 10,
              fontWeight: 500
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;

