import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActPage from './pages/ActPage';
import LockedAct from './pages/LockedAct';
import Journal from './pages/Journal';
import SpinWheel from './pages/SpinWheel';
import Onboarding from './pages/Onboarding';
import AdminPanel from './pages/AdminPanel';
import SeekerPage from './pages/SeekerPage';
import ProtocolChat from './pages/ProtocolChat';
import GuidedListen from './pages/GuidedListen';
import ActProtocol from './pages/ActProtocol';
import AppShell from './components/layout/AppShell';
import PaywallModal from './components/layout/PaywallModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = `${API_URL}/api`;
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children, withShell = true }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (withShell) return <AppShellWrapper>{children}</AppShellWrapper>;
  return children;
};

const AppShellWrapper = ({ children }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('showUnlock') === 'true') {
      setShowPaywall(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <AppShell>
      {children}
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </AppShell>
  );
};

const LoadingScreen = () => (
  <div style={{
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: 'var(--void)'
  }}>
    <div style={{ fontSize: 48, color: 'var(--act)', opacity: 0.6, animation: 'pulse 3s ease-in-out infinite' }}>
      &#x25C8;
    </div>
    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.5em', color: 'var(--muted)', marginTop: 16, textTransform: 'uppercase' }}>
      Loading Protocol...
    </div>
  </div>
);

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/onboarding" element={<ProtectedRoute withShell={false}><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/wheel" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
      <Route path="/listen" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/listen/:actNumber" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/seeker" element={<ProtectedRoute><SeekerPage /></ProtectedRoute>} />
      <Route path="/protocol" element={<ProtectedRoute><ProtocolChat /></ProtectedRoute>} />
      <Route path="/protocol/:actNumber" element={<ProtectedRoute><ActProtocol /></ProtectedRoute>} />
      <Route path="/act/4" element={<ProtectedRoute><LockedAct /></ProtectedRoute>} />
      <Route path="/act/:actNumber" element={<ProtectedRoute><ActPage /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
