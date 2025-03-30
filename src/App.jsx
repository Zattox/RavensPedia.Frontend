// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NewsDetailPage from './pages/NewsDetailPage';
import MatchesPage from './pages/MatchesPage';
import Header from './components/Header';
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
            <Route path="/results" element={<div>Страница результатов</div>} />
            <Route path="/events" element={<div>Страница событий</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;