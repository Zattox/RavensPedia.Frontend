// src/pages/NewsDetailPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';
import AdminNewsPanel from '@/components/AdminNewsPanel';

function NewsDetailPage() {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Добавляем триггер
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const notificationApi = useContext(NotificationContext);

  const showNotification = (type, message, description) => {
    notificationApi[type]({ message, description, placement: 'bottomRight' });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news/${news_id}/`);
        setNews(response.data);
        setError(null);
      } catch (error) {
        setError('Не удалось загрузить новость.');
        showNotification('error', 'Ошибка!', 'Не удалось загрузить новость.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [news_id, refreshTrigger]); // Добавляем refreshTrigger в зависимости

  const refreshNews = () => setRefreshTrigger((prev) => prev + 1); // Функция обновления

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Неверная дата'
      : date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!news) {
    return <p className="text-white text-center">Загрузка новости...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition duration-200"
        >
          Назад к новостям
        </button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <h1
            className="text-4xl md:text-5xl font-bold text-red-500 uppercase mb-6 text-center leading-tight"
            style={{ wordBreak: 'break-all' }}
          >
            {news.title}
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <p className="text-lg text-gray-400 italic mb-2 md:mb-0">
              Автор: {news.author}
            </p>
            <p className="text-sm text-gray-500 uppercase">
              {formatDate(news.created_at)}
            </p>
          </div>
          <div className="prose max-w-none">
            <p
              className="text-xl text-white font-semibold mb-6 leading-relaxed"
              style={{ wordBreak: 'break-all' }}
            >
              {news.content.split('.')[0] + '.'}
            </p>
            {news.content.split('.').slice(1).map((sentence, index) => (
              <p
                key={index}
                className="text-gray-300 mb-4 leading-relaxed"
                style={{ wordBreak: 'break-all' }}
              >
                {sentence.trim() + (sentence ? '.' : '')}
              </p>
            ))}
          </div>
        </div>
      </div>
      {isAdmin() && <AdminNewsPanel newsId={news_id} setNews={setNews} refreshNews={refreshNews} />}
    </div>
  );
}

export default NewsDetailPage;