import { createContext, useState, useEffect, useContext } from 'react';
import api from '@/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Проверка авторизации
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me/', {
        withCredentials: true,
      });
      console.log('checkAuth: Ответ от /auth/me/:', response.data);
      const userData = { email: response.data.email, role: response.data.role };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('checkAuth: Ошибка проверки авторизации:', error.response?.data || error.message);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для обновления токена
  const refreshToken = async (attempt = 1, maxAttempts = 3) => {
    if (attempt > maxAttempts) {
      console.error('refreshToken: Достигнуто максимальное количество попыток обновления токена');
      await logout();
      return false;
    }

    try {
      console.log(`refreshToken: Попытка обновления токена ${attempt} из ${maxAttempts}`);
      const response = await api.post('/auth/refresh/', {}, { withCredentials: true });
      console.log('refreshToken: Токены успешно обновлены:', response.data);
      await checkAuth();
      return true;
    } catch (error) {
      console.error('refreshToken: Ошибка обновления токена (попытка', attempt, '):', error.response?.data || error.message);
      return await refreshToken(attempt + 1, maxAttempts);
    }
  };

  // Перехватчик запросов
  const setupApiInterceptors = () => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url.includes('/auth/refresh/') || originalRequest.url.includes('/auth/login/') || originalRequest.url.includes('/auth/logout/')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log('Interceptor: Получен 401, пытаемся обновить токен...');
          const refreshed = await refreshToken();
          if (refreshed) {
            return api(originalRequest);
          }
        }
        console.error('Interceptor: Ошибка в перехватчике ответов:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    console.log('AuthProvider: Инициализация перехватчиков и проверка авторизации');
    setupApiInterceptors();
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password }, { withCredentials: true });
      console.log('login: Успешный логин:', response.data);
      await checkAuth();
      return true;
    } catch (error) {
      console.error('login: Ошибка при входе:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/', {}, { withCredentials: true });
    } catch (error) {
      console.error('logout: Ошибка при выходе:', error.response?.data || error.message);
    } finally {
      document.cookie = 'user_access_token=; Max-Age=0; path=/; secure; samesite=None';
      document.cookie = 'user_refresh_token=; Max-Age=0; path=/; secure; samesite=None';
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      console.log('logout: Пользователь разлогинен');
    }
  };

  const isAdmin = user && user.role && user.role !== 'user';
  const isSuperAdmin = user && user.role && user.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, logout, isAdmin, isSuperAdmin, checkAuth, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}