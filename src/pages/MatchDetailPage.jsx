// src/pages/MatchDetailPage.jsx
import { useState, useEffect,useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pagination } from 'antd';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import AdminMatchPanel from '@/components/AdminMatchPanel.jsx';
import { NotificationContext } from '@/context/NotificationContext';

function MatchDetailPage() {
  const { match_id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [winnersSortConfig, setWinnersSortConfig] = useState({ key: null, direction: 'ascending' });
  const [sortedWinnersStats, setSortedWinnersStats] = useState([]);
  const [losersSortConfig, setLosersSortConfig] = useState({ key: null, direction: 'ascending' });
  const [sortedLosersStats, setSortedLosersStats] = useState([]);
  const notificationApi = useContext(NotificationContext);

  const showNotification = (type, message, description) => {
    notificationApi[type]({ message, description, placement: 'bottomRight' });
  };

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/matches/${match_id}/`);
        setMatch(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке матча:', error.response?.data || error.message);
        setError('Не удалось загрузить данные о матче. Проверьте подключение к серверу.');
        showNotification('error', 'Ошибка!', 'Не удалось загрузить данные о матче.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [match_id, refreshTrigger]);

  const refreshMatch = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (match) {
      const winners = match.stats?.filter(
        (stat) => stat.Result === 1 && stat.round_of_match === currentRound
      ) || [];
      const losers = match.stats?.filter(
        (stat) => stat.Result === 0 && stat.round_of_match === currentRound
      ) || [];
      setSortedWinnersStats(winners);
      setSortedLosersStats(losers);
    }
  }, [match, currentRound]);

  useEffect(() => {
    if (winnersSortConfig.key && match) {
      const winners = match.stats?.filter(
        (stat) => stat.Result === 1 && stat.round_of_match === currentRound
      ) || [];
      const sorted = [...winners].sort((a, b) => {
        let aValue = a[winnersSortConfig.key];
        let bValue = b[winnersSortConfig.key];

        if (winnersSortConfig.key === 'Headshots %') {
          aValue = a['Headshots %'];
          bValue = b['Headshots %'];
        } else if (winnersSortConfig.key === 'K/D') {
          aValue = a.Deaths === 0 ? a.Kills : a.Kills / a.Deaths;
          bValue = b.Deaths === 0 ? b.Kills : b.Kills / b.Deaths;
        }

        if (aValue < bValue) return winnersSortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return winnersSortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
      setSortedWinnersStats(sorted);
    }
  }, [winnersSortConfig, match, currentRound]);

  useEffect(() => {
    if (losersSortConfig.key && match) {
      const losers = match.stats?.filter(
        (stat) => stat.Result === 0 && stat.round_of_match === currentRound
      ) || [];
      const sorted = [...losers].sort((a, b) => {
        let aValue = a[losersSortConfig.key];
        let bValue = b[losersSortConfig.key];

        if (losersSortConfig.key === 'Headshots %') {
          aValue = a['Headshots %'];
          bValue = b['Headshots %'];
        } else if (losersSortConfig.key === 'K/D') {
          aValue = a.Deaths === 0 ? a.Kills : a.Kills / a.Deaths;
          bValue = b.Deaths === 0 ? b.Kills : b.Kills / b.Deaths;
        }

        if (aValue < bValue) return losersSortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return losersSortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
      setSortedLosersStats(sorted);
    }
  }, [losersSortConfig, match, currentRound]);

  const handleSort = (key, type) => {
    if (type === 'winners') {
      const direction =
        winnersSortConfig.key === key && winnersSortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending';
      setWinnersSortConfig({ key, direction });
    } else {
      const direction =
        losersSortConfig.key === key && losersSortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending';
      setLosersSortConfig({ key, direction });
    }
  };

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

  const calculateOverallScore = () => {
    if (!match?.result) return { winsFirstTeam: 0, winsSecondTeam: 0 };
    let winsFirstTeam = 0;
    let winsSecondTeam = 0;

    match.result.forEach((res) => {
      if (res.total_score_first_team > res.total_score_second_team) {
        winsFirstTeam += 1;
      } else if (res.total_score_second_team > res.total_score_first_team) {
        winsSecondTeam += 1;
      }
    });

    return { winsFirstTeam, winsSecondTeam };
  };

  const overallScore = calculateOverallScore();
  const winningTeam =
    overallScore.winsFirstTeam > overallScore.winsSecondTeam
      ? match?.teams?.[0]
      : match?.teams?.[1];

  // Определяем общее количество раундов: максимум из result или stats
  const totalRounds = Math.max(
    match?.result?.length || 0,
    match?.stats?.reduce((max, stat) => Math.max(max, stat.round_of_match), 0) || 1
  );

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

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Матч не найден.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900 relative">
      {/* Main Content */}
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate('/matches')}
          className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Назад к матчам
        </button>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Основная информация</h2>
          <h3 className="text-lg font-semibold mb-2">
            Формат: Best of {match.best_of || 'Не указан'}
          </h3>
          <p className="text-gray-300">
            <span className="font-semibold">Турнир:</span>{' '}
            {match.tournament ? (
              <Link to={`/tournaments/${match.tournament}`} className="text-blue-400 hover:underline">
                {match.tournament}
              </Link>
            ) : (
              'N/A'
            )}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Описание:</span> {match.description || 'N/A'}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Дата:</span>{' '}
            {match.date ? formatDate(match.date) : 'N/A'}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Матч:</span>{' '}
            {Array.isArray(match.teams) && match.teams.length === 2 ? (
              <span>
                <Link to={`/teams/${match.teams[0]}`} className="text-blue-400 hover:underline">
                  {match.teams[0]}
                </Link>{' '}
                vs{' '}
                <Link to={`/teams/${match.teams[1]}`} className="text-red-400 hover:underline">
                  {match.teams[1]}
                </Link>
              </span>
            ) : (
              'N/A'
            )}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Статус:</span> {match.status || 'N/A'}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Общий счёт:</span>{' '}
            {overallScore.winsFirstTeam} - {overallScore.winsSecondTeam}
          </p>
          {Array.isArray(match.result) && match.result.length > 0 && (
            <div>
              <span className="font-semibold">Результаты по картам:</span>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                {match.result.map((res, index) => (
                  <li key={index}>
                    Карта {index + 1} ({res.map}): {res.total_score_first_team} -{' '}
                    {res.total_score_second_team} (Первая половина:{' '}
                    {res.first_half_score_first_team} - {res.first_half_score_second_team}, Вторая
                    половина: {res.second_half_score_first_team} -{' '}
                    {res.second_half_score_second_team}, Овертайм:{' '}
                    {res.overtime_score_first_team} - {res.overtime_score_second_team})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Veto</h2>
          {Array.isArray(match.veto) && match.veto.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300">
              {match.veto.map((vetoItem, index) => (
                <li
                  key={index}
                  className={vetoItem.map_status === 'Banned' ? 'text-red-400' : 'text-green-400'}
                >
                  {vetoItem.initiator} ({vetoItem.map_status}): {vetoItem.map}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 text-center">Veto не указано.</p>
          )}
        </div>

        {totalRounds > 1 && (
          <div className="mb-4 flex justify-center">
            <Pagination
              current={currentRound}
              total={totalRounds * 10}
              pageSize={10}
              onChange={(page) => setCurrentRound(page)}
              className="custom-pagination"
            />
          </div>
        )}

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Статистика игроков (
            <Link to={`/teams/${winningTeam}`} className="text-blue-400 hover:underline">
              {winningTeam}
            </Link>
            ) - Карта {currentRound}: {match.result?.[currentRound - 1]?.map || 'N/A'}
          </h2>
          <p className="text-gray-300 text-center mb-4">Результат: Победа</p>
          {sortedWinnersStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3">Никнейм</th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Kills', 'winners')}
                    >
                      Убийства{' '}
                      {winnersSortConfig.key === 'Kills' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Assists', 'winners')}
                    >
                      Ассисты{' '}
                      {winnersSortConfig.key === 'Assists' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Deaths', 'winners')}
                    >
                      Смерти{' '}
                      {winnersSortConfig.key === 'Deaths' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('K/D', 'winners')}
                    >
                      K/D{' '}
                      {winnersSortConfig.key === 'K/D' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('ADR', 'winners')}
                    >
                      ADR{' '}
                      {winnersSortConfig.key === 'ADR' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Headshots %', 'winners')}
                    >
                      Headshots %{' '}
                      {winnersSortConfig.key === 'Headshots %' &&
                        (winnersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWinnersStats.map((stat, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">
                        <Link
                          to={`/players/${stat.faceit_id || stat.nickname}`}
                          className="text-blue-400 hover:underline"
                        >
                          {stat.nickname}
                        </Link>
                      </td>
                      <td className="p-3">{stat.Kills}</td>
                      <td className="p-3">{stat.Assists}</td>
                      <td className="p-3">{stat.Deaths}</td>
                      <td className="p-3">
                        {stat.Deaths === 0 ? stat.Kills : (stat.Kills / stat.Deaths).toFixed(2)}
                      </td>
                      <td className="p-3">{stat.ADR}</td>
                      <td className="p-3">{stat['Headshots %']}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-center">Статистика недоступна.</p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Статистика игроков (
            <Link
              to={`/teams/${winningTeam === match.teams[0] ? match.teams[1] : match.teams[0]}`}
              className="text-red-400 hover:underline"
            >
              {winningTeam === match.teams[0] ? match.teams[1] : match.teams[0]}
            </Link>
            ) - Карта {currentRound}: {match.result?.[currentRound - 1]?.map || 'N/A'}
          </h2>
          <p className="text-gray-300 text-center mb-4">Результат: Поражение</p>
          {sortedLosersStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3">Никнейм</th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Kills', 'losers')}
                    >
                      Убийства{' '}
                      {losersSortConfig.key === 'Kills' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Assists', 'losers')}
                    >
                      Ассисты{' '}
                      {losersSortConfig.key === 'Assists' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Deaths', 'losers')}
                    >
                      Смерти{' '}
                      {losersSortConfig.key === 'Deaths' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('K/D', 'losers')}
                    >
                      K/D{' '}
                      {losersSortConfig.key === 'K/D' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('ADR', 'losers')}
                    >
                      ADR{' '}
                      {losersSortConfig.key === 'ADR' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort('Headshots %', 'losers')}
                    >
                      Headshots %{' '}
                      {losersSortConfig.key === 'Headshots %' &&
                        (losersSortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLosersStats.map((stat, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">
                        <Link
                          to={`/players/${stat.faceit_id || stat.nickname}`}
                          className="text-blue-400 hover:underline"
                        >
                          {stat.nickname}
                        </Link>
                      </td>
                      <td className="p-3">{stat.Kills}</td>
                      <td className="p-3">{stat.Assists}</td>
                      <td className="p-3">{stat.Deaths}</td>
                      <td className="p-3">
                        {stat.Deaths === 0 ? stat.Kills : (stat.Kills / stat.Deaths).toFixed(2)}
                      </td>
                      <td className="p-3">{stat.ADR}</td>
                      <td className="p-3">{stat['Headshots %']}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-center">Статистика недоступна.</p>
          )}
        </div>
      </div>

      {isAdmin && <AdminMatchPanel match_id={match_id} setMatch={setMatch} refreshMatch={refreshMatch} match={match} />}
    </div>
  );
}

export default MatchDetailPage;