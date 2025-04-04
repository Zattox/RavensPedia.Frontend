import axios from 'axios';
import 'antd/dist/reset.css';

const api = axios.create({
  baseURL: 'https://127.0.0.1:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // добавлено
});

api.interceptors.request.use(
  (config) => {
    console.log('Request config:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

export default api;