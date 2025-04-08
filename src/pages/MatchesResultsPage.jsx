import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import api from "@/api";

function MatchesResultsPage() {
  // State for managing completed matches data, loading status, errors, and pagination
  const [completedMatches, setCompletedMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 6;
  const navigate = useNavigate();

  // Fetch completed matches data when component mounts
  useEffect(() => {
    const fetchCompletedMatches = async () => {
      try {
        const response = await api.get(
          "/schedules/matches/get_last_completed/",
        );
        const completedData = response.data?.data || response.data || [];
        // Sort completed matches by date (latest first)
        const sortedCompletedData = Array.isArray(completedData)
          ? completedData.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        setCompletedMatches(sortedCompletedData);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to load completed matches. Check server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedMatches();
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

  // Calculate pagination indices
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentCompletedMatches = completedMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch,
  );

  // Handle page change and scroll to top
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            Completed Matches
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : completedMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                {currentCompletedMatches.map((match) => (
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
                    <p className="text-gray-300">
                      <span className="font-semibold">Status:</span> COMPLETED
                    </p>
                  </div>
                ))}
              </div>
              {completedMatches.length > matchesPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={matchesPerPage}
                    total={completedMatches.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-white text-center">No completed matches.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchesResultsPage;
