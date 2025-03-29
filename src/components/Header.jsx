// src/components/Header.jsx
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const topCards = [
    { title: 'News', key: 'news', path: '/' }, // Изменили путь с /news на /
    { title: 'Matches', key: 'matches', path: '/matches' },
    { title: 'Results', key: 'results', path: '/results' },
    { title: 'Events', key: 'events', path: '/events' },
  ];

  return (
    <header className="w-full bg-gray-900 p-4 shadow-md fixed top-0 left-0 z-10">
      <div className="container mx-auto flex justify-center gap-4">
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
    </header>
  );
}

export default Header;