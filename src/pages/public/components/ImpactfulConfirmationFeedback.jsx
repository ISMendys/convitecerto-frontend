import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Celebration as CelebrationIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { darken } from '@mui/material/styles';

// Variantes de animação para o feedback
const feedbackVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: { 
      duration: 0.8,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 120,
      delay: 0.2
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.4
    }
  }
};

// Componente de feedback visual impactante
const ImpactfulConfirmationFeedback = ({ status, theme }) => {
  if (!status) return null;

  const isConfirmed = status === 'confirmed';
  
  const feedbackConfig = {
    confirmed: {
      icon: CheckCircleIcon,
      primaryColor: '#4caf50',
      secondaryColor: '#66bb6a',
      title: 'Presença Confirmada!',
      subtitle: 'Que alegria ter você conosco!',
      message: 'Sua presença foi confirmada com sucesso. Mal podemos esperar para celebrar este momento especial ao seu lado!',
      bgGradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(102, 187, 106, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      celebration: true
    },
    declined: {
      icon: CancelIcon,
      primaryColor: '#ff6b6b',
      secondaryColor: '#ff8a80',
      title: 'Resposta Registrada',
      subtitle: 'Sentiremos sua falta!',
      message: 'Agradecemos por nos informar. Embora seja uma pena que não possa comparecer, entendemos e respeitamos sua decisão.',
      bgGradient: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 138, 128, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #ff6b6b 0%, #ff8a80 100%)',
      celebration: false
    }
  };

  const config = feedbackConfig[status];
  const IconComponent = config.icon;

  return (
    <motion.div
      variants={feedbackVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={8}
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          textAlign: 'center',
          borderRadius: '24px',
          color: darken(theme.palette.primary.main, 0.3),
          background: config.bgGradient,
          backdropFilter: 'blur(20px)',
          border: `2px solid ${config.primaryColor}40`,
          position: 'relative',
          overflow: 'hidden',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${config.primaryColor}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          }
        }}
      >
        {/* Ícone principal */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: config.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 20px 40px ${config.primaryColor}40`,
            position: 'relative',
            '&::after': config.celebration ? {
              content: '""',
              position: 'absolute',
              top: -10,
              right: -10,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#ffd700',
              animation: 'pulse 2s infinite',
            } : {}
          }}>
            <IconComponent sx={{ 
              fontSize: 60, 
              color: 'white',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }} />
            {config.celebration && (
              <CelebrationIcon sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                fontSize: 35,
                color: '#ffd700',
                animation: 'bounce 1s infinite'
              }} />
            )}
          </Box>
        </motion.div>

        {/* Textos */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2, 
              fontWeight: 800,
              color: darken(theme.palette.primary.main, 0.3),
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              textShadow: `0 2px 4px ${config.primaryColor}30`
            }}
          >
            {config.title}
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 500,
              color: darken(theme.palette.primary.main, 0.3),
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              opacity: 0.9
            }}
          >
            {config.subtitle}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: darken(theme.palette.primary.main, 0.3),
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: 500,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            {config.message}
          </Typography>
        </motion.div>

        {/* Elementos decorativos para confirmação */}
        {config.celebration && (
          <>
            <Box sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ffd700',
              animation: 'float 3s ease-in-out infinite'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 40,
              right: 30,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#ff69b4',
              animation: 'float 3s ease-in-out infinite 1s'
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: 30,
              left: 40,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#00bcd4',
              animation: 'float 3s ease-in-out infinite 2s'
            }} />
          </>
        )}
      </Paper>

      {/* Estilos de animação CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default ImpactfulConfirmationFeedback;

