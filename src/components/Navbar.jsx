import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-gradient-to-r from-pink-400 via-pink-300 to-purple-300 shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl animate-bounce">💖</span>
          <span className="text-2xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform">
            FurFun
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-float-heart">❤️</span>
          <span className="hidden sm:inline text-white font-semibold drop-shadow">
            Tebak Kata Cinta! 💕
          </span>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigate('/visitors');
            }}
            className="bg-blue-500/30 hover:bg-blue-500/50 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
            title="Lihat Pengunjung"
          >
            👥
          </button>
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm sm:text-base">👤 {currentUser}</span>
              <button
                onClick={() => {
                  navigate('/leaderboard');
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
              >
                🏆
              </button>
              <button
                onClick={() => {
                  onLogout();
                  navigate('/login');
                }}
                className="bg-red-500/30 hover:bg-red-500/50 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
