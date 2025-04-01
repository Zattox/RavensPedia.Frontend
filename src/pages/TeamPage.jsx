// src/pages/TeamPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Pagination, Table } from 'antd';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import AdminTeamPanel from '@/components/AdminTeamPanel';

function TeamPage() {
  const { team_name } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchesDetails, setMatchesDetails] = useState([]);
  const [opponentsEloMap, setOpponentsEloMap] = useState({});
  const [teamStats, setTeamStats] = useState([]);
  const [sortedTeamStats, setSortedTeamStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [playersEloMap, setPlayersEloMap] = useState({});
  const [tournamentsDatesMap, setTournamentsDatesMap] = useState({}); // Для хранения дат турниров
  const [currentMatchPage, setCurrentMatchPage] = useState(1);
  const [currentTournamentPage, setCurrentTournamentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get(`/teams/${team_name}/`);
        setTeam(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке команды:', error.response?.data || error.message);
        setError('Не удалось загрузить данные о команде. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [team_name]);

  useEffect(() => {
    const fetchMatchesDetails = async () => {
      if (team && team.matches_id && team.matches_id.length > 0) {
        const matchPromises = team.matches_id.map(async (matchId) => {
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
  }, [team]);

  useEffect(() => {
    const fetchOpponentsElo = async () => {
      if (matchesDetails && matchesDetails.length > 0) {
        const eloMap = {};

        for (const match of matchesDetails) {
          if (match.teams && match.teams.length === 2) {
            const opponentTeam = match.teams[0] === team_name ? match.teams[1] : match.teams[0];
            try {
              const response = await api.get(`/teams/${opponentTeam}/`);
              const opponentElo = response.data.average_faceit_elo;
              eloMap[match.id] = opponentElo !== null ? opponentElo : 'N/A';
            } catch (error) {
              console.error(`Ошибка при загрузке ELO команды ${opponentTeam}:`, error);
              eloMap[match.id] = 'N/A';
            }
          } else {
            eloMap[match.id] = 'N/A';
          }
        }

        setOpponentsEloMap(eloMap);
      }
    };

    fetchOpponentsElo();
  }, [matchesDetails, team_name]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await api.get(`/teams/stats/${team_name}/`);
        setTeamStats(response.data);
        setSortedTeamStats(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статистики по картам:', error.response?.data || error);
        setTeamStats([]);
        setSortedTeamStats([]);
      }
    };

    fetchTeamStats();
  }, [team_name]);

  useEffect(() => {
    const fetchPlayersElo = async () => {
      if (team && team.players && team.players.length > 0) {
        const eloMap = {};

        const playerPromises = team.players.map(async (player) => {
          try {
            const playerId = player.faceit_id || player;
            const response = await api.get(`/players/${playerId}/`);
            const playerElo = response.data.faceit_elo;
            eloMap[player] = playerElo !== null && playerElo !== undefined ? playerElo : 'N/A';
          } catch (error) {
            console.error(`Ошибка при загрузке ELO игрока ${player}:`, error);
            eloMap[player] = 'N/A';
          }
        });

        await Promise.all(playerPromises);
        setPlayersEloMap(eloMap);
      }
    };

    fetchPlayersElo();
  }, [team]);

  // Загрузка дат проведения турниров
  useEffect(() => {
    const fetchTournamentsDates = async () => {
      if (team && team.tournaments && team.tournaments.length > 0) {
        const datesMap = {};

        const tournamentPromises = team.tournaments.map(async (tournament) => {
          try {
            const response = await api.get(`/tournaments/${tournament}/`);
            const { start_date, end_date } = response.data;
            datesMap[tournament] = {
              start_date: start_date || 'N/A',
              end_date: end_date || 'N/A',
            };
          } catch (error) {
            console.error(`Ошибка при загрузке дат турнира ${tournament}:`, error);
            datesMap[tournament] = { start_date: 'N/A', end_date: 'N/A' };
          }
        });

        await Promise.all(tournamentPromises);
        setTournamentsDatesMap(datesMap);
      }
    };

    fetchTournamentsDates();
  }, [team]);

  useEffect(() => {
    if (sortConfig.key && teamStats.length > 0) {
      const sorted = [...teamStats].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
      setSortedTeamStats(sorted);
    } else {
      setSortedTeamStats(teamStats);
    }
  }, [sortConfig, teamStats]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleMatchPageChange = (page) => {
    setCurrentMatchPage(page);
    window.scrollTo(0, 0);
  };

  const handleTournamentPageChange = (page) => {
    setCurrentTournamentPage(page);
    window.scrollTo(0, 0);
  };

  const indexOfLastMatch = currentMatchPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matchesDetails.slice(indexOfFirstMatch, indexOfLastMatch);

  const indexOfLastTournament = currentTournamentPage * itemsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - itemsPerPage;
  const currentTournaments = team?.tournaments?.slice(indexOfFirstTournament, indexOfLastTournament) || [];

  const columns = [
    {
      title: 'Карта',
      dataIndex: 'map',
      key: 'map',
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort('matches_played')}
        >
          Сыграно матчей{' '}
          {sortConfig.key === 'matches_played' &&
            (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </span>
      ),
      dataIndex: 'matches_played',
      key: 'matches_played',
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort('matches_won')}
        >
          Победы{' '}
          {sortConfig.key === 'matches_won' &&
            (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </span>
      ),
      dataIndex: 'matches_won',
      key: 'matches_won',
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort('win_rate')}
        >
          Процент побед{' '}
          {sortConfig.key === 'win_rate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </span>
      ),
      dataIndex: 'win_rate',
      key: 'win_rate',
      render: (text) => `${text}%`,
    },
  ];

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

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Команда не найдена.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900 relative">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Назад
        </button>

        {/* Информация о команде */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">{team.name}</h1>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Описание:</span> {team.description || 'Нет описания'}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Средний FACEIT ELO команды:</span>{' '}
            {team.average_faceit_elo !== null ? team.average_faceit_elo : 'N/A'}
          </p>
        </div>

        {/* Панель администратора */}
        {isAdmin && <AdminTeamPanel team_name={team_name} setTeam={setTeam} />}

        {/* Секция игроков */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Игроки</h2>
          {team.players && team.players.length > 0 ? (
            <div className="flex flex-col gap-2">
              {team.players.map((player, index) => (
                <div key={index} className="flex items-center">
                  <Link
                    to={`/players/${player.faceit_id || player}`}
                    className="text-blue-400 hover:underline"
                  >
                    {player}
                  </Link>
                  <span className="text-gray-400 ml-2">
                    (ELO: {playersEloMap[player] || 'Загрузка...'})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 text-center">Игроки отсутствуют.</p>
          )}
        </div>

        {/* Секция матчей */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Матчи</h2>
          {currentMatches && currentMatches.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 text-gray-300">
                {currentMatches.map((match, index) => (
                  <div key={index} className="flex items-center">
                    <Link
                      to={`/matches/${match.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {match.teams && match.teams.length === 2 ? (
                        <>
                          {match.teams[0]} vs {match.teams[1]}
                        </>
                      ) : (
                        'Матч с неизвестными командами'
                      )}
                    </Link>
                    <span className="ml-2">
                      (ELO соперника: {opponentsEloMap[match.id] || 'Загрузка...'},{' '}
                      {match.date ? formatDate(match.date) : 'Дата неизвестна'})
                    </span>
                  </div>
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
            <p className="text-gray-300 text-center">Матчи отсутствуют.</p>
          )}
        </div>

        {/* Секция турниров */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Турниры</h2>
          {currentTournaments && currentTournaments.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                {currentTournaments.map((tournament, index) => (
                  <div key={index} className="flex items-center">
                    <Link
                      to={`/tournaments/${tournament}`}
                      className="text-blue-400 hover:underline"
                    >
                      {tournament}
                    </Link>
                    <span className="text-gray-400 ml-2">
                      {tournamentsDatesMap[tournament] ? (
                        `(с ${formatDate(tournamentsDatesMap[tournament].start_date)} по ${formatDate(tournamentsDatesMap[tournament].end_date)})`
                      ) : (
                        '(Загрузка дат...)'
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {team.tournaments.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentTournamentPage}
                    pageSize={itemsPerPage}
                    total={team.tournaments.length}
                    onChange={handleTournamentPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300 text-center">Турниры отсутствуют.</p>
          )}
        </div>

        {/* Секция статистики по картам */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Статистика по картам</h2>
          {sortedTeamStats && sortedTeamStats.length > 0 ? (
            <Table
              dataSource={sortedTeamStats}
              columns={columns}
              pagination={false}
              rowKey="map"
              className="custom-table"
            />
          ) : (
            <p className="text-gray-300 text-center">Статистика по картам отсутствует.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamPage;