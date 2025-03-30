// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';

function HomePage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 12;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news/');
        setNewsData(response.data); // Предполагаем, что сервер уже возвращает новости в порядке убывания по created_at
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        setError('Не удалось загрузить новости. Проверьте подключение к серверу.');
      }
    };

    fetchNews();
  }, []);

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

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Обработчик создания новости
  const handleCreateNews = async () => {
    const newNews = {
      title: prompt('Введите заголовок новости:'),
      content: prompt('Введите содержание новости:'),
      author: prompt('Введите автора новости:'),
    };
    if (newNews.title && newNews.content && newNews.author) {
      try {
        const response = await api.post('/news/', newNews);
        // Добавляем новую новость в начало массива
        setNewsData([response.data, ...newsData]);
        alert('Новость успешно создана!');
      } catch (error) {
        console.error('Ошибка при создании новости:', error);
        alert('Не удалось создать новость.');
      }
    } else {
      alert('Все поля должны быть заполнены.');
    }
  };

  // Обработчик обновления новости
  const handleUpdateNews = async (newsId) => {
    const updatedNews = {
      title: prompt('Введите новый заголовок новости:', newsData.find(n => n.id === newsId)?.title),
      content: prompt('Введите новое содержание новости:', newsData.find(n => n.id === newsId)?.content),
      author: prompt('Введите нового автора новости:', newsData.find(n => n.id === newsId)?.author),
    };
    if (updatedNews.title && updatedNews.content && updatedNews.author) {
      try {
        const response = await api.patch(`/news/${newsId}/`, updatedNews);
        // Обновляем новость, сохраняя порядок
        setNewsData(newsData.map(n => n.id === newsId ? response.data : n));
        alert('Новость успешно обновлена!');
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        alert('Не удалось обновить новость.');
      }
    } else {
      alert('Все поля должны быть заполнены.');
    }
  };

  // Обработчик удаления новости
  const handleDeleteNews = async (newsId) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await api.delete(`/news/${newsId}/`);
        // Удаляем новость, сохраняя порядок
        setNewsData(newsData.filter(n => n.id !== newsId));
        alert('Новость успешно удалена!');
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        alert('Не удалось удалить новость.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Последние новости</h2>
        {isAdmin && (
          <div className="mb-4 flex justify-end gap-2">
            <button
              onClick={handleCreateNews}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Добавить новость
            </button>
          </div>
        )}
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : newsData.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-4">
              {currentNews.map((news) => (
                <div key={news.id} className="relative">
                  <NewsCard
                    news={news}
                    onClick={() => navigate(`/news/${news.id}`)}
                    formatDate={formatDate}
                  />
                  {isAdmin && (
                    <div className="mt-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleUpdateNews(news.id)}
                        className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                      >
                        Обновить
                      </button>
                      <button
                        onClick={() => handleDeleteNews(news.id)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {newsData.length > newsPerPage && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={newsPerPage}
                  total={newsData.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-white text-center">Загрузка новостей...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;