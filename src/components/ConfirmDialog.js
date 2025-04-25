import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Componente de diálogo de confirmação reutilizável
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar',
  message = 'Tem certeza que deseja continuar?',
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  confirmColor = 'primary',
  fullWidth = true,
  maxWidth = 'sm'
}) => {
  const theme = useTheme();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          variant="outlined"
          sx={{ borderRadius: 4 }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmColor} 
          variant="contained" 
          autoFocus
          sx={{ borderRadius: 4 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
