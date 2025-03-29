// src/pages/NewsDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api';

function NewsDetailPage() {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);

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
    return <p className="text-black text-center">Загрузка новости...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl min-h-[50vh] max-h-[70vh] overflow-y-auto p-4">
        {/* Заголовок */}
        <h1
          className="text-4xl md:text-5xl font-bold text-red-500 uppercase mb-4 text-center w-full"
          style={{ wordBreak: 'break-all' }} // Разрываем длинные слова
        >
          {news.title}
        </h1>

        {/* Подзаголовок с автором и датой */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 w-full">
          <p className="text-lg text-gray-700 italic mb-2 md:mb-0">
            Автор: {news.author}
          </p>
          <p className="text-sm text-gray-600 uppercase">
            {formatDate(news.created_at)}
          </p>
        </div>

        {/* Основной текст */}
        <div className="prose max-w-none w-full">
          {/* Вступление (выделенное) */}
          <p
            className="text-xl text-black font-semibold mb-6"
            style={{ wordBreak: 'break-all' }} // Разрываем длинные слова
          >
            {news.content.split('.')[0] + '.'}
          </p>

          {/* Остальной текст */}
          {news.content.split('.').slice(1).map((sentence, index) => (
            <p
              key={index}
              className="text-gray-800 mb-4"
              style={{ wordBreak: 'break-all' }} // Разрываем длинные слова
            >
              {sentence.trim() + (sentence ? '.' : '')}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsDetailPage;