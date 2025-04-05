import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

let refreshPromise = null;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

api.interceptors.request.use(config => {
  const accessToken = getCookie('user_access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url.includes('/auth/refresh/');
    const isLoginEndpoint = originalRequest.url.includes('/auth/login/');
    const isLogoutEndpoint = originalRequest.url.includes('/auth/logout/');

    if (isLoginEndpoint || isRefreshEndpoint || isLogoutEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh/')
          .then(() => {
            refreshPromise = null;
          })
          .catch(err => {
            refreshPromise = null;
            return Promise.reject(err);
          });
      }

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;