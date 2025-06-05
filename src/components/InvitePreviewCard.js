
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button, useTheme, Fade, Grow, Divider } from '@mui/material';

// Helper functions
const random = (min, max) => Math.random() * (max - min) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Componente de visualização de convite com confirmação, animações e estética aprimoradas
 *
 * @param {Object} props
 * @param {Object} props.inviteData - Dados do convite (opcional)
 */
const InvitePreviewCard = ({
  inviteData = {
    title: "Ana & Carlos",
    subtitle: "Convidam para seu casamento",
    date: "Sábado, 15 de Outubro • 19:30",
    location: "Espaço Villa Garden",
    address: "Rua das Flores, 123 - São Paulo"
  }
}) => {
  const theme = useTheme();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showBackContent, setShowBackContent] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cardContainerRef = useRef(null);

  // --- Confetti Logic (Refined) ---
  const createConfettiParticle = useCallback((canvasWidth, headerHeight) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.primary.light,
      theme.palette.secondary.light,
      '#FFD700', // Gold
      '#FFACAC', // Light Pink
      '#ACE5EE', // Light Blue
      '#FFFFFF'  // White
    ];
    const shapes = ['rect', 'circle', 'line'];
    const shape = randomChoice(shapes);
    let width, height;

    if (shape === 'line') {
      width = random(1, 2.5); height = random(8, 18);
    } else {
      width = random(4, 10); // Smaller confetti
      height = shape === 'rect' ? random(4, 7) : width;
    }

    const startY = random(-headerHeight * 0.1, headerHeight * 0.4);
    const startX = random(canvasWidth * 0.05, canvasWidth * 0.95);

    return {
      x: startX, y: startY, width: width, height: height, shape: shape,
      speedX: random(-0.8, 0.8),
      speedY: random(0.6, 2.0),
      color: randomChoice(colors),
      opacity: random(0.7, 1),
      rotation: random(0, 360),
      rotationSpeed: random(-1.2, 1.2),
      life: 1,
      decay: random(0.005, 0.012)
    };
  }, [theme]);

  const animateConfetti = useCallback(() => {
    if (!canvasRef.current || !isConfirmed) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      setConfetti([]);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const estimatedHeaderHeight = height * 0.3;

    ctx.clearRect(0, 0, width, estimatedHeaderHeight * 1.8);

    if (confetti.length < 80 && Math.random() < 0.15) {
      for (let i = 0; i < random(1, 3); i++) {
         setConfetti(prev => [...prev, createConfettiParticle(width, estimatedHeaderHeight)]);
      }
    }

    let needsMoreAnimation = false;
    const updatedConfetti = confetti.map(particle => {
      if (particle.life <= 0) return null;
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.rotation += particle.rotationSpeed;
      particle.life -= particle.decay;
      if (particle.life <= 0 || particle.y > estimatedHeaderHeight * 1.6) return null;

      ctx.save();
      ctx.translate(particle.x + particle.width / 2, particle.y + particle.height / 2);
      ctx.rotate(particle.rotation * Math.PI / 180);
      ctx.globalAlpha = particle.life * particle.opacity;
      ctx.fillStyle = particle.color;
      if (particle.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, particle.width / 2, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
      }
      ctx.restore();
      needsMoreAnimation = true;
      return particle;
    }).filter(p => p !== null);

    setConfetti(updatedConfetti);

    if (isConfirmed && needsMoreAnimation) {
      animationFrameRef.current = requestAnimationFrame(animateConfetti);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [isConfirmed, createConfettiParticle, confetti.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let observer = null;
    const handleResize = () => {
      if (canvas && cardContainerRef.current) {
        canvas.width = cardContainerRef.current.offsetWidth;
        canvas.height = cardContainerRef.current.offsetHeight;
        if (isConfirmed && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animateConfetti);
        }
      }
    };
    if (cardContainerRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(cardContainerRef.current);
    }
    handleResize();
    if (isConfirmed && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateConfetti);
    }
    return () => {
      if (observer && cardContainerRef.current) observer.unobserve(cardContainerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [isConfirmed, animateConfetti]);

  // --- Confirmation Logic (Single Flip) ---
  const handleConfirmClick = () => {
    if (isFlipping || isConfirmed) return;
    setIsFlipping(true);
    setTimeout(() => {
      setIsConfirmed(true);
      setShowBackContent(true);
    }, 350); // Start content animation slightly before flip ends
    // No need to set isFlipping false, isConfirmed controls the final state
  };

  // --- Styles (Final Polish) ---
  const cardWrapperStyle = {
    position: 'relative',
    width: '100%',
    minHeight: { xs: '440px', sm: '480px', md: '540px' },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '1500px',
    p: { xs: 2, sm: 3 },
  };

  const cardFlipperStyle = {
    width: '90%',
    maxWidth: 500,
    height: '100%',
    position: 'relative',
    transition: 'transform 0.9s cubic-bezier(0.68, -0.6, 0.32, 1.6)', // Adjusted flip curve
    transformStyle: 'preserve-3d',
    transform: isConfirmed ? 'rotateY(180deg)' : 'rotateY(0deg)',
    minHeight: { xs: '440px', sm: '480px', md: '540px' },
  };

  const cardFaceBaseStyle = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex', flexDirection: 'column',
    backgroundColor: 'white', // Use theme background paper
    borderRadius: 6, // Slightly more rounded
    boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.15)', // Refined shadow
    overflow: 'hidden',
  };

  const cardFrontStyle = { ...cardFaceBaseStyle, zIndex: isConfirmed ? 1 : 2, transform: 'rotateY(0deg)' };
  const cardBackStyle = {
    ...cardFaceBaseStyle,
    zIndex: isConfirmed ? 2 : 1,
    transform: 'rotateY(180deg)',
    animation: isConfirmed ? 'floatEnhanced 5.5s cubic-bezier(0.45, 0, 0.55, 1) infinite' : 'none',
    '@keyframes floatEnhanced': {
      '0%, 100%': { transform: 'translateY(0px) rotateY(180deg) rotateZ(0deg)' },
      '50%': { transform: 'translateY(-10px) rotateY(180deg) rotateZ(0.8deg)' }, // Adjusted float
    }
  };

  // Subtle background pattern for the back card body
  const backBodyBackground = {
    // Subtle noise pattern
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%239C92AC\' fill-opacity=\'0.04\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat',
  };

  // --- Render ---
  return (
    <Box sx={cardWrapperStyle} ref={cardContainerRef}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }} />
      <Box sx={cardFlipperStyle}>
        {/* Card Front */} 
        <Box sx={cardFrontStyle}>
          <Box sx={{ background: `linear-gradient(140deg, ${'#5e35b1'} 0%, ${theme.palette.secondary.dark} 100%)`, p: { xs: 3, sm: 4 }, position: 'relative', textAlign: 'center', color: 'white' }}>
            <Typography variant="overline" sx={{ letterSpacing: 3.5, mb: 1, fontWeight: 300, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>CONVITE</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.7rem' }, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{inviteData.title}</Typography>
            <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 300, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{inviteData.subtitle}</Typography>
            <Box sx={{ position: 'absolute', top: 18, left: 18, width: 38, height: 38, borderTop: `1.5px solid ${theme.palette.common.white}99`, borderLeft: `1.5px solid ${theme.palette.common.white}99` }} />
            <Box sx={{ position: 'absolute', bottom: 18, right: 18, width: 38, height: 38, borderBottom: `1.5px solid ${theme.palette.common.white}99`, borderRight: `1.5px solid ${theme.palette.common.white}99` }} />
          </Box>
          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2.5, color: theme.palette.primary.dark, fontSize: { xs: '1.25rem', sm: '1.45rem' }, fontWeight: 600 }}>{inviteData.date}</Typography>
            <Typography variant="body1" sx={{ color: 'rgb(140, 0, 233)', fontWeight: 500, fontSize: '1.18rem', mb: 0.5 }}>{inviteData.location}</Typography>
            <Typography variant="body2" sx={{ color: 'rgb(140, 0, 233)', mb: 3.5, fontSize: '0.95rem' }}>{inviteData.address}</Typography>
            <Button variant="contained" color="primary" onClick={handleConfirmClick} disabled={isFlipping || isConfirmed}
              sx={{ alignSelf: 'center', borderRadius: 50, px: 5, py: 1.5, fontWeight: 600, fontSize: '1rem', boxShadow: '0 6px 18px -5px rgba(0, 123, 255, 0.5)', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 22px -6px rgba(0, 123, 255, 0.6)', transform: 'translateY(-3px)' }, opacity: isConfirmed ? 0 : 1, pointerEvents: isConfirmed ? 'none' : 'auto' }}>
              Confirmar Presença
            </Button>
          </Box>
        </Box>

        {/* Card Back */} 
        <Box sx={cardBackStyle}>
          <Box sx={{ background: `linear-gradient(140deg, ${'rgb(181, 99, 236)'} 0%, ${'#3c1f80'} 100%)`, p: { xs: 3, sm: 4 }, position: 'relative', textAlign: 'center', color: 'white', overflow: 'hidden' }}>
            {/* Staggered Grow animation for header texts */} 
            <Grow in={showBackContent} timeout={600} style={{ transformOrigin: '50% 0%' }}>
              <Typography variant="overline" sx={{ letterSpacing: 3.5, mb: 1, fontWeight: 300, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>PRESENÇA CONFIRMADA!</Typography>
            </Grow>
            <Grow in={showBackContent} timeout={800} style={{ transformOrigin: '50% 0%' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.7rem' }, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{inviteData.title}</Typography>
            </Grow>
            <Grow in={showBackContent} timeout={1000} style={{ transformOrigin: '50% 0%' }}>
              <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 300, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>Estamos ansiosos para celebrar com você!</Typography>
            </Grow>
            <Box sx={{ position: 'absolute', top: 18, left: 18, width: 38, height: 38, borderTop: `1.5px solid ${theme.palette.common.white}99`, borderLeft: `1.5px solid ${theme.palette.common.white}99` }} />
            <Box sx={{ position: 'absolute', bottom: 18, right: 18, width: 38, height: 38, borderBottom: `1.5px solid ${theme.palette.common.white}99`, borderRight: `1.5px solid ${theme.palette.common.white}99` }} />
          </Box>
          {/* Body with subtle background and corrected text colors */} 
          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', ...backBodyBackground }}>
            {/* Shine effect */} 
            <Box sx={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-25deg)', animation: 'shimmer 7s infinite linear', zIndex: 1, '@keyframes shimmer': { '0%': { left: '-100%' }, '50%': { left: '150%' }, '100%': { left: '150%' } } }} />
            {/* Staggered Fade animation for body texts */} 
            <Fade in={showBackContent} timeout={1200}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Corrected text colors for legibility */} 
                <Typography variant="h6" sx={{ mb: 2.5, color: theme.palette.primary.dark, fontSize: { xs: '1.25rem', sm: '1.45rem' }, fontWeight: 600 }}>{inviteData.date}</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ color: theme.palette.primary.dark, fontWeight: 500, fontSize: '1.18rem', mb: 0.5 }}>{inviteData.location}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.primary.dark, fontSize: '0.95rem' }}>{inviteData.address}</Typography>
                </Box>
                <Divider sx={{ my: 2.5, mx: 'auto', width: '50%', opacity: 0.5 }} />
                <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, backgroundColor: 'transparent' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(181, 99, 236)', fontStyle: 'italic', fontSize: '0.9rem' }}>"Sua presença é o nosso maior presente!"</Typography>
                </Box>
                <Typography variant="caption" sx={{ mt: 3, color: 'rgb(181, 99, 236)', fontWeight: 400 }}>Um lembrete será enviado próximo à data.</Typography>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InvitePreviewCard;

