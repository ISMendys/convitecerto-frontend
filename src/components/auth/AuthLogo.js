import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CelebrationIcon from '@mui/icons-material/Celebration';

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const LogoIcon = styled(CelebrationIcon)(({ theme }) => ({
  fontSize: 56,
  color: theme.palette.primary.main,
  filter: `drop-shadow(0 4px 6px ${theme.palette.primary.dark}40)`,
  animation: 'pulse 2s infinite ease-in-out',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.8rem',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginTop: theme.spacing(1),
  letterSpacing: '0.5px',
  filter: `drop-shadow(0 2px 3px ${theme.palette.primary.dark}30)`,
}));

const LogoTagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  marginTop: theme.spacing(0.5),
  fontWeight: 400,
  letterSpacing: '0.3px',
}));

const AuthLogo = () => {
  return (
    <LogoWrapper>
      <LogoIcon />
      <LogoText variant="h4">ConviteCerto</LogoText>
      <LogoTagline variant="body2">Celebre momentos especiais com elegância</LogoTagline>
    </LogoWrapper>
  );
};

export default AuthLogo;
