import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Componente estilizado para os cards de contagem regressiva
const CountdownCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  height: '140px', // Altura fixa para uniformidade
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

// Variantes de animação para os números
const numberVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Componente de renderização da contagem regressiva
const CountdownRenderer = ({ days, hours, minutes, seconds, completed, theme }) => {
  // Se a contagem regressiva terminou
  if (completed) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
          O evento está acontecendo agora!
        </Typography>
      </Box>
    );
  }

  // Renderização da contagem regressiva
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 3 },
      justifyContent: 'center',
      alignItems: 'stretch'
    }}>
      {/* Dias */}
      <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '120px' } }}>
        <CountdownCard>
          <motion.div
            key={`days-${days}`}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Typography variant="h2" sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', sm: '3rem' },
              lineHeight: 1,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {days}
            </Typography>
          </motion.div>
          <Typography variant="body1" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: 1,
            fontWeight: 500,
            opacity: 0.8,
            fontSize: '0.875rem'
          }}>
            Dias
          </Typography>
        </CountdownCard>
      </Box>

      {/* Horas */}
      <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '120px' } }}>
        <CountdownCard>
          <motion.div
            key={`hours-${hours}`}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Typography variant="h2" sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', sm: '3rem' },
              lineHeight: 1,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {hours}
            </Typography>
          </motion.div>
          <Typography variant="body1" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: 1,
            fontWeight: 500,
            opacity: 0.8,
            fontSize: '0.875rem'
          }}>
            Horas
          </Typography>
        </CountdownCard>
      </Box>

      {/* Minutos */}
      <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '120px' } }}>
        <CountdownCard>
          <motion.div
            key={`minutes-${minutes}`}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Typography variant="h2" sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', sm: '3rem' },
              lineHeight: 1,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {minutes}
            </Typography>
          </motion.div>
          <Typography variant="body1" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: 1,
            fontWeight: 500,
            opacity: 0.8,
            fontSize: '0.875rem'
          }}>
            Minutos
          </Typography>
        </CountdownCard>
      </Box>

      {/* Segundos */}
      <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '120px' } }}>
        <CountdownCard>
          <motion.div
            key={`seconds-${seconds}`}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Typography variant="h2" sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', sm: '3rem' },
              lineHeight: 1,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {seconds}
            </Typography>
          </motion.div>
          <Typography variant="body1" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: 1,
            fontWeight: 500,
            opacity: 0.8,
            fontSize: '0.875rem'
          }}>
            Segundos
          </Typography>
        </CountdownCard>
      </Box>
    </Box>
  );
};

export default CountdownRenderer;

