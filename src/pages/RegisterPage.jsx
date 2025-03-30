// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    try {
      setError('');
      const response = await api.post('/auth/register/', { email, password });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.email || error.response?.data?.detail || 'Ошибка при регистрации.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Регистрация</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full rounded text-black"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full rounded text-black"
        />
        <button onClick={handleRegister} className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600">
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;