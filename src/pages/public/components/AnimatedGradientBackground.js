import React from 'react';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material';
import { elegantTheme } from './themes'; // Assuming themes.js contains the theme config

const AnimatedGradientBackground = ({ theme }) => {
  // Use the passed theme or fallback to the imported elegantTheme
  const safeTheme = theme || elegantTheme;

  // Define gradient stops using refined theme colors
  const color1 = alpha(safeTheme.palette.primary.main, 0.98); // Deep base
  const color2 = alpha(safeTheme.palette.secondary.main, 0.15); // Subtle gold shimmer
  const color3 = alpha(safeTheme.palette.primary.main, 0.95); // Slightly lighter base
  const color4 = alpha(safeTheme.palette.secondary.main, 0.10); // Even subtler gold

  // Create a more dynamic gradient with multiple stops and a different angle
  const gradient = `linear-gradient(135deg, ${color1}, ${color2}, ${color3}, ${color4}, ${color1})`;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -2, // Ensure it's behind particles and content
        background: gradient,
        backgroundSize: '600% 600%', // Larger size for smoother animation
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'], // Horizontal movement
      }}
      transition={{
        duration: 65, // Slightly slower duration for a calmer effect
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
    />
  );
};

export default AnimatedGradientBackground;

