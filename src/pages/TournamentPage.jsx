import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import AdminTournamentPanel from "../components/AdminTournamentPanel";
import { Spin, Alert, Pagination, Button } from "antd";

function TournamentPage() {
  const { tournament_id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // State for managing tournament data, loading status, errors, matches, and pagination
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchesDetails, setMatchesDetails] = useState([]);
  const [currentTeamPage, setCurrentTeamPage] = useState(1);
  const [currentMatchPage, setCurrentMatchPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 5;

  // Fetch tournament data from the API
  const fetchTournament = async () => {
    try {
      const response = await api.get(`/tournaments/${tournament_id}/`);
      setTournament(response.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load tournament data.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger tournament fetch on mount or when tournament_id/refreshTrigger changes
  useEffect(() => {
    fetchTournament();
  }, [tournament_id, refreshTrigger]);

  // Fetch details of matches associated with the tournament
  useEffect(() => {
    const fetchMatchesDetails = async () => {
      if (
        tournament &&
        tournament.matches_id &&
        tournament.matches_id.length > 0
      ) {
        const matchPromises = tournament.matches_id.map(async (matchId) => {
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
  }, [tournament]);

  // Format date string to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Handle pagination change for teams and scroll to top
  const handleTeamPageChange = (page) => {
    setCurrentTeamPage(page);
    window.scrollTo(0, 0);
  };

  // Handle pagination change for matches and scroll to top
  const handleMatchPageChange = (page) => {
    setCurrentMatchPage(page);
    window.scrollTo(0, 0);
  };

  // Refresh tournament data
  const refreshTournament = () => {
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

  // Calculate pagination indices for teams
  const indexOfLastTeam = currentTeamPage * itemsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - itemsPerPage;
  const currentTeams = tournament.teams.slice(
    indexOfFirstTeam,
    indexOfLastTeam,
  );

  // Calculate pagination indices for matches
  const indexOfLastMatch = currentMatchPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matchesDetails.slice(
    indexOfFirstMatch,
    indexOfLastMatch,
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-gray-900">
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 text-white bg-blue-600 hover:!bg-blue-700 px-4 py-2 rounded"
        >
          Back
        </Button>

        {isAdmin() && (
          <AdminTournamentPanel
            tournamentName={tournament_id}
            refreshTournament={refreshTournament}
          />
        )}

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">
            {tournament.name}
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Basic Information
          </h2>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Status:</span> {tournament.status}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {tournament.description || "No description"}
            </p>
            <p>
              <span className="font-semibold">Prize Pool:</span>{" "}
              {tournament.prize || "Not specified"}
            </p>
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {formatDate(tournament.start_date)}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {formatDate(tournament.end_date)}
            </p>
          </div>
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Teams</h2>
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
            <p className="text-gray-400 text-center">No teams available</p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Matches</h2>
          {currentMatches.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 text-gray-300">
                {currentMatches.map((match, index) => {
                  const overallScore = calculateOverallScore(match);
                  return (
                    <div key={index} className="flex items-center">
                      <Link
                        to={`/matches/${match.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        {match.teams && match.teams.length === 2
                          ? `${match.teams[0]} vs ${match.teams[1]}`
                          : "Match with unknown teams"}
                      </Link>
                      <span className="ml-2">
                        ({overallScore.winsFirstTeam} -{" "}
                        {overallScore.winsSecondTeam},{" "}
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
            <p className="text-gray-400 text-center">No matches available</p>
          )}
        </div>

        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Results</h2>
          {tournament.results && tournament.results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tournament.results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center text-center"
                >
                  <p className="text-lg font-semibold">
                    {result.place}
                    {result.place === 1
                      ? "st"
                      : result.place === 2
                        ? "nd"
                        : result.place === 3
                          ? "rd"
                          : "th"}{" "}
                    Place
                  </p>
                  <p className="text-xl font-bold text-blue-400">
                    {result.team ? (
                      <Link
                        to={`/teams/${result.team}`}
                        className="hover:underline"
                      >
                        {result.team}
                      </Link>
                    ) : (
                      "TBD"
                    )}
                  </p>
                  <p className="text-sm text-gray-300">{result.prize}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No results available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TournamentPage;
