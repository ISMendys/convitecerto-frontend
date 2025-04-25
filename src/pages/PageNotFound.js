import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const PageNotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <SadIcon 
            sx={{ 
              fontSize: isMobile ? 100 : 150, 
              color: 'primary.main',
              opacity: 0.7
            }} 
          />
        </Box>
        
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            fontSize: isMobile ? '2.5rem' : '3.75rem'
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 'medium',
            fontSize: isMobile ? '1.5rem' : '2.125rem'
          }}
        >
          Página Não Encontrada
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          paragraph
          sx={{ 
            maxWidth: 600,
            mx: 'auto',
            mb: 4
          }}
        >
          Ops! A página que você está procurando não existe ou foi movida.
          Verifique se o endereço foi digitado corretamente ou utilize os botões abaixo para navegar.
        </Typography>
        
        <Grid 
          container 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              component={RouterLink}
              to="/"
            >
              Página Inicial
            </Button>
          </Grid>
          
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Se você acredita que isso é um erro, entre em contato com o suporte.
        </Typography>
      </Box>
    </Container>
  );
};

export default PageNotFound;
