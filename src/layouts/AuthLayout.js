// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Box, Container, Paper } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import AuthBackground from '../components/auth/AuthBackground';
// import AuthLogo from '../components/auth/AuthLogo';

// const AuthLayoutRoot = styled('div')(({ theme }) => ({
//   backgroundColor: theme.palette.background.default,
//   display: 'flex',
//   height: '100vh',
//   overflow: 'hidden',
//   width: '100%',
//   position: 'relative',
// }));

// const AuthLayoutWrapper = styled('div')({
//   display: 'flex',
//   flex: '1 1 auto',
//   overflow: 'hidden',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '24px',
// });

// const AuthLayoutContent = styled(Paper)(({ theme }) => ({
//   maxWidth: 500,
//   padding: theme.spacing(6),
//   width: '100%',
//   borderRadius: 24,
//   boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
//   backdropFilter: 'blur(10px)',
//   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   position: 'relative',
//   overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: '4px',
//     background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//   },
// }));

// const AuthLayout = () => {
//   return (
//     <AuthLayoutRoot>
//       <AuthBackground />
//       <AuthLayoutWrapper>
//         <Container maxWidth="sm">
//           <AuthLayoutContent>
//             <AuthLogo />
//             <Outlet />
//           </AuthLayoutContent>
//         </Container>
//       </AuthLayoutWrapper>
//     </AuthLayoutRoot>
//   );
// };

// export default AuthLayout;