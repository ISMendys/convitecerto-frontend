import React from 'react';
import { Box, Typography, Avatar, Grow } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

// Componente para exibir o status de confirmação
const ConfirmationStatus = ({ status, theme }) => {
  if (!status) return null;

  const isConfirmed = status === 'confirmed';
  
  return (
    <Grow in={true}>
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: isConfirmed 
          ? 'rgba(76, 175, 80, 0.1)' 
          : 'rgba(244, 67, 54, 0.1)',
        border: `1px solid ${isConfirmed ? '#4caf50' : '#f44336'}`,
      }}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            mb: 2,
            backgroundColor: isConfirmed ? '#4caf50' : '#f44336',
            boxShadow: `0 8px 24px ${isConfirmed ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
          }}
        >
          {isConfirmed 
            ? <CheckCircleIcon sx={{ fontSize: 60 }} /> 
            : <CancelIcon sx={{ fontSize: 60 }} />}
        </Avatar>
        
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          {isConfirmed 
            ? 'Presença Confirmada!' 
            : 'Não Poderá Comparecer'}
        </Typography>
        
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {isConfirmed 
            ? 'Agradecemos sua confirmação. Estamos ansiosos para recebê-lo!' 
            : 'Sentiremos sua falta! Obrigado por nos informar.'}
        </Typography>
      </Box>
    </Grow>
  );
};

export default ConfirmationStatus;

