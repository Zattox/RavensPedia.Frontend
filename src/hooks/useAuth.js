// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '@/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}