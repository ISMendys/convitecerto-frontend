import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Collapse,
  IconButton,
  Paper
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
  } from '@mui/lab';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  AccessTime as AccessTimeIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  History as HistoryIcon,
  WhatsApp as WhatsAppIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { ptBR } from 'date-fns/locale';
import { format, isValid, parseISO } from 'date-fns';

// Componentes estilizados
import StyledButton from '../StyledButton';

// Ações do Redux
import { sendReminderWhatsApp } from '../../store/actions/guestActions';

/**
 * Componente para exibir detalhes do RSVP de um convidado
 */
const RsvpDetailsCard = ({ guest }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [historyExpanded, setHistoryExpanded] = useState(false);
  
  // Determinar o status do RSVP
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmado',
          color: theme.palette.success.main,
          icon: <CheckCircleIcon />,
          bgColor: alpha(theme.palette.success.main, 0.1)
        };
      case 'declined':
        return {
          label: 'Recusado',
          color: theme.palette.error.main,
          icon: <CancelIcon />,
          bgColor: alpha(theme.palette.error.main, 0.1)
        };
      default:
        return {
          label: 'Pendente',
          color: theme.palette.warning.main,
          icon: <HelpOutlineIcon />,
          bgColor: alpha(theme.palette.warning.main, 0.1)
        };
    }
  };
  
  const statusInfo = getStatusInfo(guest.status);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    const date = parseISO(dateString);
  
    if (!isValid(date)) return 'Data inválida';
  
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Enviar lembrete via WhatsApp
  const handleSendReminder = async () => {
    try {
      await dispatch(sendReminderWhatsApp({
        guestId: guest.id,
        message: reminderMessage
      })).unwrap();
      
      setReminderDialogOpen(false);
      setReminderMessage('');
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
    }
  };
  
  // Mensagens do convidado (histórico)
  const messages = guest.messages || [];
  
  // Ordenar mensagens por data (mais recente primeiro)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Data da última resposta
  const lastResponse = sortedMessages.find(msg => msg.type === 'confirmation');
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        overflow: 'visible',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Cabeçalho com status */}
        <Box sx={{ 
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: statusInfo.bgColor,
                color: statusInfo.color,
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              {statusInfo.icon}
            </Avatar>
            
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Status do RSVP
              </Typography>
              
              <Chip 
                label={statusInfo.label}
                sx={{ 
                  bgcolor: statusInfo.bgColor,
                  color: statusInfo.color,
                  fontWeight: 500,
                  mt: 0.5
                }}
                size="small"
              />
            </Box>
          </Box>
          
          {guest.phone && (
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<WhatsAppIcon />}
              onClick={() => setReminderDialogOpen(true)}
              size="small"
            >
              Enviar Lembrete
            </StyledButton>
          )}
        </Box>
        
        <Divider />
        
        {/* Detalhes da resposta */}
        <Box sx={{ p: 3 }}>
          <List disablePadding>
            {/* Data da resposta */}
            <ListItem 
              disablePadding 
              sx={{ 
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccessTimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" color="text.secondary">
                    Data da Resposta
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                    {lastResponse 
                      ? formatDate(lastResponse.createdAt)
                      : 'Ainda não respondeu'}
                  </Typography>
                }
              />
            </ListItem>
            
            {/* Acompanhante */}
            <ListItem 
              disablePadding 
              sx={{ 
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {guest.plusOne ? <PersonAddIcon color="secondary" /> : <PersonIcon color="primary" />}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" color="text.secondary">
                    Acompanhante
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                    {guest.plusOne 
                      ? guest.plusOneName || 'Acompanhante confirmado (sem nome)'
                      : 'Sem acompanhante'}
                  </Typography>
                }
              />
            </ListItem>
            
            {/* Mensagem */}
            <ListItem 
              disablePadding 
              sx={{ 
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MessageIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" color="text.secondary">
                    Mensagem
                  </Typography>
                }
                secondary={
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mt: 0.5, 
                      p: 1.5, 
                      bgcolor: alpha(theme.palette.background.default, 0.7),
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.5)
                    }}
                  >
                    <Typography variant="body2">
                      {guest.message || 'Nenhuma mensagem deixada pelo convidado'}
                    </Typography>
                  </Paper>
                }
              />
            </ListItem>
          </List>
        </Box>
        
        <Divider />
        
        {/* Histórico de alterações */}
        <Box sx={{ p: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
            onClick={() => setHistoryExpanded(!historyExpanded)}
            style={{ cursor: 'pointer' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Histórico de Alterações
              </Typography>
            </Box>
            
            <IconButton size="small">
              {historyExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={historyExpanded}>
            {sortedMessages.length > 0 ? (
              <Timeline position="right" sx={{ p: 0, m: 0 }}>
                {sortedMessages.map((message, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ flex: 0.2 }}>
                      <Typography variant="caption" color="text.secondary">
                      {message.createdAt && isValid(new Date(message.createdAt))
                        ? format(new Date(message.createdAt), "dd/MM/yyyy HH:mm")
                        : 'Data não disponível'}
                      </Typography>
                    </TimelineOppositeContent>
                    
                    <TimelineSeparator>
                      <TimelineDot 
                        color={
                          message.type === 'confirmation' 
                            ? message.content.includes('confirmed') ? 'success' : 'error'
                            : 'primary'
                        }
                        variant={message.type === 'confirmation' ? 'filled' : 'outlined'}
                      />
                      {index < sortedMessages.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    
                    <TimelineContent>
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nenhum histórico disponível
              </Typography>
            )}
          </Collapse>
        </Box>
      </CardContent>
      
      {/* Dialog para enviar lembrete */}
      <Dialog
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Lembrete via WhatsApp</DialogTitle>
        
        <DialogContent>
          <DialogContentText paragraph>
            Envie um lembrete personalizado para {guest.name} via WhatsApp.
          </DialogContentText>
          
          <TextField
            autoFocus
            label="Mensagem"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
            placeholder="Olá! Este é um lembrete para confirmar sua presença no evento."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        
        <DialogActions>
          <StyledButton
            onClick={() => setReminderDialogOpen(false)}
            color="inherit"
          >
            Cancelar
          </StyledButton>
          
          <StyledButton
            onClick={handleSendReminder}
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!reminderMessage.trim()}
          >
            Enviar
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RsvpDetailsCard;
