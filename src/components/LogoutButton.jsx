// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import api from '@/api';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout/', {
        access_token: localStorage.getItem('accessToken'),
        refresh_token: refreshToken,
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error.response?.data || error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Выйти
    </button>
  );
}

export default LogoutButton;