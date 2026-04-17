import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

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

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    setUser(response.data);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/auth/register', { name, email, password });
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
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
