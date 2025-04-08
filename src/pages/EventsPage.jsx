import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "antd";
import api from "@/api";

function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventType = queryParams.get("type") || "ongoing";

  // State for managing tournaments data, loading status, and pagination
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tournamentsPerPage = 6;

  // Fetch tournaments based on event type when component mounts or eventType changes
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        let endpoint;
        if (eventType === "ongoing") {
          endpoint = "/schedules/tournaments/get_in_progress/";
        } else if (eventType === "archive") {
          endpoint = "/schedules/tournaments/get_completed/";
        } else if (eventType === "calendar") {
          endpoint = "/schedules/tournaments/get_upcoming_scheduled/";
        }

        const response = await api.get(endpoint);
        const tournamentsData = response.data?.data || response.data || [];

        // Sort tournaments based on event type
        let sortedTournaments = Array.isArray(tournamentsData)
          ? tournamentsData
          : [];
        if (eventType === "archive") {
          sortedTournaments = sortedTournaments.sort(
            (a, b) => new Date(b.end_date) - new Date(a.end_date),
          );
        } else if (eventType === "calendar") {
          sortedTournaments = sortedTournaments.sort(
            (a, b) => new Date(a.start_date) - new Date(b.start_date),
          );
        }
        setTournaments(sortedTournaments);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to load tournaments. Check server connection.");
      } finally {
        setLoading(false);
      }
    };

    // Reset state before fetching new data
    setTournaments([]);
    setCurrentPage(1);
    setLoading(true);
    fetchTournaments();
  }, [eventType, location.search]);

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

  // Calculate pagination indices
  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = tournaments.slice(
    indexOfFirstTournament,
    indexOfLastTournament,
  );

  // Handle page change and scroll to top
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Navigate to tournament details page
  const handleTournamentClick = (tournamentName) => {
    navigate(`/tournaments/${tournamentName}`);
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
            {eventType === "ongoing" && "Ongoing Tournaments"}
            {eventType === "archive" && "Past Tournaments"}
            {eventType === "calendar" && "Upcoming Tournaments"}
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
                    <h3 className="text-lg font-semibold mb-2">
                      {tournament.name || "N/A"}
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold">Status:</span>{" "}
                      {tournament.status || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Start Date:</span>{" "}
                      {formatDate(tournament.start_date)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">End Date:</span>{" "}
                      {formatDate(tournament.end_date)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Prize Pool:</span>{" "}
                      {tournament.prize || "Not specified"}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Teams:</span>{" "}
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
              {eventType === "ongoing" && "No ongoing tournaments."}
              {eventType === "archive" && "No past tournaments."}
              {eventType === "calendar" && "No upcoming tournaments."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
