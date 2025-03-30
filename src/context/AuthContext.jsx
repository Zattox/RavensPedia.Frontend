// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '@/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me/');
      console.log('Ответ от /auth/me/:', response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error.response?.data || error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      setIsAuthenticated(true); // Обновляем состояние напрямую
      return true;
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout/', {
        access_token: localStorage.getItem('accessToken'),
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error.response?.data || error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false); // Обновляем состояние напрямую
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}