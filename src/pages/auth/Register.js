import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { registerUser } from '../../store/actions/authActions';

const Register = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Trigger entrance animation
    setAnimateIn(true);
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear password error when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    dispatch(registerUser(formData.name, formData.email, formData.phone, formData.password));
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Animated background circles
  const circles = [
    { size: 300, top: '10%', left: '5%', delay: 0, color: theme.palette.primary.main },
    { size: 200, top: '60%', left: '80%', delay: 0.2, color: theme.palette.secondary.main },
    { size: 150, top: '80%', left: '10%', delay: 0.4, color: theme.palette.primary.dark },
    { size: 100, top: '20%', left: '70%', delay: 0.6, color: theme.palette.secondary.dark }
  ];
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
      }}
    >
      {/* Animated background circles */}
      {circles.map((circle, index) => (
        <Fade 
          key={index}
          in={animateIn}
          timeout={1000}
          style={{ 
            transitionDelay: `${circle.delay * 1000}ms`,
            position: 'absolute',
            top: circle.top,
            left: circle.left,
            zIndex: 0
          }}
        >
          <Box
            sx={{
              width: circle.size,
              height: circle.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${circle.color}30 0%, ${circle.color}10 50%, transparent 70%)`,
              animation: 'pulse 8s infinite ease-in-out',
              animationDelay: `${index * 0.5}s`,
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          />
        </Fade>
      ))}
      
      {/* Content */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 3, sm: 6 },
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left side - Branding */}
        <Fade in={animateIn} timeout={1000}>
          <Box
            sx={{
              flex: { xs: '0 0 100%', md: '0 0 50%' },
              mb: { xs: 6, md: 0 },
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: 1
                }}
              >
                ConviteCerto
              </Typography>
            </Box>
            
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                lineHeight: 1.2,
                mb: 3,
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              Crie sua conta
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mb: 4,
                color: 'white',
                opacity: 0.9,
                maxWidth: 500
              }}
            >
              Comece a criar convites digitais elegantes e gerencie seus eventos com facilidade.
            </Typography>
            
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                mt: 8
              }}
            >
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.8, mr: 2 }}>
                Já tem uma conta?
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: 50,
                  px: 3,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Fade>
        
        {/* Right side - Register Form */}
        <Fade in={animateIn} timeout={1000} style={{ transitionDelay: '300ms' }}>
          <Box
            sx={{
              flex: { xs: '0 0 100%', md: '0 0 45%' },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: { xs: 3, sm: 5 },
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: { xs: '100%', md: 450 }
            }}
          >
            <Typography variant="h4" component="h3" sx={{ mb: 1, fontWeight: 700, color: 'rgb(127, 78, 218)', textAlign: 'center' }}>
              Cadastre-se
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
              Preencha os campos abaixo para criar sua conta
            </Typography>
            
            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: theme.palette.text.primary, // Explicitly set text color
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: theme.palette.text.primary, // Explicitly set text color
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
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: theme.palette.text.primary, // Explicitly set text color
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
                      >
                        {showPassword ? <VisibilityOff sx={{ color: theme.palette.primary.main }}/> : <Visibility sx={{ color: theme.palette.primary.main }}/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: theme.palette.text.primary, // Explicitly set text color
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
                label="Confirmar senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ color: theme.palette.primary.main }}/> : <Visibility sx={{ color: theme.palette.primary.main }}/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                      color: theme.palette.text.primary, // Explicitly set text color
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(94, 53, 177, 0.2)',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(94, 53, 177, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
              </Button>
              
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
                  Já tem uma conta?
                </Typography>
                <Link component={RouterLink} to="/login" variant="body2" color="primary" fontWeight="bold">
                  Entrar
                </Link>
              </Box>
            </form>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Register;
