import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-gradient-to-r from-pink-400 via-pink-300 to-purple-300 shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-2 sm:gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 group min-w-0">
            <span className="text-2xl sm:text-3xl animate-bounce flex-shrink-0">💖</span>
            <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform truncate">
              FurFun
            </span>
          </Link>
          
          {/* Center text - hide on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg sm:text-2xl animate-float-heart">❤️</span>
            <span className="text-xs sm:text-sm text-white font-semibold drop-shadow">
              Tebak Kata Cinta! 💕
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => navigate('/visitors')}
              className="bg-blue-500/30 hover:bg-blue-500/50 text-white font-bold py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0"
              title="Lihat Pengunjung"
            >
              👥
            </button>
            {currentUser && (
              <div className="flex items-center gap-1 sm:gap-3">
                <span className="text-white font-bold text-xs sm:text-base hidden sm:inline truncate">👤 {currentUser}</span>
                <span className="text-white font-bold text-xs sm:hidden">👤</span>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0"
                  title="Leaderboard"
                >
                  🏆
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/login');
                  }}
                  className="bg-red-500/30 hover:bg-red-500/50 text-white font-bold py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0"
                  title="Logout"
                >
                  🚪
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
