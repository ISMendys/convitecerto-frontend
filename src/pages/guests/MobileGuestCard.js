import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Checkbox,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpOutlineIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Link as LinkIcon
} from '@mui/icons-material';

// Função para gerar cor baseada em string (mesma do arquivo original)
const stringToColor = (string) => {
  if (!string) return '#5e35b1';
  
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

const MobileGuestCard = ({
  guest,
  selected,
  onSelect,
  onMenuOpen,
  onDelete,
  groups,
  event,
  navigate
}) => {
  const theme = useTheme();

  // Configuração de status
  const statusConfig = {
    confirmed: {
      color: 'success',
      icon: <CheckCircleIcon fontSize="small" />,
      label: 'Confirmado'
    },
    pending: {
      color: 'warning',
      icon: <HelpOutlineIcon fontSize="small" />,
      label: 'Pendente'
    },
    declined: {
      color: 'error',
      icon: <CancelIcon fontSize="small" />,
      label: 'Recusado'
    }
  };

  const currentStatus = statusConfig[guest.status] || statusConfig.pending;
  const groupName = groups.find(g => g?.id === guest.group)?.name || 'Geral';

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        border: selected 
          ? `2px solid ${theme.palette.primary.main}` 
          : '1px solid #e0e0e0',
        boxShadow: selected 
          ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-1px)'
        }
      }}
      onClick={(e) => {
        if (e.target.type !== 'checkbox' && !e.target.closest('.menu-button')) {
          onSelect(guest?.id);
        }
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        {/* Header com checkbox, avatar, nome e menu */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* Checkbox de seleção */}
          <Checkbox
            checked={selected}
            onChange={() => onSelect(guest?.id)}
            color="primary"
            sx={{ 
              mt: 3,
              mr: 2, 
              p: 0.5,
              alignSelf: 'flex-start'
            }}
          />

          {/* Avatar */}
          <Avatar
            sx={{
              mt: 3,
              width: 56,
              height: 56,
              bgcolor: stringToColor(guest.name),
              mr: 2,
              fontSize: '1.4rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}
          >
            {guest.name?.charAt(0)?.toUpperCase() || 'G'}
          </Avatar>

          {/* Nome e menu */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ 
                  mb: 1,
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  wordBreak: 'break-word'
                }}
              >
                {guest.name}
              </Typography>

              {/* Menu de ações */}
              <IconButton
                className="menu-button"
                onClick={(e) => onMenuOpen(e, guest)}
                sx={{
                  ml: 1,
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

            {/* Status e Grupo */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={currentStatus.icon}
                label={currentStatus.label}
                color={currentStatus.color}
                size="small"
                sx={{ 
                  height: 28,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              />
              
              <Chip
                label={groupName}
                variant="outlined"
                size="small"
                sx={{ 
                  height: 28,
                  fontSize: '0.8rem'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Informações de contato */}
        <Box sx={{ mb: 2 }}>
          {guest.email && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              p: 1,
              bgcolor: alpha(theme.palette.grey[500], 0.05),
              borderRadius: 1
            }}>
              <EmailIcon 
                fontSize="small" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  mr: 1,
                  flexShrink: 0
                }} 
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  wordBreak: 'break-all',
                  fontSize: '0.9rem'
                }}
              >
                {guest.email}
              </Typography>
            </Box>
          )}

          {guest.phone && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              bgcolor: alpha(theme.palette.grey[500], 0.05),
              borderRadius: 1
            }}>
              {guest.whatsapp ? (
                <WhatsAppIcon 
                  fontSize="small" 
                  sx={{ 
                    color: '#25D366',
                    mr: 1,
                    flexShrink: 0
                  }} 
                />
              ) : (
                <PhoneIcon 
                  fontSize="small" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mr: 1,
                    flexShrink: 0
                  }} 
                />
              )}
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.9rem' }}
              >
                {guest.phone}
              </Typography>
              {guest.whatsapp && (
                <Chip
                  label="WhatsApp"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ 
                    ml: 'auto',
                    height: 20,
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Indicador de convite vinculado */}
        {guest.inviteId && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>
              <LinkIcon 
                fontSize="small" 
                sx={{ 
                  color: theme.palette.success.main,
                  mr: 1
                }} 
              />
              <Typography 
                variant="body2" 
                color="success.main"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Convite vinculado
              </Typography>
              <CheckCircleIcon 
                fontSize="small" 
                sx={{ 
                  color: theme.palette.success.main,
                  ml: 'auto'
                }} 
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileGuestCard;

