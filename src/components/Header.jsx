// src/components/Header.jsx
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import LogoutButton from '@/components/LogoutButton';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const topCards = [
    { title: 'News', key: 'news', path: '/' },
    { title: 'Matches', key: 'matches', path: '/matches' },
    { title: 'Results', key: 'results', path: '/results' },
    { title: 'Events', key: 'events', path: '/events' },
  ];

  return (
    <header className="w-full bg-gray-900 p-4 shadow-md fixed top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          {topCards.map((card) => (
            <Card
              key={card.key}
              hoverable
              className="text-center"
              style={{ backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)', width: '120px' }}
              onClick={() => navigate(card.path)}
            >
              <p className="text-lg font-semibold">{card.title}</p>
            </Card>
          ))}
        </div>
        <div className="flex gap-2">
          {loading ? (
            <span className="text-white">Загрузка...</span>
          ) : isAuthenticated ? (
            <>
              <Button type="primary" onClick={() => navigate('/profile')}>
                Профиль
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => navigate('/login')}>
                Войти
              </Button>
              <Button type="default" onClick={() => navigate('/register')}>
                Регистрация
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;