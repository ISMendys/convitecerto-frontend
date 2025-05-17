import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Adicionar useDispatch
import { sendWhatsappReminder } from '../store/actions/whatsappActions'; // Adicionar action

import { useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Paper, Avatar, Chip, IconButton, Badge, Divider, Checkbox, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material'; // Adicionar CircularProgress
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  MoreVert as MoreVertIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Utility function for generating colors
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * Componente de card de convidado para o dashboard
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.guest - Dados do convidado
 * @param {Object} props.event - Dados do evento
 * @param {Function} props.onViewDetails - Função para visualizar detalhes
 * @param {Function} props.onMenuOpen - Função para abrir menu de ações
 */
// const GuestCard = ({ guest, event, onViewDetails, onMenuOpen }) => {
const GuestCard = ({ 
    guest, 
    selected, 
    onSelect, 
    onMenuOpen, 
    onDelete,
    groups,
    eventId,
    navigate,
    // Adicionar props para feedback (snackbar)
    showSnackbar // Ex: (message, severity) => void
  }) => {
    const theme = useTheme();
    const dispatch = useDispatch(); // Adicionar dispatch
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isSending, setIsSending] = useState(false); // Adicionar estado de envio
    
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
    
    // Encontrar o nome do grupo
    const groupName = groups.find(g => g.id === guest.group)?.name || guest.group;
    
    // Manipular clique no botão excluir
    const handleDeleteClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDeleteConfirmOpen(true);
    };
    
    // Confirmar exclusão
    const handleConfirmDelete = () => {
      setDeleteConfirmOpen(false);
      onDelete(guest);
    };
    
    // Adicionar função para enviar mensagem individual
    const handleSendIndividualMessage = async (e) => {
      e.preventDefault();
      e.stopPropagation(); // Evitar que o clique selecione/desselecione o card
      
      if (!guest || !guest.id || !guest.phone) {
        if (showSnackbar) {
          showSnackbar("Convidado inválido ou sem número de telefone para envio.", "warning");
        } else {
          console.error("Convidado inválido ou sem número de telefone para envio.");
        }
        return;
      }
      
      setIsSending(true);
      try {
        // Mensagem padrão - pode ser personalizada ou vir de um diálogo/prop no futuro
        const message = `Olá ${guest.name}, apenas um lembrete sobre nosso evento!`; 
        const payload = {
          guestId: guest.id,
          message: message
        };
        await dispatch(sendWhatsappReminder(payload)).unwrap();
        
        if (showSnackbar) {
          showSnackbar(`Mensagem enviada com sucesso para ${guest.name}!`, "success");
        } else {
          console.log(`Mensagem enviada com sucesso para ${guest.name}!`);
        }
        
      } catch (err) {
        if (showSnackbar) {
          showSnackbar(`Erro ao enviar mensagem para ${guest.name}: ${err}`, "error");
        } else {
          console.error(`Erro ao enviar mensagem para ${guest.name}:`, err);
        }
      } finally {
        setIsSending(false);
      }
    };
    
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
          maxWidth: '100%',
          position: 'relative',
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          outline: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
        }}
      >
        {/* Badge de convite vinculado */}
        {guest.inviteId && (
          <Badge
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              '& .MuiBadge-badge': {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                width: 22,
                height: 22,
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }
            }}
            badgeContent={<LinkIcon sx={{ fontSize: 12 }} />}
          />
        )}
        
        {/* Cabeçalho do card */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            icon={getStatusIcon(guest.status)}
            label={getStatusText(guest.status)}
            size="small"
            sx={{ 
              borderRadius: 8,
              color: guest.status === 'confirmed' 
                ? theme.palette.success.main
                : guest.status === 'pending'
                  ? theme.palette.warning.main
                  : theme.palette.error.main,
              backgroundColor: guest.status === 'confirmed' 
                ? alpha(theme.palette.success.main, 0.2)
                : guest.status === 'pending'
                  ? alpha(theme.palette.warning.main, 0.2)
                  : alpha(theme.palette.error.main, 0.2)
            }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMenuOpen(e, guest);
            }}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Informações do convidado */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={guest.image || guest.imageUrl || ''}
            sx={{
              bgcolor: stringToColor(guest.name),
              width: 56,
              height: 56,
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
                label={groupName}
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
        
        {/* Linha separadora */}
        <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.6) }} />
        
        {/* Informações de contato */}
        <Box sx={{ mb: 'auto' }}>
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
        
        {/* Rodapé com checkbox e botão excluir */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Checkbox
            checked={selected}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(guest.id);
            }}
            color="primary"
          />
          
          {/* Adicionar grupo de botões de ação */}
          <Box>
            <Tooltip title="Enviar Mensagem WhatsApp">
              {/* Envolver o botão com span para o tooltip funcionar quando desabilitado */}
              <span> 
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={handleSendIndividualMessage}
                  disabled={isSending || !guest.phone} // Desabilitar se enviando ou sem telefone
                  sx={{
                    mr: 1, // Adicionar margem à direita
                    bgcolor: isSending ? alpha(theme.palette.action.disabledBackground, 0.5) : alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: !isSending ? alpha(theme.palette.primary.main, 0.2) : undefined,
                    },
                  }}
                >
                  {isSending ? <CircularProgress size={16} /> : <SendIcon fontSize="small" sx={{color: theme.palette.success.main}}/>}
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Excluir convidado">
              <IconButton 
                size="small" 
                color="error"
                onClick={handleDeleteClick}
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  }
                }}
              >
                <DeleteIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: theme.palette.error.main, 
            color: 'white',
            pb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 1 }} />
              Confirmar Exclusão
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText>
              Tem certeza que deseja excluir o convidado <strong>{guest.name}</strong>? Esta ação não poderá ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)} 
              variant="outlined"
              color="inherit"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              variant="contained" 
              color="error"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
                background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
              }}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  };
  

export default GuestCard;
