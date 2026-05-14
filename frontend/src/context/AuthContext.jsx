import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// JWT expiration time in milliseconds (7 days)
const JWT_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;
// Refresh token 1 minute before expiration
const REFRESH_BEFORE_EXPIRY = 60 * 1000;
const AUTH_REQUEST_TIMEOUT_MS = 5000;
const authRequestConfig = { timeout: AUTH_REQUEST_TIMEOUT_MS };
const LOCAL_AUTH_ERROR =
  'Local auth service is not responding. Restart the backend on http://127.0.0.1:5000 and try again.';

const isTimeoutOrNetworkError = (error) =>
  error?.code === 'ECONNABORTED' ||
  error?.code === 'ERR_NETWORK' ||
  String(error?.message || '').toLowerCase().includes('timeout');

const normalizeAuthError = (error, fallback) => {
  if (isTimeoutOrNetworkError(error)) {
    const normalized = new Error(LOCAL_AUTH_ERROR);
    normalized.cause = error;
    return normalized;
  }

  const message = error?.response?.data?.detail || fallback;
  const normalized = new Error(message);
  normalized.cause = error;
  normalized.response = error?.response;
  return normalized;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshTimer = useRef(null);

  const scheduleTokenRefresh = useCallback(() => {
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }
    
    // Refresh token before it expires
    tokenRefreshTimer.current = setTimeout(async () => {
      try {
        // Call /auth/me to validate session (acts as implicit refresh)
        const response = await axios.get('/auth/me', authRequestConfig);
        setUser(response.data);
        // Reschedule for next refresh
        scheduleTokenRefresh();
      } catch (error) {
        // Token expired or invalid, logout user
        setUser(null);
        if (tokenRefreshTimer.current) {
          clearTimeout(tokenRefreshTimer.current);
        }
      }
    }, JWT_EXPIRATION_TIME - REFRESH_BEFORE_EXPIRY);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/auth/me', authRequestConfig);
      setUser(response.data);
      scheduleTokenRefresh();
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    checkAuth();
    
    return () => {
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, [checkAuth]);

  // Add response interceptor to handle 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear user and stop refresh timer
          setUser(null);
          if (tokenRefreshTimer.current) {
            clearTimeout(tokenRefreshTimer.current);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password }, authRequestConfig);
      setUser(response.data);
      scheduleTokenRefresh();
      return response.data;
    } catch (error) {
      throw normalizeAuthError(error, 'Login failed');
    }
  };

  const socialLogin = async (provider, token) => {
    try {
      const response = await axios.post('/auth/social', { provider, token }, authRequestConfig);
      setUser(response.data);
      scheduleTokenRefresh();
      return response.data;
    } catch (error) {
      throw normalizeAuthError(error, 'Social login failed');
    }
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/auth/register', { name, email, password });
    setUser(response.data);
    scheduleTokenRefresh();
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }
  };

  const updateProgress = async (progressData) => {
    const response = await axios.put('/progress', progressData);
    setUser(response.data);
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    socialLogin,
    register,
    logout,
    checkAuth,
    updateProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
