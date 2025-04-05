import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
  });
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null
    });
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me/');
      setAuthState({
        isAuthenticated: true,
        loading: false,
        user: {
          email: response.data.email,
          role: response.data.role
        },
        error: null
      });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await api.post('/auth/refresh/');
          return await checkAuth();
        } catch (refreshError) {
          handleLogout();
          return false;
        }
      }
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || 'Auth check failed'
      }));
      return false;
    }
  }, [handleLogout]);

  const login = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await api.post('/auth/login/', { email, password });
      await checkAuth();
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || 'Login failed'
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } finally {
      handleLogout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  const value = {
    ...authState,
    login,
    logout,
    isAdmin: () => authState.user?.role === 'admin' || authState.user?.role === 'super_admin',
    isSuperAdmin: () => authState.user?.role === 'super_admin',
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}