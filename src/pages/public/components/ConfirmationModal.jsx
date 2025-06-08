import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  Avatar, 
  Zoom 
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

// Componente de modal de confirmação
const ConfirmationModal = ({ open, onClose, onConfirm, onDecline, theme }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#333' }}>
        Confirmar Presença
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, color: '#555' }}>
            Sua resposta é muito importante para nós! Por favor, confirme se poderemos contar com sua presença neste dia especial.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: '#4caf50',
                    boxShadow: '0 12px 20px rgba(76, 175, 80, 0.2)',
                  }
                }}
                onClick={onConfirm}
              >
                <Box sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: '#4caf50' }}>
                    <CheckCircleIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                  Confirmar Presença
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Sim, estarei presente neste evento especial!
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: '#f44336',
                    boxShadow: '0 12px 20px rgba(244, 67, 54, 0.2)',
                  }
                }}
                onClick={onDecline}
              >
                <Box sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: '#f44336' }}>
                    <CancelIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                  Não Poderei Comparecer
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Infelizmente não poderei estar presente.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

