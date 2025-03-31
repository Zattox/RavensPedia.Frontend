// src/pages/MatchesResultsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import api from '@/api';

function MatchesResultsPage() {
  const [completedMatches, setCompletedMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedMatches = async () => {
      try {
        const response = await api.get('/schedules/matches/get_last_completed/');
        const completedData = response.data?.data || response.data || [];
        // Сортировка завершенных матчей по времени (от последнего к раннему)
        const sortedCompletedData = Array.isArray(completedData)
          ? completedData.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        setCompletedMatches(sortedCompletedData);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке завершенных матчей:', error.response?.data || error.message);
        setError('Не удалось загрузить завершенные матчи. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedMatches();
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

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentCompletedMatches = completedMatches.slice(indexOfFirstMatch, indexOfLastMatch);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleMatchClick = (matchId) => {
    navigate(`/matches/${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Завершенные матчи</h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : completedMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentCompletedMatches.map((match) => (
                  <div
                    key={match.id || Math.random()}
                    className="bg-gray-800 p-4 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => handleMatchClick(match.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Формат: Best of {match.best_of || 'N/A'}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Турнир:</span> {match.tournament || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Дата:</span>{' '}
                      {match.date ? formatDate(match.date) : 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Матч:</span>{' '}
                      {Array.isArray(match.teams) && match.teams.length === 2 ? (
                        <span>
                          <span className="text-blue-400">{match.teams[0]}</span> vs{' '}
                          <span className="text-red-400">{match.teams[1]}</span>
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Статус:</span> COMPLETED
                    </p>
                  </div>
                ))}
              </div>
              {completedMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={matchesPerPage}
                    total={completedMatches.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">Нет завершенных матчей.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchesResultsPage;