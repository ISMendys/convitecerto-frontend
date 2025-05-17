import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fallbackMinimalTheme } from './themes'; // Import the fallback minimal theme

// Countdown Renderer (Minimalist Version - No Animation)
const CountdownRenderer = ({ days, hours, minutes, seconds, completed, theme }) => {
  // Use passed theme or fallback to the minimal theme
  const safeTheme = theme || fallbackMinimalTheme;

  // Message displayed when the countdown is completed
  if (completed) {
    return (
      <Typography variant="h5" sx={{ color: safeTheme.palette.secondary.main, fontWeight: 500, textAlign: 'center' }}>
        O evento já começou!
      </Typography>
    );
  }

  // Styles for the individual time unit boxes (Minimalist)
  const timeBoxSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: { xs: 70, sm: 90 }, // Slightly smaller boxes
    minHeight: { xs: 70, sm: 90 },
    p: { xs: 1, sm: 2 },
    // Use theme's paper background and border, no shadow or blur
    background: safeTheme.palette.background.paper,
    borderRadius: safeTheme.shape.borderRadius,
    border: `1px solid ${safeTheme.palette.divider}`,
    color: safeTheme.palette.text.primary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  };

  // Styles for the large number (Minimalist)
  const timeValueSx = {
    fontSize: { xs: '1.8rem', sm: '2.5rem' }, // Adjusted size
    fontWeight: 600, // Slightly less bold
    color: safeTheme.palette.text.primary,
    lineHeight: 1.1,
    fontFamily: safeTheme.typography.fontFamily, // Use theme font family
    mb: 0.5, // Reduced margin
  };

  // Styles for the label (Minimalist)
  const timeLabelSx = {
    fontSize: { xs: '0.7rem', sm: '0.8rem' },
    color: safeTheme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  // Component for a single time unit box (No Animation)
  const TimeBox = ({ value, label }) => {
    const formattedValue = String(value).padStart(2, '0');
    return (
      <Box sx={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', p: { xs: 0.5, sm: 1 } }}>
        {/* Removed motion.div hover effect for pure minimalism */}
        <Box sx={timeBoxSx}>
          {/* Display number directly, no AnimatedDigit component */}
          <Typography sx={timeValueSx}>{formattedValue}</Typography>
          <Typography sx={timeLabelSx}>{label}</Typography>
        </Box>
      </Box>
    );
  };

  // Main return statement rendering the four time boxes
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
      <TimeBox value={days} label="Dias" />
      <TimeBox value={hours} label="Horas" />
      <TimeBox value={minutes} label="Minutos" />
      <TimeBox value={seconds} label="Segundos" />
    </Box>
  );
};

export default CountdownRenderer;

