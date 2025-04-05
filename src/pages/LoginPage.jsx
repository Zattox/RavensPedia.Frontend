// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Извлекаем предыдущий путь, но исключаем /login и /register
  const from = location.state?.from?.pathname || '/';
  const redirectTo = ['/login', '/register'].includes(from) ? '/' : from;

  const handleLogin = async () => {
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
      await login(email, password);
      navigate(redirectTo, { replace: true }); // Используем redirectTo вместо from
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ошибка при входе. Проверьте email и пароль.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Вход</h2>
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
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          Войти
        </button>
      </div>
    </div>
  );
}

export default LoginPage;