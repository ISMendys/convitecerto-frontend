import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import ModernLandingPage from './pages/landing/ModernLandingPage';
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
import SupportPage from './pages/support/SupportPage';
import LoadingIndicator from './components/LoadingIndicator';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <LoadingIndicator
        open={loading}
        type="fullscreen"
        message="Processando sua solicitação..."
      />
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
      {/* Homepage moderna */}
      <Route path="/" element={<ModernLandingPage />} />
      
      {/* Rotas públicas */}
      <Route path="/rsvp/:guestId" element={<RsvpPage />} />
      
      {/* Rotas de autenticação (agora sem o AuthLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<EventCreate />} />
        <Route path="/events/:id/guests" element={<GuestList />} />
        <Route path="/events/:id/guests/new" element={<GuestForm />} />
        <Route path="/events/edit/:eventId" element={<EventCreate />} />
        <Route path="/events/:eventId/guests/edit/:guestId" element={<GuestForm />} />
        <Route path="/events/:id/guests/import" element={<GuestImport />} />
        <Route path="/events/:id/invite/preview" element={<InvitePreview />} />
        <Route path="/events/:eventId/invites/new" element={<InviteCreate />} />
        <Route path="/invites/new" element={<InviteCreate />} />
        <Route path="/events/:eventId/invites/edit/:inviteId" element={<InviteCreate />} />
      </Route>
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
