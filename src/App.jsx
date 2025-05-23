import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NewsDetailPage from "./pages/NewsDetailPage";
import MatchesPage from "./pages/MatchesPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import EventsPage from "./pages/EventsPage";
import TournamentPage from "./pages/TournamentPage";
import Header from "./components/Header";
import MatchesResultsPage from "./pages/MatchesResultsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

// Main application component that sets up routing and providers
function App() {
  return (
    // Router for client-side navigation
    <Router>
      {/* Notification provider for global notification management */}
      <NotificationProvider>
        {/* Authentication provider for user auth state management */}
        <AuthProvider>
          {/* Main layout container with consistent background */}
          <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Header component displayed on all pages */}
            <Header />
            {/* Define all application routes */}
            <Routes>
              {/* Public routes accessible to all users */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/news/:news_id" element={<NewsDetailPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/matches/:match_id" element={<MatchDetailPage />} />
              <Route path="/results" element={<MatchesResultsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/teams/:team_name" element={<TeamPage />} />
              <Route path="/players/:player_id" element={<PlayerPage />} />
              <Route
                path="/tournaments/:tournament_id"
                element={<TournamentPage />}
              />

              {/* Protected route requiring authentication */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
