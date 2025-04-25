import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componentes de layout
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  // display: 'flex',
  // minHeight: '100vh',
  // overflow: 'hidden',
  // width: '100%'
}));

const MainLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
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
      <Header onMobileNavOpen={() => setMobileNavOpen(true)} />
      <Sidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <MainLayoutWrapper>
        <MainLayoutContainer>
          <MainLayoutContent>
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3
              }}
            >
              <Container maxWidth="lg">
                <Outlet />
              </Container>
            </Box>
          </MainLayoutContent>
        </MainLayoutContainer>
      </MainLayoutWrapper>
    </MainLayoutRoot>
  );
};

export default MainLayout;
