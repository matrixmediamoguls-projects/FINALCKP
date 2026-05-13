import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

import ElementalBackground from "./components/ElementalBackground";

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const LaunchModule = lazy(() => import('./pages/LaunchModule'));
const ActModulesPage = lazy(() => import('./pages/ActModulesPage'));
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
const FinalVisualizerPage = lazy(() => import('./pages/FinalVisualizerPage'));
const LaunchSequencePage = lazy(() => import('./pages/LaunchSequencePage'));
const Activation = lazy(() => import('./pages/Activation'));

import AppShell from './components/layout/AppShell';
import PaywallModal from './components/layout/PaywallModal';
import { UNLOCK_ALL_ACCESS } from './lib/accessFlags';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = `${API_URL}/api`;
axios.defaults.withCredentials = true;

// 🔒 Protected Route
const ProtectedRoute = ({ children, withShell = true }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (withShell) return <AppShellWrapper>{children}</AppShellWrapper>;
  return children;
};

// 🧱 App Shell Wrapper
const AppShellWrapper = ({ children }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('showUnlock') === 'true' && !UNLOCK_ALL_ACCESS) {
      setShowPaywall(true);
      setSearchParams({}, { replace: true });
    } else if (searchParams.get('showUnlock') === 'true') {
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

// 🧭 ROUTES
function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/launchmodule" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/launchmodule" replace /> : <Register />} />
      <Route path="/onboarding" element={<ProtectedRoute withShell={false}><Onboarding /></ProtectedRoute>} />
      <Route path="/" element={user ? <Navigate to="/launchmodule" replace /> : <Login />} />
      <Route path="/launchmodule" element={<ProtectedRoute withShell={false}><LaunchModule /></ProtectedRoute>} />
      <Route path="/acts" element={<ProtectedRoute><ActModulesPage /></ProtectedRoute>} />
      <Route path="/transmission" element={<ProtectedRoute withShell={false}><LaunchModule /></ProtectedRoute>} />
      <Route path="/wheel" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
      <Route path="/listen" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/listen/:actNumber" element={<ProtectedRoute><GuidedListen /></ProtectedRoute>} />
      <Route path="/launch-sequence/:actNumber" element={<LaunchSequencePage />} />
      <Route path="/visualizer" element={<FinalVisualizerPage />} />
      <Route path="/visualizer/:actId" element={<FinalVisualizerPage />} />
      <Route path="/immersive" element={<ProtectedRoute withShell={false}><ImmersiveProtocol /></ProtectedRoute>} />
      <Route path="/reclamation" element={<ProtectedRoute withShell={false}><ImmersiveProtocol /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/seeker" element={<ProtectedRoute><SeekerPage /></ProtectedRoute>} />
      <Route path="/protocol" element={<ProtectedRoute><ProtocolChat /></ProtectedRoute>} />
      <Route path="/protocol/:actNumber" element={<ProtectedRoute><ActProtocol /></ProtectedRoute>} />
      <Route path="/codex" element={<ProtectedRoute><ActPage /></ProtectedRoute>} />
      <Route path="/act/4" element={<ProtectedRoute><LockedAct /></ProtectedRoute>} />
      <Route path="/act/:actNumber" element={<ProtectedRoute><ActPage /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/activation" element={<Activation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// 🔥 MAIN BACKGROUND + AUDIO + ACT LOGIC
function AppWithBackground() {
  const location = useLocation();

  // ✅ YOUR CORRECT ACT MAP
  const path = location.pathname.toLowerCase();
  let act = "earth";
  if (path.includes("/act/2") || path.includes("act_two")) act = "water";
  if (path.includes("/act/3") || path.includes("act_three") || path.includes("reclamation") || path.includes("visualizer")) act = "fire";
  if (path.includes("/act/4") || path.includes("act_four")) act = "air";

  return (
    <>
      <ElementalBackground act={act} audioLevel={0} />
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </>
  );
}

// 🚀 ROOT
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AppWithBackground />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
