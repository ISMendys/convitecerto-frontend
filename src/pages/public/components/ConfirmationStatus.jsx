import React from 'react';
import { Box, Typography, Alert, Grow } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Variantes de animação
const statusVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// Componente de status de confirmação
const ConfirmationStatus = ({ status, theme }) => {
  if (!status) return null;

  const isConfirmed = status === 'confirmed';
  
  return (
    <motion.div
      variants={statusVariants}
      initial="hidden"
      animate="visible"
    >
      <Grow in={true}>
        <Alert 
          severity={isConfirmed ? 'success' : 'info'}
          icon={isConfirmed ? <CheckCircleIcon /> : <CancelIcon />}
          sx={{ 
            mb: 4, 
            justifyContent: 'center',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 500,
            background: isConfirmed 
              ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
              : 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            border: `2px solid ${isConfirmed ? '#4caf50' : '#2196f3'}`,
            '& .MuiAlert-message': { 
              fontSize: '1.1rem',
              fontWeight: 500
            },
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {isConfirmed ? 'Presença Confirmada!' : 'Resposta Registrada'}
            </Typography>
            <Typography variant="body1">
              {isConfirmed 
                ? 'Sua presença está confirmada! Agradecemos sua resposta e esperamos vê-lo no evento.' 
                : 'Você indicou que não poderá comparecer. Sentiremos sua falta, mas agradecemos por nos informar.'}
            </Typography>
          </Box>
        </Alert>
      </Grow>
    </motion.div>
  );
};

export default ConfirmationStatus;

