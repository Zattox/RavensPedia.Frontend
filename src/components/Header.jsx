// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 shadow-md z-10">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="space-x-4">
          <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">News</Link>
          <Link to="/matches" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Matches</Link>
          <Link to="/results" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Results</Link>
          <Link to="/events" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Events</Link>
        </div>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Профиль</Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded ml-2"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Войти</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;