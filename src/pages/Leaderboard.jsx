import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizResults } from '../utils/supabaseClient';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const gameTypes = [
    { id: 'all', name: '📊 Semua Game' },
    { id: 'Quiz Masa Depan', name: '🎯 Quiz Masa Depan' },
    { id: 'Tebak Kata Cinta', name: '💕 Tebak Kata Cinta' },
    { id: 'Acak Kata', name: '🔀 Acak Kata' },
    { id: 'Benar atau Salah', name: '🤔 Benar atau Salah' },
    { id: 'Pasangkan Kata', name: '🎴 Pasangkan Kata' }
  ];

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const results = await getQuizResults();

      // Process data untuk leaderboard
      const playerStats = {};

      results.forEach((result) => {
        const name = result.player_name;
        const gameType = result.game_type;

        if (!playerStats[name]) {
          playerStats[name] = {
            player_name: name,
            total_score: 0,
            total_correct: 0,
            total_questions: 0,
            games_played: 0,
            best_score: 0,
            last_played: result.created_at,
            games: {}
          };
        }

        // Global stats
        playerStats[name].total_score += result.score;
        playerStats[name].total_correct += result.total_correct;
        playerStats[name].total_questions += result.total_questions;
        playerStats[name].games_played += 1;
        playerStats[name].best_score = Math.max(playerStats[name].best_score, result.score);
        playerStats[name].last_played = new Date(result.created_at) > new Date(playerStats[name].last_played) 
          ? result.created_at 
          : playerStats[name].last_played;

        // Per-game stats
        if (!playerStats[name].games[gameType]) {
          playerStats[name].games[gameType] = {
            score: 0,
            times_played: 0,
            best_score: 0,
            total_correct: 0,
            total_questions: 0
          };
        }
        playerStats[name].games[gameType].score += result.score;
        playerStats[name].games[gameType].times_played += 1;
        playerStats[name].games[gameType].best_score = Math.max(
          playerStats[name].games[gameType].best_score,
          result.score
        );
        playerStats[name].games[gameType].total_correct += result.total_correct;
        playerStats[name].games[gameType].total_questions += result.total_questions;
      });

      // Convert to array dan sort by total_score
      const sorted = Object.values(playerStats)
        .sort((a, b) => b.total_score - a.total_score);

      setLeaderboard(sorted);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
    setIsLoading(false);
  };

  const getAccuracy = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}️⃣`;
  };

  // Get filtered data
  const filteredLeaderboard = selectedGame === 'all' 
    ? leaderboard.map(player => ({
        ...player,
        displayScore: player.total_score,
        accuracy: getAccuracy(player.total_correct, player.total_questions)
      }))
    : leaderboard
        .filter(player => player.games[selectedGame])
        .map(player => ({
          ...player,
          displayScore: player.games[selectedGame].score,
          accuracy: getAccuracy(
            player.games[selectedGame].total_correct,
            player.games[selectedGame].total_questions
          ),
          timesPlayed: player.games[selectedGame].times_played,
          bestScore: player.games[selectedGame].best_score
        }))
        .sort((a, b) => b.displayScore - a.displayScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg sticky top-0 z-20 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white truncate">🏆 Leaderboard</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-3 sm:px-4 rounded-full transition-all text-xs sm:text-lg flex-shrink-0"
            >
              ← Home
            </button>
          </div>
          <p className="text-white/90 text-xs sm:text-sm">Ranking pemain dengan skor tertinggi</p>
        </div>
      </div>

      {/* Game Selection */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-3 border-yellow-200">
          <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">Pilih Game:</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {gameTypes.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
                  selectedGame === game.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white scale-105 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-yellow-200 text-center">
            <p className="text-lg sm:text-2xl">⏳ Memuat leaderboard...</p>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-yellow-200 text-center">
            <p className="text-lg sm:text-2xl text-gray-600">📭 Belum ada data untuk game ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeaderboard.map((player, idx) => (
              <div
                key={`${player.player_name}-${idx}`}
                className={`rounded-2xl p-4 sm:p-6 border-4 shadow-lg transition-all duration-300 hover:scale-102 ${
                  idx === 0
                    ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-yellow-400'
                    : idx === 1
                    ? 'bg-gradient-to-r from-gray-200 to-gray-300 border-gray-400'
                    : idx === 2
                    ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400'
                    : 'bg-white border-gray-300'
                }`}
              >
                {/* Mobile/Tablet Layout */}
                <div className="space-y-3">
                  {/* Header Row - Rank and Name */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl font-bold flex-shrink-0">{getMedalEmoji(idx + 1)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                        {player.player_name}
                      </h3>
                    </div>
                    {/* Score Box - Right Aligned */}
                    <div className="text-center bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3 flex-shrink-0">
                      <p className="text-gray-600 text-xs font-bold">SKOR</p>
                      <p className="text-2xl sm:text-3xl font-bold text-orange-600">{player.displayScore}</p>
                    </div>
                  </div>

                  {/* Stats Grid - Responsive */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-gray-600 font-bold">Games</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-600">
                        {selectedGame === 'all' ? player.games_played : player.timesPlayed}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-gray-600 font-bold">Accuracy</p>
                      <p className="text-lg sm:text-xl font-bold text-green-600">
                        {player.accuracy}%
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-gray-600 font-bold">Best</p>
                      <p className="text-lg sm:text-xl font-bold text-purple-600">
                        {selectedGame === 'all' ? player.best_score : player.bestScore}
                      </p>
                    </div>
                  </div>

                  {/* Last Played - Full Width */}
                  <div className="pt-2 sm:pt-3 border-t-2 border-white/30 text-xs text-gray-600">
                    Last played: {formatDate(player.last_played)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadLeaderboard}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
