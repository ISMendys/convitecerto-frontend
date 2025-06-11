import React from 'react';
import { Box, CircularProgress, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';

// Variantes de animação para o indicador de carregamento
const loadingVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Componente de indicador de carregamento elegante
const ElegantLoadingIndicator = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          background: 'linear-gradient(135deg, rgba(106,27,154,0.95) 0%, rgba(233,30,99,0.85) 100%)',
          color: 'text.primary',
          zIndex: 9999,
        }}
      >
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <motion.div variants={itemVariants}>
            <CircularProgress 
              size={70} 
              thickness={4}
              sx={{ 
                color: 'text.primary',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 500,
                textAlign: 'center',
                letterSpacing: '0.5px'
              }}
            >
              Carregando seu convite...
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: 300
              }}
            >
              Preparando uma experiência especial para você
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ElegantLoadingIndicator;

