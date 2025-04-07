import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Spin,
  Alert,
  Table,
  Pagination,
  Form,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import AdminPlayerPanel from "@/components/AdminPlayerPanel";

function PlayerPage() {
  const { player_id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailedStatsLoading, setDetailedStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [detailedStatsError, setDetailedStatsError] = useState(null);
  const [currentMatchPage, setCurrentMatchPage] = useState(1);
  const [currentTournamentPage, setCurrentTournamentPage] = useState(1);
  const [matchesDetails, setMatchesDetails] = useState([]);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tournamentsDatesMap, setTournamentsDatesMap] = useState({});
  const [faceitNickname, setFaceitNickname] = useState(null);

  // Format date to DD.MM.YYYY
  const formatDate = (date) => {
    return moment(date).format("DD.MM.YYYY");
  };

  // Fetch player data from the API
  const fetchPlayerData = async () => {
    try {
      const response = await api.get(`/players/${player_id}/`);
      setPlayerData(response.data);
      setTournaments(response.data.tournaments || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching player data:", err);
      setError(
        "Failed to load player data. Check connection or ensure player exists.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch player data on mount or when player_id or refreshTrigger changes
  useEffect(() => {
    fetchPlayerData();
  }, [player_id, refreshTrigger]);

  // Fetch Faceit profile data when playerData is available
  useEffect(() => {
    const fetchFaceitData = async () => {
      try {
        const response = await api.get(
          `/players/${player_id}/get_faceit_profile/`,
        );
        console.log("Faceit Profile Response:", response.data);
        if (response.data.error) {
          setFaceitNickname(null);
        } else {
          setFaceitNickname(response.data.nickname);
        }
      } catch (error) {
        console.error(
          "Error fetching Faceit profile via backend:",
          error.response?.status,
          error.response?.data || error.message,
        );
        setFaceitNickname(null);
      }
    };

    if (playerData) {
      fetchFaceitData();
    }
  }, [playerData, player_id]);

  // Fetch tournament dates for all tournaments the player participated in
  useEffect(() => {
    const fetchTournamentsDates = async () => {
      if (tournaments && tournaments.length > 0) {
        const datesMap = {};
        const tournamentPromises = tournaments.map(async (tournament) => {
          try {
            const response = await api.get(`/tournaments/${tournament}/`);
            return { id: tournament, data: response.data };
          } catch (error) {
            console.error(
              `Error fetching tournament ${tournament} data:`,
              error,
            );
            return { id: tournament, data: null };
          }
        });

        const tournamentsData = await Promise.all(tournamentPromises);
        tournamentsData.forEach(({ id, data }) => {
          if (data) {
            datesMap[id] = {
              start_date: data.start_date,
              end_date: data.end_date,
            };
          }
        });

        setTournamentsDatesMap(datesMap);
      }
    };

    fetchTournamentsDates();
  }, [tournaments]);

  // Fetch basic player stats
  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await api.get(`/players/stats/${player_id}/`, {
          params: { detailed: false },
        });
        setPlayerStats(response.data);
        setStatsError(null);
      } catch (err) {
        console.error("Error fetching player stats:", err);
        setStatsError("Failed to load player statistics.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPlayerStats();
  }, [player_id]);

  // Fetch match details for all matches the player participated in
  useEffect(() => {
    const fetchMatchesDetails = async () => {
      if (playerData && playerData.matches && playerData.matches.length > 0) {
        const uniqueMatchIds = Array.from(
          new Set(playerData.matches.map((match) => match.match_id)),
        );
        const matchPromises = uniqueMatchIds.map(async (matchId) => {
          try {
            const response = await api.get(`/matches/${matchId}/`);
            return response.data;
          } catch (error) {
            console.error(`Error fetching match ${matchId}:`, error);
            return null;
          }
        });

        const matchesData = await Promise.all(matchPromises);
        setMatchesDetails(matchesData.filter((match) => match !== null));
      }
    };

    fetchMatchesDetails();
  }, [playerData]);

  // Fetch detailed stats with optional filters
  const fetchDetailedStats = async (filters = {}) => {
    setDetailedStatsLoading(true);
    try {
      const params = {
        detailed: true,
        start_date: filters.start_date
          ? moment(filters.start_date).format("YYYY-MM-DD")
          : undefined,
        end_date: filters.end_date
          ? moment(filters.end_date).format("YYYY-MM-DD")
          : undefined,
        tournament_ids: filters.tournament_ids || undefined,
      };
      const response = await api.get(`/players/stats/${player_id}/`, {
        params,
      });
      setDetailedStats(response.data);
      setDetailedStatsError(null);
    } catch (err) {
      console.error("Error fetching detailed player stats:", err);
      setDetailedStatsError("Failed to load detailed player statistics.");
    } finally {
      setDetailedStatsLoading(false);
    }
  };

  // Handle form submission for detailed stats filters
  const onFinish = (values) => {
    fetchDetailedStats(values);
  };

  // Calculate overall score for a match
  const calculateOverallScore = (match) => {
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

  // Handle match pagination change
  const handleMatchPageChange = (page) => {
    setCurrentMatchPage(page);
    window.scrollTo(0, 0);
  };

  // Handle tournament pagination change
  const handleTournamentPageChange = (page) => {
    setCurrentTournamentPage(page);
    window.scrollTo(0, 0);
  };

  // Trigger a refresh of player data
  const refreshPlayer = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  // Define columns for basic stats table
  const statsColumns = [
    {
      title: "Total Maps",
      dataIndex: "total_matches",
      key: "total_matches",
    },
    {
      title: "Kills",
      dataIndex: "Kills",
      key: "Kills",
    },
    {
      title: "Assists",
      dataIndex: "Assists",
      key: "Assists",
    },
    {
      title: "Deaths",
      dataIndex: "Deaths",
      key: "Deaths",
    },
    {
      title: "K/D Ratio",
      dataIndex: "KD Ratio",
      key: "KD Ratio",
      render: (text) =>
        text && !isNaN(text) && text !== Infinity ? text.toFixed(2) : "N/A",
    },
    {
      title: "ADR",
      dataIndex: "ADR",
      key: "ADR",
      render: (text) => (text && !isNaN(text) ? text.toFixed(1) : "N/A"),
    },
    {
      title: "K/R Ratio",
      dataIndex: "K/R Ratio",
      key: "K/R Ratio",
      render: (text) => (text && !isNaN(text) ? text.toFixed(2) : "N/A"),
    },
    {
      title: "Headshots %",
      dataIndex: "Headshots %",
      key: "Headshots %",
      render: (text) => (text && !isNaN(text) ? `${text.toFixed(1)}%` : "N/A"),
    },
    {
      title: "Win Rate",
      dataIndex: "Wins %",
      key: "Wins %",
      render: (text) => (text && !isNaN(text) ? `${text.toFixed(1)}%` : "N/A"),
    },
  ];

  const uniqueMatches = matchesDetails;
  const indexOfLastMatch = currentMatchPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = uniqueMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch,
  );

  const indexOfLastTournament = currentTournamentPage * itemsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - itemsPerPage;
  const currentTournaments =
    playerData?.tournaments?.slice(
      indexOfFirstTournament,
      indexOfLastTournament,
    ) || [];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 border border-gray-500"
        >
          Back
        </Button>

        {isAdmin() && (
          <AdminPlayerPanel
            player_nickname={player_id}
            refreshPlayer={refreshPlayer}
          />
        )}

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Player Profile: {playerData.nickname}
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Basic Information
          </h2>
          <p className="text-gray-300 mb-2">
            <strong>Steam Profile:</strong>{" "}
            <a
              href={`https://steamcommunity.com/profiles/${playerData.steam_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {playerData.nickname}
            </a>
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Faceit Profile:</strong>{" "}
            {faceitNickname ? (
              <a
                href={`https://www.faceit.com/en/players/${faceitNickname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {faceitNickname}
              </a>
            ) : (
              playerData.faceit_id || "Not specified"
            )}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Faceit ELO:</strong> {playerData.faceit_elo}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Name:</strong> {playerData.name || "Not specified"}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Surname:</strong> {playerData.surname || "Not specified"}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Team:</strong>{" "}
            {playerData.team ? (
              <a
                href={`/teams/${playerData.team}`}
                className="text-blue-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/teams/${playerData.team}`);
                }}
              >
                {playerData.team}
              </a>
            ) : (
              "No team"
            )}
          </p>
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Matches</h2>
          {currentMatches.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 text-gray-300">
                {currentMatches.map((match, index) => {
                  const overallScore = calculateOverallScore(match);
                  const playerStatsForMatch = match.stats.filter(
                    (stat) => stat.nickname === playerData.nickname,
                  );
                  const mapsWonByPlayer = playerStatsForMatch.filter(
                    (stat) => stat.Result === 1,
                  ).length;
                  const totalMaps = playerStatsForMatch.length;
                  const isWinner =
                    totalMaps > 0 && mapsWonByPlayer > totalMaps / 2;

                  return (
                    <div key={index} className="flex items-center">
                      <a
                        href={`/matches/${match.id}`}
                        className={`${isWinner ? "text-green-400" : "text-red-400"} hover:underline`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/matches/${match.id}`);
                        }}
                      >
                        {match.teams && match.teams.length === 2 ? (
                          <>
                            {match.teams[0]} vs {match.teams[1]}
                          </>
                        ) : (
                          "Match with unknown teams"
                        )}
                      </a>
                      <span className="ml-2">
                        ({isWinner ? "Victory" : "Defeat"}{" "}
                        {overallScore.winsFirstTeam} -{" "}
                        {overallScore.winsSecondTeam})
                      </span>
                    </div>
                  );
                })}
              </div>
              {uniqueMatches.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentMatchPage}
                    pageSize={itemsPerPage}
                    total={uniqueMatches.length}
                    onChange={handleMatchPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300 text-center">
              Player has not participated in any matches.
            </p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Tournaments</h2>
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
                      {tournamentsDatesMap[tournament]
                        ? `(from ${formatDate(tournamentsDatesMap[tournament].start_date)} to ${formatDate(tournamentsDatesMap[tournament].end_date)})`
                        : "(Loading dates...)"}
                    </span>
                  </div>
                ))}
              </div>
              {playerData.tournaments.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentTournamentPage}
                    pageSize={itemsPerPage}
                    total={playerData.tournaments.length}
                    onChange={handleTournamentPageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300 text-center">
              Player has not participated in any tournaments.
            </p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Basic Statistics
          </h2>
          {statsLoading ? (
            <Spin />
          ) : statsError ? (
            <Alert message={statsError} type="error" showIcon />
          ) : playerStats && playerStats.total_matches > 0 ? (
            <Table
              dataSource={[playerStats]}
              columns={statsColumns}
              pagination={false}
              rowKey="nickname"
              className="custom-table"
            />
          ) : (
            <p className="text-gray-300 text-center">Statistics unavailable.</p>
          )}
          <Button
            type="primary"
            onClick={() => {
              setShowDetailedStats(!showDetailedStats);
              if (!detailedStats && !showDetailedStats) fetchDetailedStats();
            }}
            className="mt-4 bg-blue-600 hover:!bg-blue-700"
          >
            {showDetailedStats
              ? "Hide Detailed Statistics"
              : "Show Detailed Statistics"}
          </Button>
        </div>

        {showDetailedStats && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Detailed Statistics
            </h2>
            <h3 className="text-xl font-semibold mb-4">
              Filters for Detailed Statistics
            </h3>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="text-white mb-6 custom-form"
            >
              <Form.Item
                name="start_date"
                label={
                  <span className="text-gray-300">
                    Start Date{" "}
                    <Tooltip title="Select the start date for filtering statistics (leave empty for all dates)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  className="custom-input w-full"
                  placeholder="Select start date (optional)"
                />
              </Form.Item>
              <Form.Item
                name="end_date"
                label={
                  <span className="text-gray-300">
                    End Date{" "}
                    <Tooltip title="Select the end date for filtering statistics (leave empty for all dates)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  className="custom-input w-full"
                  placeholder="Select end date (optional)"
                />
              </Form.Item>
              <Form.Item
                name="tournament_ids"
                label={
                  <span className="text-gray-300">
                    Tournaments{" "}
                    <Tooltip title="Select tournaments to filter statistics (leave empty for all tournaments)">
                      <InfoCircleOutlined className="text-gray-500" />
                    </Tooltip>
                  </span>
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Select tournaments (optional)"
                  className="custom-select w-full"
                  options={tournaments.map((tournament) => ({
                    label: tournament,
                    value: tournament,
                  }))}
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => form.resetFields()}
                    className="text-white border-gray-500"
                  >
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-600 hover:!bg-blue-700"
                  >
                    Apply
                  </Button>
                </div>
              </Form.Item>
            </Form>

            {detailedStatsLoading ? (
              <Spin />
            ) : detailedStatsError ? (
              <Alert message={detailedStatsError} type="error" showIcon />
            ) : detailedStats ? (
              <div className="space-y-6">
                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Overall Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Total Matches:</strong>{" "}
                      {detailedStats.total_matches}
                    </p>
                    <p>
                      <strong>Kills:</strong> {detailedStats.Kills || 0}
                    </p>
                    <p>
                      <strong>Assists:</strong> {detailedStats.Assists || 0}
                    </p>
                    <p>
                      <strong>Deaths:</strong> {detailedStats.Deaths || 0}
                    </p>
                    <p>
                      <strong>ADR:</strong>{" "}
                      {detailedStats.ADR ? detailedStats.ADR.toFixed(1) : "N/A"}
                    </p>
                    <p>
                      <strong>Headshots %:</strong>{" "}
                      {detailedStats["Headshots %"]
                        ? `${detailedStats["Headshots %"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Additional Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>MVPs:</strong> {detailedStats.MVPs || 0}
                    </p>
                    <p>
                      <strong>Damage:</strong> {detailedStats.Damage || 0}
                    </p>
                    <p>
                      <strong>Headshots:</strong> {detailedStats.Headshots || 0}
                    </p>
                    <p>
                      <strong>K/D Ratio:</strong>{" "}
                      {detailedStats["K/D Ratio"]
                        ? detailedStats["K/D Ratio"].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>K/R Ratio:</strong>{" "}
                      {detailedStats["K/R Ratio"]
                        ? detailedStats["K/R Ratio"].toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Multikills
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Double Kills:</strong>{" "}
                      {detailedStats["Double Kills"] || 0}
                    </p>
                    <p>
                      <strong>Triple Kills:</strong>{" "}
                      {detailedStats["Triple Kills"] || 0}
                    </p>
                    <p>
                      <strong>Quadro Kills:</strong>{" "}
                      {detailedStats["Quadro Kills"] || 0}
                    </p>
                    <p>
                      <strong>Penta Kills:</strong>{" "}
                      {detailedStats["Penta Kills"] || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Clutches
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Clutch Kills:</strong>{" "}
                      {detailedStats["Clutch Kills"] || 0}
                    </p>
                    <p>
                      <strong>1v1 Situations:</strong>{" "}
                      {detailedStats["1v1Count"] || 0}
                    </p>
                    <p>
                      <strong>1v2 Situations:</strong>{" "}
                      {detailedStats["1v2Count"] || 0}
                    </p>
                    <p>
                      <strong>1v1 Wins:</strong> {detailedStats["1v1Wins"] || 0}
                    </p>
                    <p>
                      <strong>1v2 Wins:</strong> {detailedStats["1v2Wins"] || 0}
                    </p>
                    <p>
                      <strong>1v1 Win Rate:</strong>{" "}
                      {detailedStats["Match 1v1 Win Rate"]
                        ? `${detailedStats["Match 1v1 Win Rate"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>1v2 Win Rate:</strong>{" "}
                      {detailedStats["Match 1v2 Win Rate"]
                        ? `${detailedStats["Match 1v2 Win Rate"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Entries
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>First Kills:</strong>{" "}
                      {detailedStats["First Kills"] || 0}
                    </p>
                    <p>
                      <strong>Entry Count:</strong>{" "}
                      {detailedStats["Entry Count"] || 0}
                    </p>
                    <p>
                      <strong>Entry Wins:</strong>{" "}
                      {detailedStats["Entry Wins"] || 0}
                    </p>
                    <p>
                      <strong>Match Entry Rate:</strong>{" "}
                      {detailedStats["Match Entry Rate"]
                        ? detailedStats["Match Entry Rate"].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Match Entry Success Rate:</strong>{" "}
                      {detailedStats["Match Entry Success Rate"]
                        ? `${detailedStats["Match Entry Success Rate"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Sniper Kills
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Sniper Kills:</strong>{" "}
                      {detailedStats["Sniper Kills"] || 0}
                    </p>
                    <p>
                      <strong>Sniper Kills per Round:</strong>{" "}
                      {detailedStats["Sniper Kill Rate per Round"]
                        ? detailedStats["Sniper Kill Rate per Round"].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Sniper Kills per Match:</strong>{" "}
                      {detailedStats["Sniper Kill Rate per Match"]
                        ? detailedStats["Sniper Kill Rate per Match"].toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Special Kills
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Pistol Kills:</strong>{" "}
                      {detailedStats["Pistol Kills"] || 0}
                    </p>
                    <p>
                      <strong>Knife Kills:</strong>{" "}
                      {detailedStats["Knife Kills"] || 0}
                    </p>
                    <p>
                      <strong>Zeus Kills:</strong>{" "}
                      {detailedStats["Zeus Kills"] || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Utility
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Utility Count:</strong>{" "}
                      {detailedStats["Utility Count"] || 0}
                    </p>
                    <p>
                      <strong>Utility Successes:</strong>{" "}
                      {detailedStats["Utility Successes"] || 0}
                    </p>
                    <p>
                      <strong>Enemies Hit by Utility:</strong>{" "}
                      {detailedStats["Utility Enemies"] || 0}
                    </p>
                    <p>
                      <strong>Utility Damage:</strong>{" "}
                      {detailedStats["Utility Damage"] || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Average Utility Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Utility Usage per Round:</strong>{" "}
                      {detailedStats["Utility Usage per Round"]
                        ? detailedStats["Utility Usage per Round"].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Utility Damage Success Rate per Match:</strong>{" "}
                      {detailedStats["Utility Damage Success Rate per Match"]
                        ? detailedStats[
                            "Utility Damage Success Rate per Match"
                          ].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Utility Success Rate per Match:</strong>{" "}
                      {detailedStats["Utility Success Rate per Match"]
                        ? `${detailedStats["Utility Success Rate per Match"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Utility Damage per Round in Match:</strong>{" "}
                      {detailedStats["Utility Damage per Round in a Match"]
                        ? detailedStats[
                            "Utility Damage per Round in a Match"
                          ].toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Flashes
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Flash Count:</strong>{" "}
                      {detailedStats["Flash Count"] || 0}
                    </p>
                    <p>
                      <strong>Enemies Flashed:</strong>{" "}
                      {detailedStats["Enemies Flashed"] || 0}
                    </p>
                    <p>
                      <strong>Flash Successes:</strong>{" "}
                      {detailedStats["Flash Successes"] || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1">
                    Average Flash Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Flashes per Round in Match:</strong>{" "}
                      {detailedStats["Flashes per Round in a Match"]
                        ? detailedStats["Flashes per Round in a Match"].toFixed(
                            2,
                          )
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Enemies Flashed per Round in Match:</strong>{" "}
                      {detailedStats["Enemies Flashed per Round in a Match"]
                        ? detailedStats[
                            "Enemies Flashed per Round in a Match"
                          ].toFixed(2)
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Flash Success Rate per Match:</strong>{" "}
                      {detailedStats["Flash Success Rate per Match"]
                        ? `${detailedStats["Flash Success Rate per Match"].toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-center">
                Detailed statistics unavailable.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerPage;
