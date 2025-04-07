import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import api from "@/api";

function MatchesPage() {
  // State for managing matches data, loading status, errors, and pagination
  const [inProgressMatches, setInProgressMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const matchesPerPage = 4;
  const navigate = useNavigate();

  // Fetch matches data when component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const inProgressResponse = await api.get(
          "/schedules/matches/get_in_progress/",
        );
        const inProgressData =
          inProgressResponse.data?.data || inProgressResponse.data || [];
        setInProgressMatches(
          Array.isArray(inProgressData) ? inProgressData : [],
        );

        const scheduledResponse = await api.get(
          "/schedules/matches/get_upcoming_scheduled/",
          {
            params: { num_matches: 50 },
          },
        );
        const scheduledData =
          scheduledResponse.data?.data || scheduledResponse.data || [];
        const sortedScheduledData = Array.isArray(scheduledData)
          ? scheduledData.sort((a, b) => new Date(a.date) - new Date(b.date))
          : [];
        setScheduledMatches(sortedScheduledData);

        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to load matches. Check server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Format date string to a readable format
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

  // Calculate pagination indices for in-progress matches
  const indexOfLastInProgress = inProgressPage * matchesPerPage;
  const indexOfFirstInProgress = indexOfLastInProgress - matchesPerPage;
  const currentInProgressMatches = inProgressMatches.slice(
    indexOfFirstInProgress,
    indexOfLastInProgress,
  );

  // Calculate pagination indices for scheduled matches
  const indexOfLastScheduled = scheduledPage * matchesPerPage;
  const indexOfFirstScheduled = indexOfLastScheduled - matchesPerPage;
  const currentScheduledMatches = scheduledMatches.slice(
    indexOfFirstScheduled,
    indexOfLastScheduled,
  );

  // Handle page change for in-progress matches and scroll to top
  const handleInProgressPageChange = (page) => {
    setInProgressPage(page);
    window.scrollTo(0, 0);
  };

  // Handle page change for scheduled matches and scroll to top
  const handleScheduledPageChange = (page) => {
    setScheduledPage(page);
    window.scrollTo(0, 0);
  };

  // Navigate to match details page
  const handleMatchClick = (matchId) => {
    navigate(`/matches/${matchId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24 bg-gray-900">
      <div className="w-full">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Ongoing Matches
          </h2>
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
                      Format: Best of {match.best_of || "N/A"}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Tournament:</span>{" "}
                      {match.tournament || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Date:</span>{" "}
                      {match.date ? formatDate(match.date) : "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Match:</span>{" "}
                      {Array.isArray(match.teams) &&
                      match.teams.length === 2 ? (
                        <span>
                          <span className="text-blue-400">
                            {match.teams[0]}
                          </span>{" "}
                          vs{" "}
                          <span className="text-red-400">{match.teams[1]}</span>
                        </span>
                      ) : (
                        "N/A"
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
            <p className="text-white text-center">No ongoing matches.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Scheduled Matches
          </h2>
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
                      Format: Best of {match.best_of || "N/A"}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Tournament:</span>{" "}
                      {match.tournament || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Date:</span>{" "}
                      {match.date ? formatDate(match.date) : "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Match:</span>{" "}
                      {Array.isArray(match.teams) &&
                      match.teams.length === 2 ? (
                        <span>
                          <span className="text-blue-400">
                            {match.teams[0]}
                          </span>{" "}
                          vs{" "}
                          <span className="text-red-400">{match.teams[1]}</span>
                        </span>
                      ) : (
                        "N/A"
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
            <p className="text-white text-center">No scheduled matches.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;
