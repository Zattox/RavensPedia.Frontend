// src/pages/EventsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pagination } from 'antd';
import api from '@/api';

function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventType = queryParams.get('type') || 'ongoing';

  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tournamentsPerPage = 4;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        let endpoint;
        if (eventType === 'ongoing') {
          endpoint = '/schedules/tournaments/get_in_progress/';
        } else if (eventType === 'archive') {
          endpoint = '/schedules/tournaments/get_completed/';
        } else if (eventType === 'calendar') {
          endpoint = '/schedules/tournaments/get_upcoming_scheduled/';
        }

        console.log(`Запрос на эндпоинт: ${endpoint}`); // Отладка: проверяем, какой эндпоинт вызывается

        const response = await api.get(endpoint);
        const tournamentsData = response.data?.data || response.data || [];
        console.log('Данные от бэкенда:', tournamentsData); // Отладка: проверяем, что возвращает бэкенд

        // Сортировка в зависимости от типа
        let sortedTournaments = Array.isArray(tournamentsData) ? tournamentsData : [];
        if (eventType === 'archive') {
          // Прошедшие турниры: от последнего к раннему
          sortedTournaments = sortedTournaments.sort(
            (a, b) => new Date(b.end_date) - new Date(a.end_date)
          );
        } else if (eventType === 'calendar') {
          // Запланированные турниры: от ближайшего к дальнему
          sortedTournaments = sortedTournaments.sort(
            (a, b) => new Date(a.start_date) - new Date(b.start_date)
          );
        }
        // Для текущих турниров сортировка не требуется, но можно добавить по желанию
        setTournaments(sortedTournaments);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке турниров:', error.response?.data || error.message);
        setError('Не удалось загрузить турниры. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    // Сбрасываем состояние перед новым запросом
    setTournaments([]);
    setCurrentPage(1);
    setLoading(true);
    fetchTournaments();
  }, [eventType, location.search]); // Добавляем location.search как зависимость

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = tournaments.slice(indexOfFirstTournament, indexOfLastTournament);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleTournamentClick = (tournamentName) => {
    navigate(`/tournaments/${tournamentName}`);
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
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            {eventType === 'ongoing' && 'Текущие турниры'}
            {eventType === 'archive' && 'Прошедшие турниры'}
            {eventType === 'calendar' && 'Запланированные турниры'}
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : tournaments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentTournaments.map((tournament) => (
                  <div
                    key={tournament.name || Math.random()}
                    className="bg-gray-800 p-4 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => handleTournamentClick(tournament.name)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tournament.name || 'N/A'}</h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Статус:</span>{' '}
                      {tournament.status || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Дата начала:</span>{' '}
                      {formatDate(tournament.start_date)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Дата окончания:</span>{' '}
                      {formatDate(tournament.end_date)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Призовой фонд:</span>{' '}
                      {tournament.prize || 'Не указан'}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Количество команд:</span>{' '}
                      {tournament.teams?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
              {tournaments.length > tournamentsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={tournamentsPerPage}
                    total={tournaments.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">
              {eventType === 'ongoing' && 'Нет текущих турниров.'}
              {eventType === 'archive' && 'Нет прошедших турниров.'}
              {eventType === 'calendar' && 'Нет запланированных турниров.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;