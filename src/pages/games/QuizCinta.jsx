import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizzes from '../../data/quizData';
import { getResultMessage, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function LifeQuiz() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60); // default 1 minute
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [usedQuizzes, setUsedQuizzes] = useState(new Set());
  const [allAnswers, setAllAnswers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuiz = quizzes[currentQuizIndex];

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

  // Save to Supabase when game finishes
  useEffect(() => {
    if (gameState === 'finished' && allAnswers.length > 0 && !isSaving && playerName) {
      setIsSaving(true);
      saveQuizResult(playerName, 'Quiz Masa Depan', score, totalCorrect, allAnswers, duration);
    }
  }, [gameState, allAnswers, isSaving, playerName, score, totalCorrect, duration]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(duration);
    setCurrentQuizIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setUsedQuizzes(new Set());
    setAllAnswers([]);
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
    if (selectedAnswer === null || selectedAnswer === undefined) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    setAnswered(true);

    // Save answer
    const answerData = {
      questionId: currentQuiz.id,
      question: currentQuiz.question,
      selectedAnswerIndex: selectedAnswer,
      selectedAnswerText: currentQuiz.options[selectedAnswer],
      correctAnswerIndex: currentQuiz.correctAnswer,
      correctAnswerText: currentQuiz.options[currentQuiz.correctAnswer],
      isCorrect: isCorrect
    };

    setAllAnswers([...allAnswers, answerData]);

    if (isCorrect) {
      const points = 50; // Fixed points for quiz
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
    }

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
            <p className="text-blue-600 text-lg font-semibold">👋 Hai, {playerName}!</p>
          </div>

          <p className="text-center text-gray-600 mb-6">Durasi: 1 Menit</p>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
          >
            Mulai Quiz! 🎮
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <div className="text-center">
                <p className="text-white/80 text-xs sm:text-sm">Skor</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-xs sm:text-sm">Benar</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{totalCorrect}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-xs sm:text-sm">Waktu</p>
                <p className={`text-lg sm:text-2xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : 'text-white'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full transition-all text-xs sm:text-lg flex-shrink-0"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-blue-200 mb-6 sm:mb-8">
            <div className="text-6xl text-center mb-6">{currentQuiz.emoji}</div>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
              {currentQuiz.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuiz.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={answered}
                  className={`w-full p-5 rounded-2xl font-bold text-lg transition-all duration-300 border-3 text-left ${
                    selectedAnswer === idx
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-700 scale-105'
                      : answered && idx === currentQuiz.correctAnswer
                      ? 'bg-green-200 text-green-800 border-green-400'
                      : answered && selectedAnswer === idx && idx !== currentQuiz.correctAnswer
                      ? 'bg-red-200 text-red-800 border-red-400'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                  } ${answered ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl font-bold bg-white/30 px-2 py-1 rounded min-w-[2.5rem]">
                      {String.fromCharCode(65 + idx)}
                    </span>
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
                selectedAnswer === currentQuiz.correctAnswer
                  ? 'bg-green-200 text-green-800 border-2 border-green-400'
                  : 'bg-red-200 text-red-800 border-2 border-red-400'
              }`}>
                {selectedAnswer === currentQuiz.correctAnswer
                  ? '✅ Jawaban Benar! +50 poin'
                  : `❌ Jawaban Salah. Jawaban yang benar: ${String.fromCharCode(65 + currentQuiz.correctAnswer)} - ${currentQuiz.options[currentQuiz.correctAnswer]}`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    const result = getResultMessage(score, 6, 'default');
    const wisdomQuote = getWisdomQuote(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 shadow-lg sticky top-0 z-20 py-4">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Quiz Selesai! ✨</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Result Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 mb-8 text-center">
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
              <p className="text-sm text-blue-600 mt-2">Jawaban Benar: {totalCorrect} / {allAnswers.length}</p>
            </div>

            {/* Wisdom Quote */}
            <div className="bg-amber-50 rounded-2xl p-4 mb-8 border-2 border-amber-300">
              <p className="text-sm italic text-amber-900">
                ✨ {wisdomQuote}
              </p>
            </div>
          </div>

          {/* Answer Details */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 mb-8">
            <h3 className="text-2xl font-bold text-blue-700 mb-6">📋 Detail Jawaban</h3>
            
            <div className="space-y-4">
              {allAnswers.map((answer, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border-3 ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{answer.isCorrect ? '✅' : '❌'}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{idx + 1}. {answer.question}</p>
                    </div>
                  </div>
                  
                  <div className="ml-8 space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Jawaban Kamu:</span>{' '}
                      <span className={answer.isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                        {String.fromCharCode(65 + answer.selectedAnswerIndex)} - {answer.selectedAnswerText}
                      </span>
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Jawaban Benar:</span>{' '}
                        <span className="text-green-700 font-bold">
                          {String.fromCharCode(65 + answer.correctAnswerIndex)} - {answer.correctAnswerText}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setGameState('setup');
                setPlayerName('');
                setAllAnswers([]);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Bermain Lagi 🔄
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all"
            >
              Kembali ke Home 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }
}
