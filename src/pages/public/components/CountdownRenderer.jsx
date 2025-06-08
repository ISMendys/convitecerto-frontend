import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Componente estilizado para os cards de contagem regressiva
const CountdownCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  height: '100%',
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
    <Grid container spacing={3} justifyContent="center">
      {/* Dias */}
      <Grid item xs={6} sm={3}>
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
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
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
          }}>
            Dias
          </Typography>
        </CountdownCard>
      </Grid>

      {/* Horas */}
      <Grid item xs={6} sm={3}>
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
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
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
          }}>
            Horas
          </Typography>
        </CountdownCard>
      </Grid>

      {/* Minutos */}
      <Grid item xs={6} sm={3}>
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
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
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
          }}>
            Minutos
          </Typography>
        </CountdownCard>
      </Grid>

      {/* Segundos */}
      <Grid item xs={6} sm={3}>
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
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
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
          }}>
            Segundos
          </Typography>
        </CountdownCard>
      </Grid>
    </Grid>
  );
};

export default CountdownRenderer;

