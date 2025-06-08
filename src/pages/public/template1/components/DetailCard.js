import React, { useRef } from 'react';
import { Box, Paper, Typography, Icon, alpha } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { fallbackMinimalTheme } from './themes'; // Use fallback minimal theme

// Refined Framer Motion Variant for consistency
const elegantReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.95 }, // Consistent with HostMessage
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.0, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] }, // Consistent with HostMessage
  }),
};

const DetailCard = ({ icon: IconComponent, title, value, address, theme, index }) => {
  const ref = useRef(null);
  // Trigger animation when 25% of the element is in view
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  // Use passed theme or fallback to imported elegantTheme
  const safeTheme = theme || elegantTheme;

  return (
    <Box
      component={motion.div}
      ref={ref}
      variants={elegantReveal} // Apply the reveal animation
      custom={index} // Use index for staggered animation delay
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // Animate when in view
      // Adjust flex basis for better spacing on medium screens
      sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, display: 'flex', p: { xs: 1, sm: 1.5 } }} // Reduced padding on outer Box
    >
      {/* Use Paper component for background, border, shadow, etc. */}
      <Paper
        elevation={0} // Use theme's shadow via sx or styleOverrides
        component={motion.div}
        // Refined hover effect consistent with CountdownRenderer boxes
        whileHover={{ y: -8, scale: 1.04, boxShadow: `0 20px 50px 0 ${alpha(safeTheme.palette.common.black, 0.4)}` }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }} // Consistent spring animation
        sx={{
          p: { xs: 3, sm: 4, md: 5 }, // Adjusted padding
          textAlign: 'center',
          height: '100%', // Ensure card takes full height of its container
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Align content to the top
          alignItems: 'center',
          width: '100%',
          minHeight: { xs: 280, sm: 320 }, // Adjusted minHeight
          // Apply styles directly, leveraging the theme passed via ThemeProvider or safeTheme
          // Match the refined MuiPaper styleOverrides in themes.js
          background: safeTheme.palette.background.paper,
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: `1px solid ${alpha(safeTheme.palette.secondary.main, 0.2)}`,
          boxShadow: `0 15px 45px 0 ${alpha(safeTheme.palette.common.black, 0.35)}`,
          overflow: 'hidden', // Ensure content respects border radius
        }}
      >
        {/* Icon styling */}
        <Icon component={IconComponent} sx={{ fontSize: { xs: 55, sm: 65 }, mb: 3, color: safeTheme.palette.secondary.main }} />
        {/* Title styling */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2.5, color: safeTheme.palette.text.primary }}>{title}</Typography>
        {/* Value and Address Box */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 80 }}>
          <Typography sx={{ color: safeTheme.palette.text.secondary, fontSize: '1.1rem', lineHeight: 1.7 }}>{value}</Typography>
          {/* Optional Address styling */}
          {address && (
            <Typography variant="body2" sx={{ color: alpha(safeTheme.palette.text.secondary, 0.85), display: 'block', mt: 1.5, fontSize: '0.95rem' }}>{address}</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DetailCard;

