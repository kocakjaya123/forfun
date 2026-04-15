import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import matchingPairs from '../../data/matchingData';
import { getResultMessage, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function MatchingGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60); // fixed 1 minute
  const [timeLeft, setTimeLeft] = useState(60);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [matched, setMatched] = useState(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [totalPairs] = useState(matchingPairs.length);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Save result when game finishes
  useEffect(() => {
    if (gameState === 'finished' && playerName && score >= 0) {
      saveQuizResult(
        playerName,
        'Pasangkan Kata',
        score,
        matched.size / 2,
        Array(totalPairs),
        duration
      );
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(duration);
    initializeCards();
  };

  const initializeCards = () => {
    // Shuffle cards
    const allCards = [];
    matchingPairs.forEach((pair) => {
      allCards.push({ id: pair.id, type: 'word', content: pair.word, pairId: pair.id });
      allCards.push({ id: pair.id + 100, type: 'meaning', content: pair.meaning, pairId: pair.id });
    });

    // Fisher-Yates shuffle
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }

    setCards(allCards);
    setFlipped({});
    setMatched(new Set());
    setScore(0);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (matched.has(index) || flipped[index] || Object.keys(flipped).length > 1) return;

    const newFlipped = { ...flipped, [index]: true };
    setFlipped(newFlipped);

    const flippedIndices = Object.keys(newFlipped).map(Number);

    if (flippedIndices.length === 2) {
      const [idx1, idx2] = flippedIndices;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      setMoves((prev) => prev + 1);

      if (card1.pairId === card2.pairId) {
        // Match found!
        const newMatched = new Set(matched);
        newMatched.add(idx1);
        newMatched.add(idx2);
        setMatched(newMatched);
        setScore((prev) => prev + 100);
        setFlipped({});

        if (newMatched.size === cards.length) {
          setTimeout(() => setGameState('finished'), 500);
        }
      } else {
        // No match
        setTimeout(() => setFlipped({}), 1000);
      }
    }
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-indigo-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">Pasangkan Kata!</h2>
            <p className="text-indigo-600 text-lg font-semibold">👋 Hai, {playerName}!</p>
          </div>

          <p className="text-center text-gray-600 mb-6">Durasi: 1 Menit</p>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
          >
            Mulai Game! 🎮
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-xl transition-all"
          >
            ← Kembali
          </button>

          {/* Logout removed from in-game UI; use navbar logout */}
        </div>
      </div>
    );
  }

  // Game playing screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-400 to-indigo-300 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-white/80 text-sm">Skor</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Pasangan</p>
                <p className="text-2xl font-bold text-white">{matched.size / 2}/{matchingPairs.length}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Waktu</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : 'text-white'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Gerakan</p>
                <p className="text-2xl font-bold text-white">{moves}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-all text-lg"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={matched.has(index)}
                className={`aspect-square rounded-2xl font-bold text-sm transition-all duration-300 transform cursor-pointer border-4 ${
                  matched.has(index)
                    ? 'bg-green-200 border-green-400 opacity-50'
                    : flipped[index]
                    ? 'bg-gradient-to-br from-indigo-300 to-indigo-400 border-indigo-600 text-white'
                    : 'bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-700 text-white hover:scale-105'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center p-2 text-center line-clamp-3">
                  {flipped[index] || matched.has(index) ? (
                    card.content
                  ) : (
                    <span className="text-2xl">❓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    const result = getResultMessage(score, 10);
    const wisdomQuote = getWisdomQuote(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4 pb-12">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-indigo-300 text-center">
          <div className="text-7xl mb-4">{result.emoji}</div>
          
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            {result.title}
          </h2>
          <p className="text-xl font-semibold text-indigo-600 mb-4">{playerName}</p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {result.message}
          </p>

          <div className="bg-indigo-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-indigo-600 mb-2">Total Skor</p>
            <p className="text-4xl font-bold text-indigo-700">{score}</p>
            <p className="text-sm text-indigo-600 mt-2">Gerakan: {moves} | Pasangan: {matched.size / 2}/{matchingPairs.length}</p>
          </div>

          {/* Wisdom Quote */}
          <div className="bg-amber-50 rounded-2xl p-4 mb-8 border-2 border-amber-300">
            <p className="text-sm italic text-amber-900">
              ✨ {wisdomQuote}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setGameState('setup');
                setPlayerName('');
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Bermain Lagi 🔄
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all"
            >
              Kembali ke Home 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }
}
