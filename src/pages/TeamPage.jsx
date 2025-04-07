import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pagination, Table, Button, Spin, Alert } from "antd";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import AdminTeamPanel from "@/components/AdminTeamPanel";

function TeamPage() {
  const { team_name } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // State for managing team data, loading status, errors, and pagination
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchesDetails, setMatchesDetails] = useState([]);
  const [opponentsEloMap, setOpponentsEloMap] = useState({});
  const [teamStats, setTeamStats] = useState([]);
  const [sortedTeamStats, setSortedTeamStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [playersEloMap, setPlayersEloMap] = useState({});
  const [tournamentsDatesMap, setTournamentsDatesMap] = useState({});
  const [currentMatchPage, setCurrentMatchPage] = useState(1);
  const [currentTournamentPage, setCurrentTournamentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 5;

  // Fetch team data from the API
  const fetchTeam = async () => {
    try {
      const response = await api.get(`/teams/${team_name}/`);
      setTeam(response.data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to load team data. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger team fetch on mount or when team_name/refreshTrigger changes
  useEffect(() => {
    fetchTeam();
  }, [team_name, refreshTrigger]);

  // Fetch details of matches associated with the team
  useEffect(() => {
    const fetchMatchesDetails = async () => {
      if (team && team.matches_id && team.matches_id.length > 0) {
        const matchPromises = team.matches_id.map(async (matchId) => {
          try {
            const response = await api.get(`/matches/${matchId}/`);
            return response.data;
          } catch (error) {
            console.log(error);
            return null;
          }
        });

        const matchesData = await Promise.all(matchPromises);
        setMatchesDetails(matchesData.filter((match) => match !== null));
      }
    };

    fetchMatchesDetails();
  }, [team]);

  // Fetch ELO ratings of opposing teams
  useEffect(() => {
    const fetchOpponentsElo = async () => {
      if (matchesDetails && matchesDetails.length > 0) {
        const eloMap = {};

        for (const match of matchesDetails) {
          if (match.teams && match.teams.length === 2) {
            const opponentTeam =
              match.teams[0] === team_name ? match.teams[1] : match.teams[0];
            try {
              const response = await api.get(`/teams/${opponentTeam}/`);
              const opponentElo = response.data.average_faceit_elo;
              eloMap[match.id] = opponentElo !== null ? opponentElo : "N/A";
            } catch (error) {
              console.log(error);
              eloMap[match.id] = "N/A";
            }
          } else {
            eloMap[match.id] = "N/A";
          }
        }

        setOpponentsEloMap(eloMap);
      }
    };

    fetchOpponentsElo();
  }, [matchesDetails, team_name]);

  // Fetch team statistics for maps
  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await api.get(`/teams/stats/${team_name}/`);
        setTeamStats(response.data);
        setSortedTeamStats(response.data);
      } catch (error) {
        console.log(error);
        setTeamStats([]);
        setSortedTeamStats([]);
      }
    };

    fetchTeamStats();
  }, [team_name]);

  // Fetch ELO ratings of team players
  useEffect(() => {
    const fetchPlayersElo = async () => {
      if (team && team.players && team.players.length > 0) {
        const eloMap = {};

        const playerPromises = team.players.map(async (player) => {
          try {
            const playerId = player.faceit_id || player;
            const response = await api.get(`/players/${playerId}/`);
            const playerElo = response.data.faceit_elo;
            eloMap[player] =
              playerElo !== null && playerElo !== undefined ? playerElo : "N/A";
          } catch (error) {
            console.log(error);
            eloMap[player] = "N/A";
          }
        });

        await Promise.all(playerPromises);
        setPlayersEloMap(eloMap);
      }
    };

    fetchPlayersElo();
  }, [team]);

  // Fetch start and end dates of tournaments
  useEffect(() => {
    const fetchTournamentsDates = async () => {
      if (team && team.tournaments && team.tournaments.length > 0) {
        const datesMap = {};

        const tournamentPromises = team.tournaments.map(async (tournament) => {
          try {
            const response = await api.get(`/tournaments/${tournament}/`);
            const { start_date, end_date } = response.data;
            datesMap[tournament] = {
              start_date: start_date || "N/A",
              end_date: end_date || "N/A",
            };
          } catch (error) {
            console.log(error);
            datesMap[tournament] = { start_date: "N/A", end_date: "N/A" };
          }
        });

        await Promise.all(tournamentPromises);
        setTournamentsDatesMap(datesMap);
      }
    };

    fetchTournamentsDates();
  }, [team]);

  // Sort team statistics based on sort configuration
  useEffect(() => {
    if (sortConfig.key && teamStats.length > 0) {
      const sorted = [...teamStats].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
      setSortedTeamStats(sorted);
    } else {
      setSortedTeamStats(teamStats);
    }
  }, [sortConfig, teamStats]);

  // Handle column sorting for team statistics table
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  // Calculate overall score for a match based on results
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

  // Format date string to a readable format
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle pagination change for matches and scroll to top
  const handleMatchPageChange = (page) => {
    setCurrentMatchPage(page);
    window.scrollTo(0, 0);
  };

  // Handle pagination change for tournaments and scroll to top
  const handleTournamentPageChange = (page) => {
    setCurrentTournamentPage(page);
    window.scrollTo(0, 0);
  };

  // Refresh team data
  const refreshTeam = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Calculate pagination indices for matches
  const indexOfLastMatch = currentMatchPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matchesDetails.slice(
    indexOfFirstMatch,
    indexOfLastMatch,
  );

  // Calculate pagination indices for tournaments
  const indexOfLastTournament = currentTournamentPage * itemsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - itemsPerPage;
  const currentTournaments =
    team?.tournaments?.slice(indexOfFirstTournament, indexOfLastTournament) ||
    [];

  // Define columns for the team statistics table
  const columns = [
    {
      title: "Map",
      dataIndex: "map",
      key: "map",
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort("matches_played")}
        >
          Matches Played{" "}
          {sortConfig.key === "matches_played" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </span>
      ),
      dataIndex: "matches_played",
      key: "matches_played",
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort("matches_won")}
        >
          Wins{" "}
          {sortConfig.key === "matches_won" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </span>
      ),
      dataIndex: "matches_won",
      key: "matches_won",
    },
    {
      title: (
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => handleSort("win_rate")}
        >
          Win Rate{" "}
          {sortConfig.key === "win_rate" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </span>
      ),
      dataIndex: "win_rate",
      key: "win_rate",
      render: (text) => `${text}%`,
    },
  ];

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

  // Render message if team is not found
  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Team not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900 relative">
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 text-white bg-blue-600 hover:!bg-blue-700 px-4 py-2 rounded"
        >
          Back
        </Button>

        {/* Team information */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">{team.name}</h1>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Description:</span>{" "}
            {team.description || "No description"}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Average FACEIT ELO:</span>{" "}
            {team.average_faceit_elo !== null ? team.average_faceit_elo : "N/A"}
          </p>
        </div>

        {/* Admin panel for team management */}
        {isAdmin() && (
          <AdminTeamPanel team_name={team_name} refreshTeam={refreshTeam} />
        )}

        {/* Players section */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
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
                    (ELO: {playersEloMap[player] || "Loading..."})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 text-center">No players available.</p>
          )}
        </div>

        {/* Matches section */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Matches</h2>
          {currentMatches && currentMatches.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 text-gray-300">
                {currentMatches.map((match, index) => {
                  const overallScore = calculateOverallScore(match);
                  const isWinner =
                    match.teams &&
                    ((overallScore.winsFirstTeam >
                      overallScore.winsSecondTeam &&
                      match.teams[0] === team_name) ||
                      (overallScore.winsSecondTeam >
                        overallScore.winsFirstTeam &&
                        match.teams[1] === team_name));

                  return (
                    <div key={index} className="flex items-center">
                      <Link
                        to={`/matches/${match.id}`}
                        className={`${isWinner ? "text-green-400" : "text-red-400"} hover:underline`}
                      >
                        {match.teams && match.teams.length === 2 ? (
                          <>
                            {match.teams[0]} vs {match.teams[1]}
                          </>
                        ) : (
                          "Match with unknown teams"
                        )}
                      </Link>
                      <span className="ml-2">
                        ({isWinner ? "Win" : "Loss"}{" "}
                        {overallScore.winsFirstTeam} -{" "}
                        {overallScore.winsSecondTeam}, Opponent ELO:{" "}
                        {opponentsEloMap[match.id] || "Loading..."},{" "}
                        {match.date ? formatDate(match.date) : "Date unknown"})
                      </span>
                    </div>
                  );
                })}
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
            <p className="text-gray-300 text-center">No matches available.</p>
          )}
        </div>

        {/* Tournaments section */}
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
            <p className="text-gray-300 text-center">
              No tournaments available.
            </p>
          )}
        </div>

        {/* Map statistics section */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Map Statistics
          </h2>
          {sortedTeamStats && sortedTeamStats.length > 0 ? (
            <Table
              dataSource={sortedTeamStats}
              columns={columns}
              pagination={false}
              rowKey="map"
              className="custom-table"
            />
          ) : (
            <p className="text-gray-300 text-center">
              No map statistics available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
