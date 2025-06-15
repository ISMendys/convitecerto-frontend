import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Componentes de layout
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

// Constantes de layout
const HEADER_HEIGHT = 72;
const SIDEBAR_WIDTH = 280;

// Root container principal
const MainLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: theme.palette.background.default, // Cor sólida ao invés de alpha
  overflow: 'hidden'
}));

// Container do header fixo
const HeaderContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  zIndex: theme.zIndex.appBar,
  backgroundColor: 'transparent'
}));

// Container principal do conteúdo
const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  marginTop: HEADER_HEIGHT,
  minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default, // Garantir fundo consistente
  
  // Desktop: margem para sidebar
  [theme.breakpoints.up('lg')]: {
    marginLeft: SIDEBAR_WIDTH
  }
}));

// Container do conteúdo principal
const MainContent = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'relative'
}));

// Container scrollável do conteúdo
const ScrollableContent = styled('div')(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  position: 'relative',
  backgroundColor: theme.palette.background.default, // Garantir fundo durante scroll
  minHeight: '100%' // Garantir altura mínima
}));

// Container interno para padding e espaçamento
const InnerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100%',
  backgroundColor: theme.palette.background.default, // Garantir fundo consistente
  width: '100%', // Garantir largura total
  
  // Responsividade do padding
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  },
  
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1.5)
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Fechar sidebar mobile quando mudar para desktop
  React.useEffect(() => {
    if (!isMobile && isMobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [isMobile, isMobileNavOpen]);

  return (
    <MainLayoutRoot>
      {/* Header fixo no topo */}
      <HeaderContainer>
        <Header onMobileNavOpen={() => setMobileNavOpen(true)} />
      </HeaderContainer>

      {/* Sidebar */}
      <Sidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />

      {/* Container principal do conteúdo */}
      <ContentContainer>
        <MainContent>
          <ScrollableContent>
            <InnerContent>
              <Outlet />
            </InnerContent>
          </ScrollableContent>
        </MainContent>
      </ContentContainer>

      {/* Overlay para mobile quando sidebar está aberta */}
      {isMobile && isMobileNavOpen && (
        <Box
          onClick={() => setMobileNavOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}
      
      {/* Fundo global para garantir consistência */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.palette.background.default,
          zIndex: -1 // Atrás de todos os elementos
        }}
      />
    </MainLayoutRoot>
  );
};

export default MainLayout;

