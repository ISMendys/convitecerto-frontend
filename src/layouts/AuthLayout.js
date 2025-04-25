import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  width: '100%'
}));

const AuthLayoutWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center'
});

const AuthLayoutContent = styled(Paper)(({ theme }) => ({
  maxWidth: 500,
  padding: theme.spacing(6),
  width: '100%',
  borderRadius: 16,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
}));

const AuthLayout = () => {
  return (
    <AuthLayoutRoot>
      <AuthLayoutWrapper>
        <Container maxWidth="sm">
          <AuthLayoutContent>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                color="primary"
                variant="h4"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Convites Digitais
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Crie convites incríveis e gerencie confirmações com facilidade
              </Typography>
            </Box>
            <Outlet />
          </AuthLayoutContent>
        </Container>
      </AuthLayoutWrapper>
    </AuthLayoutRoot>
  );
};

export default AuthLayout;
