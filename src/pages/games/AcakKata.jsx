import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import scrambledWords from '../../data/scrambledData';
import { getResultMessage, normalizeAnswer, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function AcakKata() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());

  const currentWord = scrambledWords[currentWordIndex];

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
        'Acak Kata',
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
    setAnswer('');
    setHintsRevealed(0);
    setAnswered(false);
    setIsCorrect(false);
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;

    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedWord = normalizeAnswer(currentWord.word);
    const isAnswerCorrect = normalizedAnswer === normalizedWord;

    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    if (isAnswerCorrect) {
      const basePoints = 100;
      const hintPenalty = hintsRevealed * 20;
      const points = Math.max(10, basePoints - hintPenalty);
      
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
    }

    setTimeout(moveToNextQuestion, 1500);
  };

  const moveToNextQuestion = () => {
    const newUsedWords = new Set(usedWords);
    newUsedWords.add(currentWordIndex);
    setUsedWords(newUsedWords);
    setTotalAttempted((prev) => prev + 1);

    const availableWords = scrambledWords.filter((_, idx) => !newUsedWords.has(idx));
    
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const nextWordIndex = scrambledWords.indexOf(availableWords[randomIndex]);
      setCurrentWordIndex(nextWordIndex);
      resetForNewQuestion();
    } else {
      setGameState('finished');
    }
  };

  const revealHint = () => {
    if (hintsRevealed < 2) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-blue-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔀</div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Acak Kata!</h2>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-blue-100 pb-12">
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
                <p className="text-2xl font-bold text-white">{currentWordIndex + 1}/{scrambledWords.length}</p>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 mb-8">
            <div className="text-6xl text-center mb-6">{currentWord.emoji || '🔀'}</div>
            
            <p className="text-center text-gray-600 mb-6 text-lg">
              {currentWord.description}
            </p>

            {/* Scrambled Word */}
            <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-2xl p-8 text-center mb-8 border-3 border-blue-400">
              <p className="text-sm text-blue-600 font-semibold mb-3">Susun huruf-huruf ini:</p>
              <div className="text-4xl font-bold text-blue-800 tracking-widest break-all">
                {currentWord.scrambled}
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-3 mb-6">
              {hintsRevealed >= 1 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4">
                  <p className="text-sm text-yellow-800 font-semibold">💡 Hint 1: {currentWord.hint1}</p>
                </div>
              )}
              {hintsRevealed >= 2 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4">
                  <p className="text-sm text-yellow-800 font-semibold">💡 Hint 2: {currentWord.hint2}</p>
                </div>
              )}
              {hintsRevealed < 2 && (
                <button
                  onClick={revealHint}
                  disabled={answered}
                  className="w-full bg-yellow-300 hover:bg-yellow-400 disabled:bg-gray-300 text-yellow-900 font-bold py-3 px-4 rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  💡 Minta Hint ({2 - hintsRevealed} tersisa)
                </button>
              )}
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                disabled={answered}
                placeholder="Ketik jawabanmu di sini..."
                className="w-full px-6 py-4 rounded-2xl border-3 border-blue-300 focus:border-blue-500 focus:outline-none text-lg font-semibold disabled:bg-gray-100"
              />
            </div>

            {/* Submit Button */}
            {!answered && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                Jawab! ✓
              </button>
            )}

            {/* Result Message */}
            {answered && (
              <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-lg ${
                isCorrect
                  ? 'bg-green-200 text-green-800 border-2 border-green-400'
                  : 'bg-red-200 text-red-800 border-2 border-red-400'
              }`}>
                {isCorrect
                  ? `✅ Benar! Kata: "${currentWord.word}"`
                  : `❌ Salah. Jawaban yang benar: "${currentWord.word}"`}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-blue-100 flex items-center justify-center p-4 pb-12">
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
            <p className="text-sm text-blue-600 mt-2">Jawaban Benar: {totalCorrect} / {usedWords.size}</p>
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
