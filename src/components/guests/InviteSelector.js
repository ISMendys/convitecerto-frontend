import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Mail as MailIcon,
  Add as AddIcon,
  Link as LinkIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { fetchInvites } from '../../store/actions/inviteActions';
import StyledButton from '../StyledButton';

/**
 * Componente para selecionar um convite para vincular a um convidado
 * Mantém o estilo visual original do sistema
 */
const InviteSelector = ({ value, onChange, eventId, error, helperText }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { invites, loading } = useSelector(state => state.invites);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  
  // Carregar convites do evento quando o componente montar
  useEffect(() => {
    if (eventId) {
      dispatch(fetchInvites(eventId));
    }
  }, [dispatch, eventId]);
  
  // Atualizar o convite selecionado quando o valor mudar externamente
  useEffect(() => {
    if (value && invites.length > 0) {
      const invite = invites.find(invite => invite.id === value);
      setSelectedInvite(invite || null);
    } else {
      setSelectedInvite(null);
    }
  }, [value, invites]);
  
  // Abrir o diálogo de seleção de convite
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  // Fechar o diálogo de seleção de convite
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Selecionar um convite
  const handleSelectInvite = (invite) => {
    setSelectedInvite(invite);
    onChange(invite.id);
    setDialogOpen(false);
  };
  
  // Limpar a seleção
  const handleClearSelection = () => {
    setSelectedInvite(null);
    onChange(null);
  };
  
  // Renderizar o chip do convite selecionado
  const renderSelectedInvite = () => {
    if (!selectedInvite) return null;
    
    return (
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
        <Chip
          icon={<MailIcon />}
          label={selectedInvite.title}
          color="primary"
          variant="outlined"
          onDelete={handleClearSelection}
          sx={{ 
            mr: 1,
            borderRadius: 2,
            '& .MuiChip-deleteIcon': {
              color: theme.palette.primary.main,
              '&:hover': {
                color: theme.palette.primary.dark
              }
            }
          }}
        />
        <Typography variant="caption" color="text.secondary">
          ID: {selectedInvite.id.substring(0, 8)}...
        </Typography>
      </Box>
    );
  };
  
  // Renderizar o diálogo de seleção de convite
  const renderInviteDialog = () => {
    return (
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight={600} color="primary.main">
            Selecionar Convite
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha um convite para vincular a este convidado
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={40} thickness={4} />
            </Box>
          ) : invites.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 3, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}>
              <Typography variant="body1" gutterBottom>
                Nenhum convite encontrado para este evento.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crie um convite primeiro para poder vinculá-lo aos convidados.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', m: -1 }}> {/* m: -1 para spacing={2} */}
            {invites.map(invite => (
              <Box 
                key={invite.id} 
                sx={{ 
                  p: 1, // p: 1 para spacing={2}
                  width: { xs: '100%', sm: '50%', md: 'calc(100% / 3)' } 
                }}
              >
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: selectedInvite?.id === invite.id 
                      ? `2px solid ${theme.palette.primary.main}` 
                      : '2px solid transparent',
                    boxShadow: selectedInvite?.id === invite.id
                      ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      : '0 2px 8px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => handleSelectInvite(invite)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={invite.imageUrl || 'https://picsum.photos/400/200?random=1'}
                    alt={invite.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap fontWeight={600}>
                      {invite.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {invite.description || 'Sem descrição'}
                    </Typography>
                    
                    {selectedInvite?.id === invite.id && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.9),
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <CheckIcon sx={{ color: 'white' }} />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <StyledButton 
            variant="outlined" 
            color="inherit" 
            onClick={handleCloseDialog}
          >
            Cancelar
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="primary" 
            onClick={() => selectedInvite && handleSelectInvite(selectedInvite)}
            disabled={!selectedInvite}
          >
            Selecionar
          </StyledButton>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 1,
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
      }}>
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            mr: 1.5
          }}
        >
          <MailIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          Convite Associado
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Vincule este convidado a um convite para que ele possa acessar a página de RSVP
        </Typography>
        
        <StyledButton
          variant="outlined"
          color="primary"
          startIcon={selectedInvite ? <LinkIcon /> : <AddIcon />}
          onClick={handleOpenDialog}
          fullWidth
          sx={{ 
            mt: 1,
            borderRadius: 2,
            py: 1,
            fontWeight: 500,
            borderWidth: error ? 2 : 1,
            borderColor: error ? theme.palette.error.main : undefined,
            '&:hover': {
              borderWidth: error ? 2 : 1,
              borderColor: error ? theme.palette.error.main : undefined,
            }
          }}
        >
          {selectedInvite ? 'Alterar Convite' : 'Selecionar Convite'}
        </StyledButton>
        
        {renderSelectedInvite()}
        
        {error && (
          <FormHelperText error sx={{ mt: 1, ml: 1.5 }}>
            {helperText || 'Por favor, selecione um convite'}
          </FormHelperText>
        )}
      </Box>
      
      {renderInviteDialog()}
    </Box>
  );
};

export default InviteSelector;
