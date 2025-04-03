// src/pages/HomePage.jsx
import { useState, useEffect, useContext } from 'react';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import AdminMainPanel from '../components/AdminMainPanel.jsx';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';

function HomePage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Добавляем триггер
  const newsPerPage = 12;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const notificationApi = useContext(NotificationContext);

  const showNotification = (type, message, description) => {
    notificationApi[type]({ message, description, placement: 'bottomRight' });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/news/');
        setNewsData(response.data);
        setError(null);
      } catch (error) {
        setError('Не удалось загрузить новости. Проверьте подключение к серверу.');
        showNotification('error', 'Ошибка!', 'Не удалось загрузить новости.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [refreshTrigger]); // Добавляем refreshTrigger

  const refreshNewsData = () => setRefreshTrigger((prev) => prev + 1); // Функция обновления

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

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-6xl relative">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Последние новости</h2>
        {isAdmin && <AdminMainPanel setNewsData={setNewsData} refreshNewsData={refreshNewsData} />}
        {newsData.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-4">
              {currentNews.map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onClick={() => navigate(`/news/${news.id}`)}
                  formatDate={formatDate}
                />
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
          <p className="text-white text-center">Новости отсутствуют</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;