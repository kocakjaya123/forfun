import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-3 sm:gap-4">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <span className="text-2xl sm:text-3xl animate-bounce flex-shrink-0 hover:scale-125 transition-transform">🚀</span>
            <span className="text-lg sm:text-2xl font-black text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all truncate">
              LifeQuest
            </span>
          </Link>
          
          {/* Spacer */}
          <div className="flex-1"></div>

          {/* User Menu - Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Visitors Button */}
            <button
              onClick={() => navigate('/visitors')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0 border border-white/30 hover:border-white/50 shadow-md hover:shadow-lg"
              title="Lihat Pengunjung"
            >
              <span className="hidden sm:inline">👥 Visitor</span>
              <span className="sm:hidden">👥</span>
            </button>

            {currentUser && (
              <>
                {/* User Name - Hide on very small screens */}
                <span className="text-white font-bold text-xs sm:text-sm hidden md:inline truncate max-w-[120px] px-2 py-2 bg-white/10 rounded-lg border border-white/20">
                  👤 {currentUser}
                </span>

                {/* Leaderboard Button */}
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0 border border-white/30 hover:border-white/50 shadow-md hover:shadow-lg"
                  title="Leaderboard"
                >
                  <span className="hidden sm:inline">🏆 Rank</span>
                  <span className="sm:hidden">🏆</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/login');
                  }}
                  className="bg-red-500/40 hover:bg-red-500/60 backdrop-blur-sm text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0 border border-red-400/50 hover:border-red-300 shadow-md hover:shadow-lg"
                  title="Logout"
                >
                  <span className="hidden sm:inline">🚪 Exit</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
