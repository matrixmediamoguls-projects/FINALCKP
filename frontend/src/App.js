import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ActPage = lazy(() => import('./pages/ActPage'));
const LockedAct = lazy(() => import('./pages/LockedAct'));
const Journal = lazy(() => import('./pages/Journal'));
const SpinWheel = lazy(() => import('./pages/SpinWheel'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SeekerPage = lazy(() => import('./pages/SeekerPage'));
const ProtocolChat = lazy(() => import('./pages/ProtocolChat'));
const GuidedListen = lazy(() => import('./pages/GuidedListen'));
const ActProtocol = lazy(() => import('./pages/ActProtocol'));
const ImmersiveProtocol = lazy(() => import('./modules/ImmersiveProtocol'));

import AppShell from './components/layout/AppShell';
import PaywallModal from './components/layout/PaywallModal';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = `${API_URL}/api`;
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children, withShell = true }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
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

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/onboarding" element={<ProtectedRoute withShell={false}><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/wheel" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
      <Route path="/listen" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/listen/:actNumber" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/immersive" element={<ProtectedRoute withShell={false}><ImmersiveProtocol /></ProtectedRoute>} />
      <Route path="/reclamation" element={<ProtectedRoute withShell={false}><ImmersiveProtocol /></ProtectedRoute>} />
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
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
