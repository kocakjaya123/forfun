import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import truthOrFalseQuestions from '../../data/truthOrFalseData';
import { getResultMessage, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function TrueOrFalse() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState(new Set());

  const currentQuestion = truthOrFalseQuestions[currentQuestionIndex];

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
        'Benar atau Salah',
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
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setTotalAttempted(0);
    setUsedQuestions(new Set());
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

    const isCorrect = selectedAnswer === currentQuestion.answer;
    setAnswered(true);

    if (isCorrect) {
      const points = 75;
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
    }

    setTimeout(moveToNextQuestion, 2000);
  };

  const moveToNextQuestion = () => {
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(currentQuestionIndex);
    setUsedQuestions(newUsedQuestions);
    setTotalAttempted((prev) => prev + 1);

    const availableQuestions = truthOrFalseQuestions.filter((_, idx) => !newUsedQuestions.has(idx));
    
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const nextQuestionIndex = truthOrFalseQuestions.indexOf(availableQuestions[randomIndex]);
      setCurrentQuestionIndex(nextQuestionIndex);
      resetForNewQuestion();
    } else {
      setGameState('finished');
    }
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-rose-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-3xl font-bold text-rose-700 mb-2">Benar atau Salah?</h2>
            <p className="text-rose-600 text-lg font-semibold">👋 Hai, {playerName}!</p>
          </div>

          <p className="text-center text-gray-600 mb-6">Durasi: 1 Menit</p>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
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
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-rose-100 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-400 to-rose-300 shadow-lg sticky top-0 z-20">
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
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-rose-200 mb-8">
            <div className="text-6xl text-center mb-6">🤔</div>
            
            <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-2xl p-8 mb-8 border-3 border-rose-300">
              <p className="text-xl text-gray-800 text-center font-semibold leading-relaxed">
                {currentQuestion.statement}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleSelectAnswer(true)}
                disabled={answered}
                className={`w-full p-6 rounded-2xl font-bold text-xl transition-all duration-300 border-3 ${
                  selectedAnswer === true
                    ? 'bg-green-300 text-green-900 border-green-600 scale-105'
                    : answered && currentQuestion.answer === true
                    ? 'bg-green-400 text-green-900 border-green-600'
                    : answered && selectedAnswer === true
                    ? 'bg-red-300 text-red-900 border-red-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-rose-300 hover:bg-green-50'
                } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                ✅ BENAR
              </button>

              <button
                onClick={() => handleSelectAnswer(false)}
                disabled={answered}
                className={`w-full p-6 rounded-2xl font-bold text-xl transition-all duration-300 border-3 ${
                  selectedAnswer === false
                    ? 'bg-red-300 text-red-900 border-red-600 scale-105'
                    : answered && currentQuestion.answer === false
                    ? 'bg-red-400 text-red-900 border-red-600'
                    : answered && selectedAnswer === false
                    ? 'bg-green-300 text-green-900 border-green-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-rose-300 hover:bg-red-50'
                } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                ❌ SALAH
              </button>
            </div>

            {/* Submit Button */}
            {!answered && (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                Jawab! ✓
              </button>
            )}

            {/* Result Message */}
            {answered && (
              <div className={`mt-6 p-4 rounded-2xl text-center ${
                selectedAnswer === currentQuestion.answer
                  ? 'bg-green-200 text-green-800 border-2 border-green-400'
                  : 'bg-red-200 text-red-800 border-2 border-red-400'
              }`}>
                <p className="font-bold text-lg mb-2">
                  {selectedAnswer === currentQuestion.answer ? '✅ Jawaban Benar!' : '❌ Jawaban Salah!'}
                </p>
                <p className="text-sm">{currentQuestion.explanation}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-rose-100 flex items-center justify-center p-4 pb-12">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-rose-300 text-center">
          <div className="text-7xl mb-4">{result.emoji}</div>
          
          <h2 className="text-3xl font-bold text-rose-700 mb-2">
            {result.title}
          </h2>
          <p className="text-xl font-semibold text-rose-600 mb-4">{playerName}</p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {result.message}
          </p>

          <div className="bg-rose-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-rose-600 mb-2">Total Skor</p>
            <p className="text-4xl font-bold text-rose-700">{score}</p>
            <p className="text-sm text-rose-600 mt-2">Jawaban Benar: {totalCorrect} / {usedQuestions.size}</p>
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
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
