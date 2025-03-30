// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '@/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Содержит email и role

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me/');
      console.log('Ответ от /auth/me/:', response.data);
      const userData = { email: response.data.email, role: response.data.role };
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error.response?.data || error);
      setIsAuthenticated(false);
      setUser(null);
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
      await checkAuth(); // Обновляем данные пользователя после логина
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
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const isAdmin = user && user.role && user.role !== 'user'; // Проверка роли администратора

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}