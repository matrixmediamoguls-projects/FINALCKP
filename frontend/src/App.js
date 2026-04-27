import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
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
import ReclamationProtocol from './pages/ReclamationProtocol';
import AppShell from './components/layout/AppShell';
import PaywallModal from './components/layout/PaywallModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = `${API_URL}/api`;
axios.defaults.withCredentials = false;

const ProtectedRoute = ({ children, withShell = true }) => {
const token = localStorage.getItem("token");

if (!token) return <Navigate to="/login" replace />;

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

return ( <AppShell>
{children}
<PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} /> </AppShell>
);
};

function AppRoutes() {
const token = localStorage.getItem("token");

return ( <Routes>
<Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
<Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

  <Route path="/onboarding" element={<ProtectedRoute withShell={false}><Onboarding /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/wheel" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
  <Route path="/listen" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
  <Route path="/listen/:actNumber" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
  <Route path="/seeker" element={<ProtectedRoute><SeekerPage /></ProtectedRoute>} />
  <Route path="/protocol" element={<ProtectedRoute><ProtocolChat /></ProtectedRoute>} />
  <Route path="/protocol/:actNumber" element={<ProtectedRoute><ActProtocol /></ProtectedRoute>} />
  <Route path="/reclamation" element={<ProtectedRoute withShell={false}><ReclamationProtocol /></ProtectedRoute>} />
  <Route path="/act/4" element={<ProtectedRoute><LockedAct /></ProtectedRoute>} />
  <Route path="/act/:actNumber" element={<ProtectedRoute><ActPage /></ProtectedRoute>} />
  <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />

  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>

);
}

function App() {
return ( <ErrorBoundary> <BrowserRouter> <AppRoutes /> </BrowserRouter> </ErrorBoundary>
);
}

export default App;