// src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 shadow-md z-10">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            News
          </Link>
          <Link to="/matches" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Matches
          </Link>
          <Link to="/results" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Results
          </Link>
          {/* Выпадающий список для Events */}
          <div
            className="relative"
            onMouseEnter={() => setIsEventsDropdownOpen(true)}
            onMouseLeave={() => setIsEventsDropdownOpen(false)}
          >
            <Link
              to="/events"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded inline-flex items-center"
            >
              Events
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {isEventsDropdownOpen && (
              <div className="absolute top-full left-0 bg-gray-800 text-white rounded-lg shadow-md w-48 z-20">
                <Link
                  to="/events?type=ongoing"
                  className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                >
                  Текущие турниры
                </Link>
                <Link
                  to="/events?type=archive"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Прошедшие турниры
                </Link>
                <Link
                  to="/events?type=calendar"
                  className="block px-4 py-2 hover:bg-gray-700 rounded-b-lg"
                >
                  Запланированные турниры
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add SearchBar here */}
          <SearchBar />
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                Войти
              </Link>
              <Link to="/register" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;