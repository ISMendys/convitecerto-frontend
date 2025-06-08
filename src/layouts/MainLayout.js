import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Componentes de layout
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.default, 0.98)
    : alpha(theme.palette.background.default, 0.98),
}));

const MainLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 72, // Altura do header
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280 // Largura da sidebar
  }
}));

const MainLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const MainLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const MainLayout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <MainLayoutRoot>
      <Sidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      {/* <MainLayoutWrapper> */}
        {/* <MainLayoutContainer> */}
          <MainLayoutContent>
            <Header onMobileNavOpen={() => setMobileNavOpen(true)} />

            <Box
              sx={{
                backgroundColor: 'background.default',
                width: '100%'
              }}
            >
              <Container sx={{ width: '100%', ml: { xs: 0, lg: 56 } }}>
                <Outlet />
              </Container>
            </Box>
          </MainLayoutContent>
        {/* </MainLayoutContainer> */}
      {/* </MainLayoutWrapper> */}
    </MainLayoutRoot>
  );
};

export default MainLayout;
