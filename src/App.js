import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/dashboard';
import EventList from './pages/events/EventList';
import EventCreate from './pages/events/EventCreate';
import EventDetail from './pages/events/EventDetail';
import InviteCreate from './pages/invites/InviteCreate';
import InvitePreview from './pages/invites/InvitePreview';
import GuestList from './pages/guests/GuestList';
import GuestForm from './pages/guests/GuestForm';
import GuestImport from './pages/guests/GuestImport';
import RsvpPage from './pages/public/RsvpPage';
import NotFound from './pages/PageNotFound';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/rsvp/:guestId" element={<RsvpPage />} />
      
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<EventCreate />} />
        <Route path="/events/:id/guests" element={<GuestList />} />
        <Route path="/events/:id/guests/new" element={<GuestForm />} />
        <Route path="/events/edit/:eventId" element={<EventCreate />} />
        <Route path="/events/:eventId/guests/edit/:guestId" element={<GuestForm />} />
        <Route path="/events/:id/guests/import" element={<GuestImport />} />
        <Route path="/events/:id/invite/preview" element={<InvitePreview />} />
        <Route path="/events/:eventId/invites/new" element={<InviteCreate />} />
        <Route path="/events/:eventId/invites/edit/:inviteId" element={<InviteCreate />} />
      </Route>
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
