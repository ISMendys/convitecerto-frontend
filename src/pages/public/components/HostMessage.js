import React, { useRef } from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import { FormatQuote as FormatQuoteIcon } from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import { fallbackMinimalTheme } from './themes'; // Use fallback minimal theme

// Framer Motion Variant (ensure consistency or pass as prop)
const elegantReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.95 }, // Slightly increased initial offset
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.0, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] }, // Smoother ease-out
  }),
};

const HostMessage = ({ message, theme, index }) => {
    const ref = useRef(null);
    // Trigger animation when 30% of the element is in view
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    // Use passed theme or fallback to the imported elegantTheme
    const safeTheme = theme || elegantTheme;

    // Don't render the component if there's no message
    if (!message) return null;

    return (
        <Box
            component={motion.div}
            ref={ref}
            variants={elegantReveal} // Apply the reveal animation
            custom={index} // Use index for staggered animation delay
            initial="hidden"
            animate={isInView ? "visible" : "hidden"} // Animate when in view
            sx={{ my: { xs: 8, md: 10 }, textAlign: 'center' }} // Increased vertical margin
        >
            {/* Use Paper component for background, border, shadow, etc. */}
            <Paper
                elevation={0} // Use theme's shadow via sx or styleOverrides
                sx={{
                    p: { xs: 4, sm: 5, md: 6 }, // Increased padding
                    display: 'inline-block', // Allows centering via parent Box
                    maxWidth: '750px', // Slightly wider max width
                    textAlign: 'left', // Align text inside the paper to the left
                    position: 'relative', // Needed for absolute positioning of the quote icon
                    overflow: 'hidden', // Ensure content respects border radius
                    // Apply styles directly, leveraging the theme passed via ThemeProvider or safeTheme
                    // These should ideally match the MuiPaper styleOverrides in the theme for consistency
                    background: safeTheme.palette.background.paper, // Use refined paper background
                    backdropFilter: 'blur(20px)', // Use refined blur
                    borderRadius: '28px', // Use refined border radius
                    border: `1px solid ${alpha(safeTheme.palette.secondary.main, 0.2)}`, // Use refined border
                    boxShadow: `0 15px 45px 0 ${alpha(safeTheme.palette.common.black, 0.35)}`, // Use refined shadow
                    // Add the subtle left border for quote style
                    borderLeft: `5px solid ${alpha(safeTheme.palette.secondary.main, 0.6)}`, // More prominent quote border
                    pl: { xs: 5, sm: 6 }, // Add padding to account for the border-left
                }}
            >
                {/* Quote Icon positioned absolutely */}
                <FormatQuoteIcon sx={{
                    fontSize: { xs: 45, sm: 55 }, // Slightly larger icon
                    color: safeTheme.palette.secondary.main,
                    position: 'absolute',
                    top: -25, // Adjust position
                    left: 20, // Adjust position
                    opacity: 0.4, // Slightly adjusted opacity
                    transform: 'rotate(-10deg)', // Slight rotation for style
                }} />
                {/* Message text using the custom 'quote' variant from the theme */}
                <Typography
                    variant="quote" // Ensure 'quote' variant is defined in theme typography
                    sx={{ color: safeTheme.palette.text.primary }} // Use primary text color
                >
                    {message}
                </Typography>
            </Paper>
        </Box>
    );
};

export default HostMessage;

