import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled, darken } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Componente estilizado para o card de detalhes
const StyledDetailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

// Componente de ícone estilizado (sem alterações)
const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
  flexShrink: 0,
}));

// Variantes de animação para o card (sem alterações)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

// Componente de card de detalhes
const DetailCard = ({ icon: Icon, title, value, theme, index }) => {
  return (
    // <-- ALTERAÇÃO 2: A motion.div também precisa preencher 100% do seu container
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      style={{ width: '100%', height: '100%' }}
    >
      <StyledDetailCard>
        <IconWrapper>
          {<Icon sx={{ fontSize: 30, color: 'white' }} />}
        </IconWrapper>
        <Typography variant="h6" sx={{ 
          mb: 1, 
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: '1rem',
          color: darken(theme.palette.primary.main, 0.3),
          flexShrink: 0 
        }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          fontWeight: 400,
          lineHeight: 1.4,
          fontSize: '0.875rem',
          wordBreak: 'break-word',
          hyphens: 'auto',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          color: darken(theme.palette.primary.main, 0.3),
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
        }}>
          {value}
        </Typography>
      </StyledDetailCard>
    </motion.div>
  );
};

export default DetailCard;