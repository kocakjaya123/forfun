import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TraktirModal from '../../components/TraktirModal';
import words from '../../data/words';
import { calculateScore, normalizeAnswer, triggerHeartRain, getWisdomQuote } from '../../utils/gameUtils';
import { saveQuizResult } from '../../utils/supabaseClient';

export default function WordGuess() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [duration, setDuration] = useState(60); // default 1 minute
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [bonusHintsRevealed, setBonusHintsRevealed] = useState(0);
  const [showTraktirModal, setShowTraktirModal] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [declineMessage, setDeclineMessage] = useState('');

  const currentWord = words[currentWordIndex];

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

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(duration);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setConsecutiveCorrect(0);
    setTotalAttempted(0);
    setUsedWords(new Set());
    resetForNewQuestion();
  };

  const resetForNewQuestion = () => {
    setAnswer('');
    setHintsRevealed(0);
    setBonusHintsRevealed(0);
    setAnswered(false);
    setIsCorrect(false);
    setShowTraktirModal(false);
  };

  const handleSubmitAnswer = () => {
    if (!answer || !answer.trim()) return;

    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedWord = normalizeAnswer(currentWord.word);
    const isAnswerCorrect = normalizedAnswer === normalizedWord;

    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    if (isAnswerCorrect) {
      const points = calculateScore(hintsRevealed, bonusHintsRevealed);
      setScore((prev) => prev + points);
      setTotalCorrect((prev) => prev + 1);
      setConsecutiveCorrect((prev) => prev + 1);

      // Check for 5 consecutive correct answers
      if (consecutiveCorrect + 1 === 5) {
        // trigger heart rain for 3s then move to next question
        triggerHeartRain(moveToNextQuestion);
      } else {
        setTimeout(moveToNextQuestion, 2000);
      }
    } else {
      setConsecutiveCorrect(0);
      setTimeout(moveToNextQuestion, 1500);
    }
  };

  const moveToNextQuestion = () => {
    const newUsedWords = new Set(usedWords);
    newUsedWords.add(currentWordIndex);
    setUsedWords(newUsedWords);
    setTotalAttempted((prev) => prev + 1);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      resetForNewQuestion();
    } else {
      setGameState('finished');
    }
  };

  const revealHint = () => {
    if (hintsRevealed < currentWord.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const requestBonusHint = () => {
    setShowTraktirModal(true);
  };

  const handleAcceptTraktir = () => {
    // reveal all bonus hints for the current word
    setBonusHintsRevealed(currentWord?.bonusHints?.length || 3);
    setShowTraktirModal(false);
  };

  const handleDeclineTraktir = () => {
    setShowTraktirModal(false);
    setDeclineMessage('Yah... ya sudah deh 😢');
    setTimeout(() => setDeclineMessage(''), 2200);
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-pink-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-3xl font-bold text-pink-700 mb-2">Tebak Kata Cinta!</h2>
            <p className="text-pink-600 text-lg font-semibold">👋 Hai, {playerName}!</p>
          </div>

          <p className="text-center text-gray-600 mb-6">Pilih durasi game</p>

          <div className="space-y-4 mb-8">
            {[60, 120, 180].map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 border-3 ${
                  duration === dur
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-700 scale-105'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-pink-300'
                }`}
              >
                {dur === 60 ? '⏱️ 1 Menit' : dur === 120 ? '⏱️ 2 Menit' : '⏱️ 3 Menit'}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
          >
            Mulai Game! 🎮
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-xl transition-all"
          >
            ← Kembali
          </button>

          <button
            onClick={() => {
              setPlayerName('');
              localStorage.removeItem('playerName');
              localStorage.removeItem('userId');
              navigate('/login');
            }}
            className="w-full mt-2 bg-red-200 hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-xl transition-all text-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  // Game playing screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-pink-300 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-white/80 text-sm">Skor</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Soal</p>
                <p className="text-2xl font-bold text-white">{currentWordIndex + 1}/{words.length}</p>
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
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-300 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Soal {currentWordIndex + 1}</h3>
            </div>

            {/* Description/Clue */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6 border-2 border-pink-300">
              <p className="text-lg text-gray-800 leading-relaxed text-center">
                {currentWord.description}
              </p>
            </div>

            {/* Hints Display */}
            {hintsRevealed > 0 && (
              <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border-2 border-yellow-300">
                <div className="space-y-2">
                  {[...Array(hintsRevealed)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 pb-2 border-b border-yellow-200 last:border-b-0 last:pb-0">
                      <span className="text-lg">💡</span>
                      <p className="text-gray-700">{currentWord.hints[i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bonus Hints Display */}
            {bonusHintsRevealed > 0 && (
              <div className="bg-green-50 rounded-2xl p-4 mb-6 border-2 border-green-300">
                <div className="space-y-2">
                  {[...Array(bonusHintsRevealed)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 pb-2 border-b border-green-200 last:border-b-0 last:pb-0">
                      <span className="text-lg">✨</span>
                      <p className="text-gray-700">{currentWord.bonusHints[i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input & Buttons */}
            {!answered ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  placeholder="Tulis jawaban di sini..."
                  className="w-full px-6 py-4 rounded-2xl border-3 border-pink-300 focus:border-pink-600 focus:outline-none text-lg font-semibold text-center"
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3 px-4 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    Jawab ✓
                  </button>

                  <button
                    onClick={revealHint}
                    disabled={hintsRevealed >= currentWord.hints.length}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3 px-4 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    Hint 💡 ({currentWord.hints.length - hintsRevealed})
                  </button>
                </div>

                {hintsRevealed >= currentWord.hints.length && bonusHintsRevealed < 3 && (
                  <button
                    onClick={requestBonusHint}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-2xl transition-all transform hover:scale-105"
                  >
                    Minta Hint Tambahan ✨
                  </button>
                )}
                {declineMessage && (
                  <div className="text-center mt-3 text-sm text-gray-600">{declineMessage}</div>
                )}
              </div>
            ) : (
              <div className={`text-center p-6 rounded-2xl ${isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}>
                <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✅ Benar! Tebakan Sempurna!' : '❌ Salah'}
                </p>
                {isCorrect && (
                  <p className="text-lg font-semibold text-green-700 mt-2">
                    +{calculateScore(hintsRevealed, bonusHintsRevealed)} Poin! 🎉
                  </p>
                )}
                {!isCorrect && (
                  <p className="text-lg font-semibold text-red-700 mt-2">
                    Jawabannya: <span className="text-2xl">{currentWord.word}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Traktir Modal */}
        {showTraktirModal && (
          <TraktirModal onAccept={handleAcceptTraktir} onDecline={handleDeclineTraktir} />
        )}
      </div>
    );
  }

  // Results screen
  return (
    <ResultsScreen
      playerName={playerName}
      score={score}
      totalCorrect={totalCorrect}
      totalWords={words.length}
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

  // Save result to database when component mounts
  useEffect(() => {
    if (playerName && score >= 0) {
      saveQuizResult(
        playerName,
        'Tebak Kata Cinta',
        score,
        totalCorrect,
        Array(totalAttempted),
        duration
      );
    }
  }, []);

  const getResultMessage = () => {
    if (score >= 1500) {
      return {
        title: "🔥 Master Cinta! 🔥",
        message: "Wow, kamu benar-benar memahami setiap nuansa perasaan! Hatimu penuh cinta dan wisdom! 💖✨",
        emoji: "👑"
      };
    } else if (score >= 1000) {
      return {
        title: "💕 Cinta Sejati! 💕",
        message: "Kamu tahu banyak tentang cinta dan perasaan! Perasaanmu dalam dan tulus! 🌹",
        emoji: "💞"
      };
    } else if (score >= 500) {
      return {
        title: "💗 Romantis! 💗",
        message: "Kamu romantic dan memahami perasaan dengan baik! Terus berkembang yaa! 🌸",
        emoji: "💓"
      };
    } else if (score >= 200) {
      return {
        title: "💌 Pemula Cinta! 💌",
        message: "Kamu mulai memahami dunia perasaan! Syukur-syukur next time bisa lebih baik! 🎀",
        emoji: "🥰"
      };
    } else {
      return {
        title: "🎮 Coba Lagi Ya! 🎮",
        message: "Tidak apa-apa! Setiap permainan adalah kesempatan untuk belajar lebih banyak tentang cinta! 💫",
        emoji: "😊"
      };
    }
  };

  const result = getResultMessage();
  const wisdomQuote = getWisdomQuote(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-pink-300 text-center">
        <div className="text-6xl mb-4 animate-bounce">{result.emoji}</div>
        
        <h2 className="text-3xl font-bold text-pink-700 mb-2">{result.title}</h2>
        <p className="text-xl font-semibold text-purple-600 mb-4">{playerName}</p>
        
        <p className="text-gray-700 mb-8 leading-relaxed">{result.message}</p>

        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-8 border-2 border-pink-300">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Total Skor</p>
              <p className="text-4xl font-bold text-pink-600">{score} 💰</p>
            </div>
            <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${Math.min((score / 1500) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Kata Benar: {totalCorrect}/{totalWords}</span>
              <span>Akurasi: {totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Wisdom Quote */}
        <div className="bg-amber-50 rounded-2xl p-4 mb-8 border-2 border-amber-300">
          <p className="text-sm italic text-amber-900">
            ✨ {wisdomQuote}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Main Lagi 🎮
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-xl transition-all"
          >
            ← Kembali ke Home
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2 text-2xl">
          <span className="animate-float-heart">❤️</span>
          <span className="animate-float-heart" style={{ animationDelay: '0.2s' }}>💕</span>
          <span className="animate-float-heart" style={{ animationDelay: '0.4s' }}>💖</span>
        </div>
      </div>
    </div>
  );
}
