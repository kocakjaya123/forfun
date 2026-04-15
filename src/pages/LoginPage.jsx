import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByName, createUser, trackVisitor } from '../utils/supabaseClient';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExisting, setIsExisting] = useState(null);

  const handleCheckName = async () => {
    if (!playerName.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await getUserByName(playerName.trim());
      setIsExisting(!!user);
      
      if (!user) {
        setError('');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengecek nama');
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    if (!playerName.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let user = await getUserByName(playerName.trim());

      // Jika user belum ada, buat user baru
      if (!user) {
        user = await createUser(playerName.trim());
        if (!user) {
          setError('Gagal membuat akun. Coba lagi.');
          setIsLoading(false);
          return;
        }
      }

      // Track visitor
      await trackVisitor(playerName.trim());

      // Save ke localStorage
      localStorage.setItem('playerName', playerName.trim());
      localStorage.setItem('userId', user.id);

      // Callback ke parent
      onLoginSuccess(playerName.trim());

      // Redirect ke home
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Coba lagi.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-purple-300">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-purple-700 mb-2">Selamat Datang!</h1>
          <p className="text-gray-600">Masukkan nama untuk melanjutkan</p>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setIsExisting(null);
              setError('');
            }}
            placeholder="Masukkan nama kamu..."
            className="w-full px-6 py-4 rounded-2xl border-3 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Status Message */}
        {isExisting !== null && (
          <div className={`mb-4 p-4 rounded-2xl text-center ${
            isExisting 
              ? 'bg-blue-100 border-2 border-blue-300 text-blue-800' 
              : 'bg-green-100 border-2 border-green-300 text-green-800'
          }`}>
            {isExisting 
              ? '✅ Nama sudah terdaftar! Silakan lanjut.' 
              : '✨ Nama baru! Akun akan dibuat otomatis.'}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-100 border-2 border-red-300 text-red-800 text-center">
            ❌ {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!playerName.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed mb-3"
        >
          {isLoading ? '⏳ Memproses...' : '🚀 Masuk'}
        </button>

        {/* Leaderboard Link */}
        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🏆 Lihat Leaderboard
        </button>
      </div>
    </div>
  );
}
