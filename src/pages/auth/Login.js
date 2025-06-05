
import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Paper // Import Paper for the form card
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined as EmailIcon, // Use Outlined icons for consistency
  LockOutlined as LockIcon // Use Outlined icons for consistency
} from '@mui/icons-material';
import { loginUser } from '../../store/actions/authActions'; // Adjust path if needed

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // Trigger entrance animation shortly after mount
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData.email, formData.password));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Enhanced Animated background elements (more subtle)
  const backgroundElements = [
    { size: '40vmax', top: '-10%', left: '-10%', delay: 0, color: theme.palette.primary.main, opacity: 0.08 },
    { size: '35vmax', top: '50%', left: '70%', delay: 0.2, color: theme.palette.secondary.main, opacity: 0.06 },
    { size: '20vmax', top: '75%', left: '5%', delay: 0.4, color: theme.palette.primary.dark, opacity: 0.05 },
    { size: '15vmax', top: '5%', left: '60%', delay: 0.6, color: theme.palette.secondary.dark, opacity: 0.04 }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden', // Keep hidden to contain background elements
        background: `linear-gradient(135deg, ${'#3c1f80'} 0%, ${'#5e35b1'} 50%, ${'#4d2c91'} 100%)`,
        alignItems: 'center', // Center content vertically
        justifyContent: 'center', // Center content horizontally
        py: { xs: 4, md: 6 } // Add vertical padding
      }}
    >
      {/* Animated background elements */}
      {backgroundElements.map((el, index) => (
        <Fade
          key={index}
          in={animateIn}
          timeout={1500} // Slower fade-in
          style={{
            transitionDelay: `${el.delay * 1000}ms`,
            position: 'absolute',
            top: el.top,
            left: el.left,
            zIndex: 0,
            transform: 'translate(-50%, -50%)' // Center the origin
          }}
        >
          <Box
            sx={{
              width: el.size,
              height: el.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${el.color}${Math.round(el.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              animation: 'subtlePulse 10s infinite ease-in-out alternate',
              animationDelay: `${index * 1.5}s`,
              '@keyframes subtlePulse': {
                '0%': { transform: 'scale(1)', opacity: el.opacity },
                '100%': { transform: 'scale(1.08)', opacity: el.opacity * 0.8 },
              }
            }}
          />
        </Fade>
      ))}

      {/* Content Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1100px', // Slightly reduced max width
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-around', // Use space-around for better distribution
          p: { xs: 2, sm: 4 }, // Adjusted padding
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left side - Branding */}
        <Slide direction="right" in={animateIn} timeout={1000} mountOnEnter unmountOnExit>
          <Box
            sx={{
              flexBasis: { xs: '100%', md: '50%' }, // Use flex-basis
              mb: { xs: 5, md: 0 },
              pr: { xs: 0, md: 6 }, // Add padding to the right on desktop
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {/* Simplified Logo/Brand Name */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                ConviteCerto
              </Typography>
            </Box>

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700, // Slightly less heavy
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 2,
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              Bem-vindo de volta!
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 300, // Lighter weight
                mb: { xs: 4, md: 6 },
                color: 'rgba(255, 255, 255, 0.85)', // Slightly less opaque
                maxWidth: 450,
                mx: { xs: 'auto', md: 0 }, // Center on mobile
                lineHeight: 1.6
              }}
            >
              Acesse sua conta para gerenciar seus eventos e convites digitais com facilidade.
            </Typography>

            {/* Link to Register - visible only on desktop */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                mt: 4
              }}
            >
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1.5 }}>
                Não tem uma conta?
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                size="medium"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 50,
                  px: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Criar Conta
              </Button>
            </Box>
          </Box>
        </Slide>

        {/* Right side - Login Form */}
        <Slide direction="left" in={animateIn} timeout={1000} mountOnEnter unmountOnExit>
          {/* Use Paper for a cleaner card look */}
          <Paper
            elevation={12} // Increased elevation
            sx={{
              flexBasis: { xs: '100%', md: '45%' },
              // Use a slightly less transparent background for better contrast
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: 3, // Consistent border radius
              p: { xs: 3, sm: 4, md: 5 }, // Responsive padding
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
              width: '100%',
              maxWidth: { xs: 400, md: 420 }, // Max width for form
              mx: 'auto' // Center form card on mobile
            }}
          >
            <Typography variant="h4" component="h3" sx={{ mb: 1, fontWeight: 700, color: 'rgb(127, 78, 218)', textAlign: 'center' }}>
              Entrar
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'grey', textAlign: 'center' }}>
              Use suas credenciais para acessar
            </Typography>

            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2, textAlign: 'center' }}>
                {/* Provide a more generic error message or map specific ones */}
                Credenciais inválidas. Tente novamente.
              </Typography>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined" // Use outlined variant
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 } // Consistent border radius for input
                }}
                // Ensure text color has contrast
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: 'rgb(127, 78, 218)', // Explicitly set text color
                  },
                  '& .MuiInputLabel-root': {
                      color: theme.palette.primary.main, // Ensure label color has contrast
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.grey[400], // Lighter border
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                    },
                  }
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                        size="small"

                      >
                        {showPassword ? <VisibilityOff fontSize="small" sx={{ color: theme.palette.primary.main }}/> : <Visibility fontSize="small" sx={{ color: theme.palette.primary.main }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  mb: 1, // Reduced margin bottom
                   '& .MuiInputBase-input': {
                      color: 'rgb(127, 78, 218)', // Explicitly set text color
                  },
                  '& .MuiInputLabel-root': {
                      color: theme.palette.primary.main, // Ensure label color has contrast
                  },
                  '& .MuiOutlinedInput-root': {
                     '& fieldset': {
                      borderColor: theme.palette.grey[400],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                    },
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Esqueceu sua senha?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 50, // Make button rounded
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: `0 6px 12px ${theme.palette.primary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 8px 16px ${theme.palette.primary.main}60`,
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    backgroundColor: theme.palette.grey[400]
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>

              {/* Link to Register - visible only on mobile/tablet */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 4, borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, mr: 1 }}>
                  Não tem uma conta?
                </Typography>
                <Link component={RouterLink} to="/register" variant="body2" color="primary" fontWeight="bold">
                  Criar Conta
                </Link>
              </Box>
            </form>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
};

export default Login;

