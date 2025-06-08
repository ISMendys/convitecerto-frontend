import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormatQuote as FormatQuoteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Componente estilizado para o card de mensagem
const MessageCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 5),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
}));

// Componente de ícone de aspas
const QuoteIcon = styled(FormatQuoteIcon)(({ theme, position }) => ({
  position: 'absolute',
  fontSize: 80,
  opacity: 0.1,
  color: theme.palette.primary.main,
  ...(position === 'start' && {
    top: -10,
    left: -10,
    transform: 'rotate(0deg)',
  }),
  ...(position === 'end' && {
    bottom: -10,
    right: -10,
    transform: 'rotate(180deg)',
  }),
}));

// Variantes de animação para o card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

// Componente de mensagem do anfitrião
const HostMessage = ({ message, theme, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Mensagem do Anfitrião
        </Typography>
      </Box>
      
      <MessageCard>
        <QuoteIcon position="start" />
        <QuoteIcon position="end" />
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          lineHeight: 1.8,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          fontStyle: 'italic',
        }}>
          {message}
        </Typography>
      </MessageCard>
    </motion.div>
  );
};

export default HostMessage;

