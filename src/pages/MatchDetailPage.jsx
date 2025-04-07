import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pagination, Button } from "antd";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import AdminMatchPanel from "@/components/AdminMatchPanel.jsx";
import { NotificationContext } from "@/context/NotificationContext";

function MatchDetailPage() {
  const { match_id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [winnersSortConfig, setWinnersSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [sortedWinnersStats, setSortedWinnersStats] = useState([]);
  const [losersSortConfig, setLosersSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [sortedLosersStats, setSortedLosersStats] = useState([]);
  const notificationApi = useContext(NotificationContext);

  // Function to display notifications
  const showNotification = (type, message, description) => {
    notificationApi[type]({ message, description, placement: "bottomRight" });
  };

  // Fetch match data when match_id or refreshTrigger changes
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/matches/${match_id}/`);
        setMatch(response.data);
        setError(null);
      } catch (error) {
        console.error(
          "Error fetching match:",
          error.response?.data || error.message,
        );
        setError("Failed to load match data. Check server connection.");
        showNotification("error", "Error!", "Failed to load match data.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [match_id, refreshTrigger]);

  // Trigger a refresh of match data
  const refreshMatch = () => setRefreshTrigger((prev) => prev + 1);

  // Update sorted winners and losers stats based on current round
  useEffect(() => {
    if (match) {
      const winners =
        match.stats?.filter(
          (stat) => stat.Result === 1 && stat.round_of_match === currentRound,
        ) || [];
      const losers =
        match.stats?.filter(
          (stat) => stat.Result === 0 && stat.round_of_match === currentRound,
        ) || [];
      setSortedWinnersStats(winners);
      setSortedLosersStats(losers);
    }
  }, [match, currentRound]);

  // Sort winners stats when sort configuration changes
  useEffect(() => {
    if (winnersSortConfig.key && match) {
      const winners =
        match.stats?.filter(
          (stat) => stat.Result === 1 && stat.round_of_match === currentRound,
        ) || [];
      const sorted = [...winners].sort((a, b) => {
        let aValue = a[winnersSortConfig.key];
        let bValue = b[winnersSortConfig.key];

        if (winnersSortConfig.key === "Headshots %") {
          aValue = a["Headshots %"];
          bValue = b["Headshots %"];
        } else if (winnersSortConfig.key === "K/D") {
          aValue = a.Deaths === 0 ? a.Kills : a.Kills / a.Deaths;
          bValue = b.Deaths === 0 ? b.Kills : b.Kills / b.Deaths;
        }

        if (aValue < bValue)
          return winnersSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return winnersSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
      setSortedWinnersStats(sorted);
    }
  }, [winnersSortConfig, match, currentRound]);

  // Sort losers stats when sort configuration changes
  useEffect(() => {
    if (losersSortConfig.key && match) {
      const losers =
        match.stats?.filter(
          (stat) => stat.Result === 0 && stat.round_of_match === currentRound,
        ) || [];
      const sorted = [...losers].sort((a, b) => {
        let aValue = a[losersSortConfig.key];
        let bValue = b[losersSortConfig.key];

        if (losersSortConfig.key === "Headshots %") {
          aValue = a["Headshots %"];
          bValue = b["Headshots %"];
        } else if (losersSortConfig.key === "K/D") {
          aValue = a.Deaths === 0 ? a.Kills : a.Kills / a.Deaths;
          bValue = b.Deaths === 0 ? b.Kills : b.Kills / b.Deaths;
        }

        if (aValue < bValue)
          return losersSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return losersSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
      setSortedLosersStats(sorted);
    }
  }, [losersSortConfig, match, currentRound]);

  // Handle sorting for winners or losers table
  const handleSort = (key, type) => {
    if (type === "winners") {
      const direction =
        winnersSortConfig.key === key &&
        winnersSortConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      setWinnersSortConfig({ key, direction });
    } else {
      const direction =
        losersSortConfig.key === key &&
        losersSortConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      setLosersSortConfig({ key, direction });
    }
  };

  // Format date string to a localized format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate overall score from match results
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

  // Determine total number of rounds from results or stats
  const totalRounds = Math.max(
    match?.result?.length || 0,
    match?.stats?.reduce(
      (max, stat) => Math.max(max, stat.round_of_match),
      0,
    ) || 1,
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Loading...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  // Render match not found state
  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Match not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900 relative">
      {/* Main Content */}
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate("/matches")}
          className="mb-4 bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 border border-gray-500"
        >
          Back to Matches
        </Button>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Match Information
          </h2>
          <h3 className="text-lg font-semibold mb-2">
            Format: Best of {match.best_of || "Not specified"}
          </h3>
          <p className="text-gray-300">
            <span className="font-semibold">Tournament:</span>{" "}
            {match.tournament ? (
              <Link
                to={`/tournaments/${match.tournament}`}
                className="text-blue-400 hover:underline"
              >
                {match.tournament}
              </Link>
            ) : (
              "N/A"
            )}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Description:</span>{" "}
            {match.description || "N/A"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Date:</span>{" "}
            {match.date ? formatDate(match.date) : "N/A"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Match:</span>{" "}
            {Array.isArray(match.teams) && match.teams.length === 2 ? (
              <span>
                <Link
                  to={`/teams/${match.teams[0]}`}
                  className="text-blue-400 hover:underline"
                >
                  {match.teams[0]}
                </Link>{" "}
                vs{" "}
                <Link
                  to={`/teams/${match.teams[1]}`}
                  className="text-red-400 hover:underline"
                >
                  {match.teams[1]}
                </Link>
              </span>
            ) : (
              "N/A"
            )}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Status:</span>{" "}
            {match.status || "N/A"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Overall Score:</span>{" "}
            {overallScore.winsFirstTeam} - {overallScore.winsSecondTeam}
          </p>
          {Array.isArray(match.result) && match.result.length > 0 && (
            <div>
              <span className="font-semibold">Map Results:</span>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                {match.result.map((res, index) => (
                  <li key={index}>
                    Map {index + 1} ({res.map}): {res.total_score_first_team} -{" "}
                    {res.total_score_second_team} (First Half:{" "}
                    {res.first_half_score_first_team} -{" "}
                    {res.first_half_score_second_team}, Second Half:{" "}
                    {res.second_half_score_first_team} -{" "}
                    {res.second_half_score_second_team}, Overtime:{" "}
                    {res.overtime_score_first_team} -{" "}
                    {res.overtime_score_second_team})
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
                  className={
                    vetoItem.map_status === "Banned"
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {vetoItem.initiator} ({vetoItem.map_status}): {vetoItem.map}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 text-center">No veto specified.</p>
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
            Player Statistics (
            <Link
              to={`/teams/${winningTeam}`}
              className="text-blue-400 hover:underline"
            >
              {winningTeam}
            </Link>
            ) - Map {currentRound}:{" "}
            {match.result?.[currentRound - 1]?.map || "N/A"}
          </h2>
          <p className="text-gray-300 text-center mb-4">Result: Victory</p>
          {sortedWinnersStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3">Nickname</th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Kills", "winners")}
                    >
                      Kills{" "}
                      {winnersSortConfig.key === "Kills" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Assists", "winners")}
                    >
                      Assists{" "}
                      {winnersSortConfig.key === "Assists" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Deaths", "winners")}
                    >
                      Deaths{" "}
                      {winnersSortConfig.key === "Deaths" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("K/D", "winners")}
                    >
                      K/D{" "}
                      {winnersSortConfig.key === "K/D" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("ADR", "winners")}
                    >
                      ADR{" "}
                      {winnersSortConfig.key === "ADR" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Headshots %", "winners")}
                    >
                      Headshots %{" "}
                      {winnersSortConfig.key === "Headshots %" &&
                        (winnersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
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
                        {stat.Deaths === 0
                          ? stat.Kills
                          : (stat.Kills / stat.Deaths).toFixed(2)}
                      </td>
                      <td className="p-3">{stat.ADR}</td>
                      <td className="p-3">{stat["Headshots %"]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-center">Statistics unavailable.</p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Player Statistics (
            <Link
              to={`/teams/${winningTeam === match.teams[0] ? match.teams[1] : match.teams[0]}`}
              className="text-red-400 hover:underline"
            >
              {winningTeam === match.teams[0] ? match.teams[1] : match.teams[0]}
            </Link>
            ) - Map {currentRound}:{" "}
            {match.result?.[currentRound - 1]?.map || "N/A"}
          </h2>
          <p className="text-gray-300 text-center mb-4">Result: Defeat</p>
          {sortedLosersStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3">Nickname</th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Kills", "losers")}
                    >
                      Kills{" "}
                      {losersSortConfig.key === "Kills" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Assists", "losers")}
                    >
                      Assists{" "}
                      {losersSortConfig.key === "Assists" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Deaths", "losers")}
                    >
                      Deaths{" "}
                      {losersSortConfig.key === "Deaths" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("K/D", "losers")}
                    >
                      K/D{" "}
                      {losersSortConfig.key === "K/D" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("ADR", "losers")}
                    >
                      ADR{" "}
                      {losersSortConfig.key === "ADR" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
                    </th>
                    <th
                      className="p-3 cursor-pointer hover:text-blue-400"
                      onClick={() => handleSort("Headshots %", "losers")}
                    >
                      Headshots %{" "}
                      {losersSortConfig.key === "Headshots %" &&
                        (losersSortConfig.direction === "ascending"
                          ? "↑"
                          : "↓")}
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
                        {stat.Deaths === 0
                          ? stat.Kills
                          : (stat.Kills / stat.Deaths).toFixed(2)}
                      </td>
                      <td className="p-3">{stat.ADR}</td>
                      <td className="p-3">{stat["Headshots %"]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-center">Statistics unavailable.</p>
          )}
        </div>
      </div>

      {isAdmin() && (
        <AdminMatchPanel
          match_id={match_id}
          setMatch={setMatch}
          refreshMatch={refreshMatch}
          match={match}
        />
      )}
    </div>
  );
}

export default MatchDetailPage;
