// src/pages/MatchesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import api from '@/api';

function MatchesPage() {
  const [inProgressMatches, setInProgressMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const matchesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const inProgressResponse = await api.get('/schedules/matches/get_in_progress/');
        const inProgressData = inProgressResponse.data?.data || inProgressResponse.data || [];
        setInProgressMatches(Array.isArray(inProgressData) ? inProgressData : []);

        const scheduledResponse = await api.get('/schedules/matches/get_upcoming_scheduled/', {
          params: { num_matches: 50 },
        });
        const scheduledData = scheduledResponse.data?.data || scheduledResponse.data || [];
        setScheduledMatches(Array.isArray(scheduledData) ? scheduledData : []);

        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке матчей:', error.response?.data || error.message);
        setError('Не удалось загрузить матчи. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
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

  const indexOfLastInProgress = inProgressPage * matchesPerPage;
  const indexOfFirstInProgress = indexOfLastInProgress - matchesPerPage;
  const currentInProgressMatches = inProgressMatches.slice(indexOfFirstInProgress, indexOfLastInProgress);

  const indexOfLastScheduled = scheduledPage * matchesPerPage;
  const indexOfFirstScheduled = indexOfLastScheduled - matchesPerPage;
  const currentScheduledMatches = scheduledMatches.slice(indexOfFirstScheduled, indexOfLastScheduled);

  const handleInProgressPageChange = (page) => {
    setInProgressPage(page);
    window.scrollTo(0, 0);
  };

  const handleScheduledPageChange = (page) => {
    setScheduledPage(page);
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
        {/* Блок для начатых матчей */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Текущие матчи</h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : inProgressMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentInProgressMatches.map((match) => (
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
                  </div>
                ))}
              </div>
              {inProgressMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={inProgressPage}
                    pageSize={matchesPerPage}
                    total={inProgressMatches.length}
                    onChange={handleInProgressPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">Нет текущих матчей.</p>
          )}
        </div>

        {/* Блок для запланированных матчей */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Запланированные матчи</h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : scheduledMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentScheduledMatches.map((match) => (
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
                  </div>
                ))}
              </div>
              {scheduledMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={scheduledPage}
                    pageSize={matchesPerPage}
                    total={scheduledMatches.length}
                    onChange={handleScheduledPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">Нет запланированных матчей.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;