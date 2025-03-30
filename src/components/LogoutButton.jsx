// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // Используем функцию logout из контекста
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Выйти
    </button>
  );
}

export default LogoutButton;