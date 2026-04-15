import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lawanKataData from '../../data/lawanKataData';
import { getResultMessage, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function LawanKata() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());

  const currentWord = lawanKataData[currentWordIndex];

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
        'Lawan Kata',
        score,
        totalCorrect,
        Array(totalAttempted),
        duration
      );
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(duration);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setTotalAttempted(0);
    setUsedWords(new Set());
    resetForNewQuestion();
  };

  const resetForNewQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleSelectAnswer = (answer) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentWord.correctAnswer;
    setAnswered(true);

    if (isCorrect) {
      const points = 75;
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
    }

    setTimeout(moveToNextQuestion, 2000);
  };

  const moveToNextQuestion = () => {
    const newUsedWords = new Set(usedWords);
    newUsedWords.add(currentWordIndex);
    setUsedWords(newUsedWords);
    setTotalAttempted((prev) => prev + 1);

    const availableWords = lawanKataData.filter((_, idx) => !newUsedWords.has(idx));
    
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const nextWordIndex = lawanKataData.indexOf(availableWords[randomIndex]);
      setCurrentWordIndex(nextWordIndex);
      resetForNewQuestion();
    } else {
      setGameState('finished');
    }
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-blue-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Lawan Kata!</h2>
            <p className="text-blue-600 text-lg font-semibold">👋 Hai, {playerName}!</p>
          </div>

          <p className="text-center text-gray-600 mb-6">Durasi: 1 Menit</p>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-white/80 text-sm">Skor</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Soal</p>
                <p className="text-2xl font-bold text-white">{currentWordIndex + 1}/{lawanKataData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Waktu</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : 'text-white'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Benar</p>
                <p className="text-2xl font-bold text-white">{totalCorrect}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-all text-lg"
              >
                🏠 Home
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-300 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Soal {currentWordIndex + 1}</h3>
            </div>

            {/* Main Word Display */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 mb-8 border-2 border-blue-300 text-center">
              <p className="text-gray-600 text-lg mb-2">{currentWord.definition}</p>
              <p className="text-5xl font-bold text-blue-700">{currentWord.word}</p>
            </div>

            {/* Options Display */}
            {!answered ? (
              <div className="space-y-4">
                <p className="text-center text-gray-600 font-semibold mb-6">Pilih jawaban yang benar:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentWord.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`p-4 rounded-2xl font-bold text-lg transition-all border-3 transform hover:scale-105 ${
                        selectedAnswer === option
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 scale-105'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 disabled:scale-100 mt-6"
                >
                  Jawab ✓
                </button>
              </div>
            ) : (
              <div className={`text-center p-6 rounded-2xl ${selectedAnswer === currentWord.correctAnswer ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}>
                <p className={`text-2xl font-bold ${selectedAnswer === currentWord.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedAnswer === currentWord.correctAnswer ? '✅ Benar!' : '❌ Salah'}
                </p>
                {selectedAnswer === currentWord.correctAnswer && (
                  <p className="text-lg font-semibold text-green-700 mt-2">+75 Poin! 🎉</p>
                )}
                {selectedAnswer !== currentWord.correctAnswer && (
                  <p className="text-lg font-semibold text-red-700 mt-2">
                    Jawaban yang benar: <span className="text-2xl font-black">{currentWord.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  return (
    <ResultsScreen
      playerName={playerName}
      score={score}
      totalCorrect={totalCorrect}
      totalWords={lawanKataData.length}
      totalAttempted={totalAttempted}
      duration={duration}
      onRestart={() => {
        setGameState('setup');
        setPlayerName('');
        setDuration(60);
      }}
    />
  );
}

function ResultsScreen({ playerName, score, totalCorrect, totalWords, totalAttempted, duration, onRestart }) {
  const navigate = useNavigate();
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const result = getResultMessage(score, totalWords, 'default');
  const quote = getWisdomQuote(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 flex items-center justify-center p-4 pb-12">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-blue-300">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold text-blue-700 mb-2">Selesai!</h2>
          <p className="text-blue-600 text-lg">Terima kasih sudah bermain, {playerName}!</p>
        </div>

        {/* Score Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Skor Akhir</p>
              <p className="text-3xl font-bold text-blue-700">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Akurasi</p>
              <p className="text-3xl font-bold text-blue-700">{accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Benar</p>
              <p className="text-3xl font-bold text-blue-700">{totalCorrect}/{totalAttempted}</p>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200 text-center">
            <div className="text-4xl mb-2">{result.emoji}</div>
            <p className="text-center text-blue-700 font-semibold text-lg">{result.title}</p>
            <p className="text-center text-gray-700 mt-2">{result.message}</p>
          </div>
        </div>

        {/* Wisdom Quote */}
        <div className="bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl p-6 mb-8 border-2 border-blue-300">
          <p className="text-center text-gray-800 font-semibold italic text-lg">💡 "{quote}"</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 Main Lagi
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🏆 Lihat Leaderboard
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-2xl text-lg transition-all"
          >
            🏠 Kembali ke Home
          </button>
        </div>
      </div>
    </div>
  );
}
