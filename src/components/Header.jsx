import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";

// Header component for navigation and user authentication controls
function Header() {
  const { isAuthenticated, logout } = useAuth(); // Access authentication status and logout function
  const navigate = useNavigate(); // Hook to programmatically navigate
  const location = useLocation(); // Hook to get current location
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false); // State for events dropdown visibility

  // Handler to perform logout and redirect
  const handleLogout = async () => {
    await logout(); // Call logout function from AuthContext
    const from = location.pathname || "/"; // Determine redirect path
    const redirectTo = ["/login", "/register"].includes(from) ? "/" : from; // Avoid redirecting to login/register
    navigate(redirectTo); // Redirect after logout
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 shadow-md z-10">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Navigation Links */}
        <div className="space-x-4 flex items-center">
          <Link
            to="/"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded"
          >
            News
          </Link>
          <Link
            to="/matches"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded"
          >
            Matches
          </Link>
          <Link
            to="/results"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded"
          >
            Results
          </Link>
          {/* Events Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsEventsDropdownOpen(true)} // Show dropdown on hover
            onMouseLeave={() => setIsEventsDropdownOpen(false)} // Hide dropdown on hover out
          >
            <Link
              to="/events"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded inline-flex items-center"
            >
              Events
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {isEventsDropdownOpen && (
              <div className="absolute top-full left-0 bg-gray-800 text-white rounded-lg shadow-md w-48 z-20">
                <Link
                  to="/events?type=ongoing"
                  className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                >
                  Ongoing Tournaments
                </Link>
                <Link
                  to="/events?type=archive"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Past Tournaments
                </Link>
                <Link
                  to="/events?type=calendar"
                  className="block px-4 py-2 hover:bg-gray-700 rounded-b-lg"
                >
                  Upcoming Tournaments
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Authentication and Search Controls */}
        <div className="flex items-center space-x-4">
          <SearchBar /> {/* Search bar component */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded"
              >
                Profile
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:!bg-red-700 text-white font-bold px-3 py-5 border border-gray-500"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                state={{ from: location }} // Pass current location to login
                className="text-white hover:bg-gray-700 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Button className="bg-blue-600 hover:!bg-blue-700 text-white font-bold px-3 py-5 border border-gray-500">
                <Link to="/register" state={{ from: location }}>
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
