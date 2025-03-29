// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import api from '@/api';

function HomePage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 12;
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Последние новости</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : newsData.length > 0 ? (
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
          <p className="text-white text-center">Загрузка новостей...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;