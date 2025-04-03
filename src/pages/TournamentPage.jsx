import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import AdminTournamentPanel from '../components/AdminTournamentPanel';
import { Spin, Alert, Pagination } from 'antd';

function TournamentPage() {
  const { tournament_id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchesDetails, setMatchesDetails] = useState([]);
  const [currentTeamPage, setCurrentTeamPage] = useState(1);
  const [currentMatchPage, setCurrentMatchPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await api.get(`/tournaments/${tournament_id}/`);
        setTournament(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке турнира:', err);
        setError('Не удалось загрузить данные турнира.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournament_id]);

  useEffect(() => {
    const fetchMatchesDetails = async () => {
      if (tournament && tournament.matches_id && tournament.matches_id.length > 0) {
        const matchPromises = tournament.matches_id.map(async (matchId) => {
          try {
            const response = await api.get(`/matches/${matchId}/`);
            return response.data;
          } catch (error) {
            console.error(`Ошибка при загрузке матча ${matchId}:`, error);
            return null;
          }
        });

        const matchesData = await Promise.all(matchPromises);
        setMatchesDetails(matchesData.filter((match) => match !== null));
      }
    };

    fetchMatchesDetails();
  }, [tournament]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTeamPageChange = (page) => {
    setCurrentTeamPage(page);
    window.scrollTo(0, 0);
  };

  const handleMatchPageChange = (page) => {
    setCurrentMatchPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  const indexOfLastTeam = currentTeamPage * itemsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - itemsPerPage;
  const currentTeams = tournament.teams.slice(indexOfFirstTeam, indexOfLastTeam);

  const indexOfLastMatch = currentMatchPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matchesDetails.slice(indexOfFirstMatch, indexOfLastMatch);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Назад
        </button>

        {isAdmin && <AdminTournamentPanel tournamentName={tournament_id} />}

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">{tournament.name}</h1>
          <h2 className="text-2xl font-bold mb-4 text-center">Основная информация</h2>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Статус:</span> {tournament.status}
            </p>
            <p>
              <span className="font-semibold">Описание:</span>{' '}
              {tournament.description || 'Нет описания'}
            </p>
            <p>
              <span className="font-semibold">Призовой фонд:</span>{' '}
              {tournament.prize || 'Не указан'}
            </p>
            <p>
              <span className="font-semibold">Максимальное количество команд:</span>{' '}
              {tournament.max_count_of_teams}
            </p>
            <p>
              <span className="font-semibold">Дата начала:</span>{' '}
              {formatDate(tournament.start_date)}
            </p>
            <p>
              <span className="font-semibold">Дата окончания:</span>{' '}
              {formatDate(tournament.end_date)}
            </p>
          </div>
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Команды</h2>
          {currentTeams.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                {currentTeams.map((team, index) => (
                  <Link
                    key={index}
                    to={`/teams/${team}`}
                    className="text-blue-400 hover:underline"
                  >
                    {team}
                  </Link>
                ))}
              </div>
              {tournament.teams.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentTeamPage}
                    pageSize={itemsPerPage}
                    total={tournament.teams.length}
                    onChange={handleTeamPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center">Команды отсутствуют</p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Матчи</h2>
          {currentMatches.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                {currentMatches.map((match, index) => (
                  <Link
                    key={index}
                    to={`/matches/${match.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {match.teams && match.teams.length === 2
                      ? `${match.teams[0]} vs ${match.teams[1]}`
                      : 'Матч с неизвестными командами'}
                  </Link>
                ))}
              </div>
              {matchesDetails.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentMatchPage}
                    pageSize={itemsPerPage}
                    total={matchesDetails.length}
                    onChange={handleMatchPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center">Матчи отсутствуют</p>
          )}
        </div>

        {/* Результаты */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Результаты</h2>
          {tournament.results && tournament.results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tournament.results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center text-center"
                >
                  <p className="text-lg font-semibold">
                    {result.place}
                    {result.place === 1 ? 'st' : result.place === 2 ? 'nd' : result.place === 3 ? 'rd' : 'th'} Place
                  </p>
                  <p className="text-xl font-bold text-blue-400">
                    {result.team ? (
                      <Link to={`/teams/${result.team}`} className="hover:underline">
                        {result.team}
                      </Link>
                    ) : (
                      'TBD'
                    )}
                  </p>
                  <p className="text-sm text-gray-300">{result.prize}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">Результаты отсутствуют</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TournamentPage;