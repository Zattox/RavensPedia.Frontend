import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "antd";
import api from "@/api";

// SearchBar component for searching players, teams, and tournaments
function SearchBar() {
  const [query, setQuery] = useState(""); // State for search query
  const [results, setResults] = useState({
    players: [],
    teams: [],
    tournaments: [],
  }); // State for search results
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  // Effect to fetch search results with debouncing
  useEffect(() => {
    const fetchResults = async () => {
      console.log("Fetching results for query:", query); // Log the query
      if (query.length < 2) {
        setResults({ players: [], teams: [], tournaments: [] }); // Clear results if query is too short
        setIsDropdownOpen(false); // Hide dropdown
        return;
      }

      try {
        const response = await api.get(`/search/?query=${query}`); // Fetch search results from API
        console.log("API Response:", response.data); // Log the API response
        const data = response.data || {
          players: [],
          teams: [],
          tournaments: [],
        }; // Fallback to empty arrays
        setResults({
          players: Array.isArray(data.players) ? data.players : [],
          teams: Array.isArray(data.teams) ? data.teams : [],
          tournaments: Array.isArray(data.tournaments) ? data.tournaments : [],
        }); // Update results state
        setIsDropdownOpen(true); // Show dropdown
      } catch (error) {
        console.error("Error fetching search results:", error); // Log any errors
        setResults({ players: [], teams: [], tournaments: [] }); // Clear results on error
        setIsDropdownOpen(false); // Hide dropdown
      }
    };

    const debounce = setTimeout(fetchResults, 300); // Debounce API call by 300ms
    return () => clearTimeout(debounce); // Cleanup timeout on unmount or query change
  }, [query]);

  // Handler for input change
  const handleInputChange = (e) => {
    setQuery(e.target.value); // Update query state
  };

  // Handler to close dropdown after losing focus
  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200); // Delay to allow link clicks
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => query.length >= 2 && setIsDropdownOpen(true)} // Show dropdown on focus if query is valid
        placeholder="Search teams, players, tournaments..."
        className="custom-input w-64" // Use custom-input class from index.css
      />
      {isDropdownOpen && (
        <div className="absolute top-full left-0 bg-gray-800 text-white rounded-lg shadow-md w-64 max-h-96 overflow-y-auto z-20">
          {/* Players Section */}
          {(results.players || []).length > 0 && (
            <div className="border-b border-gray-700">
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">
                Players
              </div>
              {results.players.map((player) => (
                <Link
                  key={player.nickname}
                  to={`/players/${player.nickname}`}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <span>{player.nickname}</span>
                    {player.team && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({player.team})
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Teams Section */}
          {(results.teams || []).length > 0 && (
            <div className="border-b border-gray-700">
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">
                Teams
              </div>
              {results.teams.map((team) => (
                <Link
                  key={team.name}
                  to={`/teams/${team.name}`}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  {team.name}
                </Link>
              ))}
            </div>
          )}
          {/* Tournaments Section */}
          {(results.tournaments || []).length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">
                Tournaments
              </div>
              {results.tournaments.map((tournament) => (
                <Link
                  key={tournament.name}
                  to={`/tournaments/${tournament.name}`}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  {tournament.name}
                </Link>
              ))}
            </div>
          )}
          {/* No Results Message */}
          {(results.players || []).length === 0 &&
            (results.teams || []).length === 0 &&
            (results.tournaments || []).length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
