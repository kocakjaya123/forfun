import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Leaderboard from './pages/Leaderboard';
import Visitors from './pages/Visitors';
import WordGuess from './pages/games/WordGuess';
import LifeQuiz from './pages/games/QuizCinta';
import AcakKata from './pages/games/AcakKata';
import TrueOrFalse from './pages/games/TrueOrFalse';
import MatchingGame from './pages/games/MatchingGame';
import LawanKata from './pages/games/LawanKata';
import { trackVisitor } from './utils/supabaseClient';
import './index.css';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('playerName') || null);
  const location = useLocation();

  useEffect(() => {
    // Track visitor on first load
    if (location.pathname === '/') {
      const visitorName = localStorage.getItem('playerName') || 'guest';
      trackVisitor(visitorName);
    }
  }, []);

  // Session expiry checker (auto-logout after expiry)
  useEffect(() => {
    const checkExpiry = () => {
      const expiryStr = localStorage.getItem('sessionExpiry');
      if (!expiryStr) return;
      const expiry = parseInt(expiryStr, 10);
      if (expiry && Date.now() > expiry) {
        setCurrentUser(null);
        localStorage.removeItem('playerName');
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionExpiry');
      }
    };

    checkExpiry();
    const id = setInterval(checkExpiry, 5000);
    return () => clearInterval(id);
  }, []);

  const handleLoginSuccess = (playerName) => {
    setCurrentUser(playerName);
    localStorage.setItem('playerName', playerName);
  };

  // Check if player is coming from login page or home
  if (!currentUser && location.pathname !== '/login' && location.pathname !== '/leaderboard' && location.pathname !== '/visitors') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={() => {
        setCurrentUser(null);
        localStorage.removeItem('playerName');
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionExpiry');
      }} />
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/word-guess" element={<WordGuess />} />
        <Route path="/quiz-cinta" element={<LifeQuiz />} />
        <Route path="/acak-kata" element={<AcakKata />} />
        <Route path="/true-or-false" element={<TrueOrFalse />} />
        <Route path="/matching" element={<MatchingGame />} />
        <Route path="/lawan-kata" element={<LawanKata />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
