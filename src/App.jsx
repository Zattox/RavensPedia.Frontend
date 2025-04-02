// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NewsDetailPage from './pages/NewsDetailPage';
import MatchesPage from './pages/MatchesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import TeamPage from './pages/TeamPage'; // New import
import PlayerPage from './pages/PlayerPage'; // New import
import EventsPage from './pages/EventsPage'; // New import
import TournamentPage from './pages/TournamentPage'; // New import
import Header from './components/Header';
import MatchesResultsPage from './pages/MatchesResultsPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/news/:news_id" element={<NewsDetailPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/:match_id" element={<MatchDetailPage />} />
            <Route path="/results" element={<MatchesResultsPage />} /> {/* Новый маршрут */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/teams/:team_name" element={<TeamPage />} /> {/* New route */}
            <Route path="/players/:player_id" element={<PlayerPage />} /> {/* New route */}
            <Route path="/tournaments/:tournament_id" element={<TournamentPage />} /> {/* New route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;