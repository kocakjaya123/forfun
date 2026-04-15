import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizzes from '../../data/quizData';
import { getResultMessage, getWisdomQuote } from '../../utils/gameUtils';

export default function LifeQuiz() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState('');
  const [duration, setDuration] = useState(60); // default 1 minute
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [usedQuizzes, setUsedQuizzes] = useState(new Set());
  const [answers, setAnswers] = useState([]);
  const [visitCount, setVisitCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  const currentQuiz = quizzes[currentQuizIndex];

  // Visit counter and leaderboard
  useEffect(() => {
    const count = parseInt(localStorage.getItem('lifeQuizVisits') || '0') + 1;
    localStorage.setItem('lifeQuizVisits', count.toString());
    setVisitCount(count);

    const lb = JSON.parse(localStorage.getItem('lifeQuizLeaderboard') || '[]');
    setLeaderboard(lb);
  }, []);

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

  // Save to leaderboard when finished
  useEffect(() => {
    if (gameState === 'finished' && playerName && score > 0) {
      const newEntry = { name: playerName, score: score, date: new Date().toISOString() };
      const updatedLb = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
      setLeaderboard(updatedLb);
      localStorage.setItem('lifeQuizLeaderboard', JSON.stringify(updatedLb));
    }
  }, [gameState, playerName, score, leaderboard]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(duration);
    setCurrentQuizIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setUsedQuizzes(new Set());
    setAnswers([]);
    resetForNewQuestion();
  };

  const resetForNewQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleSelectAnswer = (option) => {
    if (answered) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuiz.answer;
    setAnswered(true);

    if (isCorrect) {
      const points = 50; // Fixed points for quiz
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
    }

    setAnswers(prev => [...prev, {
      question: currentQuiz.question,
      selected: selectedAnswer,
      correct: currentQuiz.answer,
      isCorrect: isCorrect
    }]);

    setTimeout(moveToNextQuestion, 1500);
  };

  const moveToNextQuestion = () => {
    const newUsedQuizzes = new Set(usedQuizzes);
    newUsedQuizzes.add(currentQuizIndex);
    setUsedQuizzes(newUsedQuizzes);

    const availableQuizzes = quizzes.filter((_, idx) => !newUsedQuizzes.has(idx));
    
    if (availableQuizzes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
      const nextQuizIndex = quizzes.indexOf(availableQuizzes[randomIndex]);
      setCurrentQuizIndex(nextQuizIndex);
      resetForNewQuestion();
    } else {
      setGameState('finished');
    }
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-blue-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Life Quiz!</h2>
            <p className="text-gray-600">Masukkan nama kamu</p>
            <p className="text-sm text-blue-500 mt-2">Total Kunjungan: {visitCount}</p>
          </div>

          {/* Name Input */}
          <div className="mb-8">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Siapa nama kamu?"
              className="w-full px-6 py-4 rounded-2xl border-3 border-blue-300 focus:border-blue-500 focus:outline-none text-lg font-semibold"
            />
          </div>

          <div className="space-y-4 mb-8">
            {[60, 120, 180].map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 border-3 ${
                  duration === dur
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 scale-105'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {dur === 60 ? '⏱️ 1 Menit' : dur === 120 ? '⏱️ 2 Menit' : '⏱️ 3 Menit'}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={!playerName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
          >
            Mulai Quiz! 🎮
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-xl transition-all"
          >
            ← Kembali
          </button>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="mt-6 bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-300">
              <p className="text-sm font-bold text-yellow-700 mb-2">🏆 Leaderboard:</p>
              {leaderboard.map((entry, idx) => (
                <p key={idx} className="text-xs text-yellow-800">
                  {idx + 1}. {entry.name}: {entry.score}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Game playing screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-white/80 text-sm">Skor</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Benar</p>
                <p className="text-2xl font-bold text-white">{totalCorrect}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Waktu</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : 'text-white'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
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

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 mb-8">
            <div className="text-6xl text-center mb-6">{currentQuiz.emoji}</div>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
              {currentQuiz.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuiz.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={answered}
                  className={`w-full p-5 rounded-2xl font-bold text-lg transition-all duration-300 border-3 text-left ${
                    selectedAnswer === option
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-700 scale-105'
                      : answered && option === currentQuiz.answer
                      ? 'bg-green-200 text-green-800 border-green-400'
                      : answered && selectedAnswer === option && option !== currentQuiz.answer
                      ? 'bg-red-200 text-red-800 border-red-400'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                  } ${answered ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{['🔘', '🔵', '⚫', '🟣'][idx]}</span>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {!answered && (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null || selectedAnswer === undefined}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                Jawab! ✓
              </button>
            )}

            {/* Result Message */}
            {answered && (
              <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-lg ${
                selectedAnswer === currentQuiz.answer
                  ? 'bg-green-200 text-green-800 border-2 border-green-400'
                  : 'bg-red-200 text-red-800 border-2 border-red-400'
              }`}>
                {selectedAnswer === currentQuiz.answer
                  ? '✅ Jawaban Benar! +50 poin'
                  : `❌ Jawaban Salah. Jawaban yang benar: ${currentQuiz.answer}`}
              </div>
            )}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 flex items-center justify-center p-4 pb-12">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-blue-300 text-center">
          <div className="text-7xl mb-4">{result.emoji}</div>
          
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            {result.title}
          </h2>
          <p className="text-xl font-semibold text-blue-600 mb-4">{playerName}</p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {result.message}
          </p>

          <div className="bg-blue-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-blue-600 mb-2">Total Skor</p>
            <p className="text-4xl font-bold text-blue-700">{score}</p>
            <p className="text-sm text-blue-600 mt-2">Jawaban Benar: {totalCorrect} / {usedQuizzes.size}</p>
          </div>

          {/* Wisdom Quote */}
          <div className="bg-amber-50 rounded-2xl p-4 mb-8 border-2 border-amber-300">
            <p className="text-sm italic text-amber-900">
              ✨ {wisdomQuote}
            </p>
          </div>

          {/* Answers Review */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border-2 border-gray-300 max-h-60 overflow-y-auto">
            <p className="text-sm font-bold text-gray-700 mb-2">Ringkasan Jawaban:</p>
            {answers.map((ans, idx) => (
              <div key={idx} className="text-xs mb-2">
                <span className="font-semibold">{idx + 1}. {ans.question}</span><br />
                <span className={ans.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  Kamu: {ans.selected} | Benar: {ans.correct}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setGameState('setup');
                setPlayerName('');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
