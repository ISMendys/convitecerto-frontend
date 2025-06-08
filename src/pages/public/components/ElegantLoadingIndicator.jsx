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
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(106,27,154,0.95) 0%, rgba(233,30,99,0.85) 100%)',
          color: 'text.primary',
          px: 3,
        }}
      >
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <CircularProgress 
              size={70} 
              thickness={4} 
              sx={{ 
                color: 'secondary.main',
                mb: 3,
              }} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                textAlign: 'center',
                mb: 2,
              }}
            >
              Carregando seu convite
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.8,
                textAlign: 'center',
                maxWidth: 400,
              }}
            >
              Estamos preparando todos os detalhes do seu evento especial...
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ElegantLoadingIndicator;

