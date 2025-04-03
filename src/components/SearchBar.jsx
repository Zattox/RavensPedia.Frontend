// src/components/SearchBar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    players: [],
    teams: [],
    tournaments: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      console.log('Fetching results for query:', query); // Лог запроса
      if (query.length < 2) {
        setResults({ players: [], teams: [], tournaments: [] });
        setIsDropdownOpen(false);
        return;
      }

      try {
        const response = await api.get(`/search/?query=${query}`);
        console.log('API Response:', response.data); // Лог ответа
        const data = response.data || { players: [], teams: [], tournaments: [] };
        setResults({
          players: Array.isArray(data.players) ? data.players : [],
          teams: Array.isArray(data.teams) ? data.teams : [],
          tournaments: Array.isArray(data.tournaments) ? data.tournaments : [],
        });
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults({ players: [], teams: [], tournaments: [] });
        setIsDropdownOpen(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => query.length >= 2 && setIsDropdownOpen(true)}
        placeholder="Search teams, players, tournaments..."
        className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />
      {isDropdownOpen && (
        <div className="absolute top-full left-0 bg-gray-800 text-white rounded-lg shadow-md w-64 max-h-96 overflow-y-auto z-20">
          {(results.players || []).length > 0 && (
            <div className="border-b border-gray-700">
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">Players</div>
              {results.players.map((player) => (
                <Link
                  key={player.nickname}
                  to={`/players/${player.nickname}`}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <span>{player.nickname}</span>
                    {player.team && (
                      <span className="ml-2 text-xs text-gray-400">({player.team})</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {(results.teams || []).length > 0 && (
            <div className="border-b border-gray-700">
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">Teams</div>
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
          {(results.tournaments || []).length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">Tournaments</div>
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
          {(results.players || []).length === 0 &&
            (results.teams || []).length === 0 &&
            (results.tournaments || []).length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400">No results found</div>
            )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;