import React from 'react';
import { Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { fallbackMinimalTheme } from './themes'; // Use fallback minimal theme

const loadingContainerVariants = {
  start: { transition: { staggerChildren: 0.12 } },
  end: { transition: { staggerChildren: 0.12 } },
};

const loadingCircleVariants = {
  start: { y: "0%" },
  end: { y: "100%" },
};

const loadingCircleTransition = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
};

const ElegantLoadingIndicator = ({ theme }) => {
  const safeTheme = theme || elegantTheme;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: safeTheme.palette.primary.main, color: safeTheme.palette.text.primary, position: 'relative' }}>
      <motion.div
        style={{
          width: '5rem',
          height: '1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          zIndex: 1,
        }}
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            style={{
              display: 'block',
              width: '1rem',
              height: '1rem',
              backgroundColor: alpha(safeTheme.palette.secondary.main, 0.9),
              borderRadius: '50%',
            }}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
        ))}
      </motion.div>
    </Box>
  );
};

export default ElegantLoadingIndicator;
