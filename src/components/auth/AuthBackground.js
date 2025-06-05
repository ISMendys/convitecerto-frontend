import React from 'react';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AuthBackground = () => {
  const theme = useTheme();

  // Define gradient stops using theme colors
  const color1 = alpha(theme.palette.primary.main, 0.9);
  const color2 = alpha(theme.palette.secondary.main, 0.2);
  const color3 = alpha(theme.palette.primary.light, 0.7);
  const color4 = alpha(theme.palette.secondary.light, 0.3);

  // Create a dynamic gradient with multiple stops
  const gradient = `linear-gradient(135deg, ${color1}, ${color2}, ${color3}, ${color4}, ${color1})`;

  return (
    <>
      {/* Animated gradient background */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          background: gradient,
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      />
      
      {/* Decorative elements - envelope pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
    </>
  );
};

export default AuthBackground;
