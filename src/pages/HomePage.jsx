// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

function HomePage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Загрузка новостей через GET /news/
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news/');
        setNewsData(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        setError('Не удалось загрузить новости. Проверьте подключение к серверу.');
      }
    };

    fetchNews();
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      {/* Секция новостей */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Последние новости</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : newsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {newsData.map((news) => (
              <Card
                key={news.id} // Теперь id есть в JSON-ответе
                hoverable
                className="text-left"
                style={{ backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)' }}
                onClick={() => navigate(`/news/${news.id}`)}
              >
                <h3 className="text-lg font-semibold">{news.title}</h3>
                <p className="text-sm text-gray-400">{formatDate(news.created_at)}</p>
                <p className="text-sm">Автор: {news.author}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">Загрузка новостей...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;