// src/pages/NewsDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import AdminNewsPanel from '@/components/AdminNewsPanel';

function NewsDetailPage() {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${news_id}/`);
        setNews(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    };

    fetchNews();
  }, [news_id]);

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

  if (!news) {
    return <p className="text-white text-center">Загрузка новости...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        {/* Кнопка "Назад к новостям" */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Назад к новостям
        </button>

        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          {/* Заголовок */}
          <h1
            className="text-4xl md:text-5xl font-bold text-red-500 uppercase mb-6 text-center leading-tight"
            style={{ wordBreak: 'break-all' }}
          >
            {news.title}
          </h1>

          {/* Подзаголовок с автором и датой */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <p className="text-lg text-gray-400 italic mb-2 md:mb-0">
              Автор: {news.author}
            </p>
            <p className="text-sm text-gray-500 uppercase">
              {formatDate(news.created_at)}
            </p>
          </div>

          {/* Основной текст */}
          <div className="prose max-w-none">
            {/* Вступление (выделенное) */}
            <p
              className="text-xl text-white font-semibold mb-6 leading-relaxed"
              style={{ wordBreak: 'break-all' }}
            >
              {news.content.split('.')[0] + '.'}
            </p>

            {/* Остальной текст */}
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

      {isAdmin && <AdminNewsPanel newsId={news_id} setNews={setNews} />}
    </div>
  );
}

export default NewsDetailPage;