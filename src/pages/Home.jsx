import GameCard from '../components/GameCard';
import WelcomeModal from '../components/WelcomeModal';
import { useState, useEffect } from 'react';

export default function Home({ currentUser }) {
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome modal on first mount if user is logged in (use localStorage)
  useEffect(() => {
    if (currentUser && !localStorage.getItem(`welcomeShown_${currentUser}`)) {
      setShowWelcome(true);
    }
  }, [currentUser]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    if (currentUser) {
      localStorage.setItem(`welcomeShown_${currentUser}`, 'true');
    }
  };

  const games = [
    {
      id: 1,
      title: "Tebak Kata Impian",
      description: "Tebak kata-kata tentang impian dan aspirasi dari petunjuk yang diberikan! Seberapa banyak kamu tahu tentang masa depan?",
      emoji: "💭",
      route: "/word-guess"
    },
    {
      id: 2,
      title: "Quiz Masa Depan",
      description: "Jawab pertanyaan pilihan ganda tentang impian dan tujuan hidup. Pilih dari 4 opsi jawaban yang tersedia!",
      emoji: "🎯",
      route: "/quiz-cinta"
    },
    {
      id: 3,
      title: "Acak Kata",
      description: "Susun ulang huruf-huruf yang acak menjadi kata yang benar! Tantangan untuk berpikir cepat dan tepat.",
      emoji: "🔀",
      route: "/acak-kata"
    },
    {
      id: 4,
      title: "Benar atau Salah?",
      description: "Tentukan kebenaran setiap pernyataan tentang kehidupan dan masa depan! Berapa banyak yang bisa kamu jawab dengan benar?",
      emoji: "🤔",
      route: "/true-or-false"
    },
    {
      id: 5,
      title: "Pasangkan Kata",
      description: "Cocokkan setiap kata dengan maknanya! Game memori yang seru dan menantang tentang pertumbuhan diri.",
      emoji: "🎴",
      route: "/matching"
    },
    {
      id: 6,
      title: "Lawan Kata",
      description: "Temukan kata dengan arti berlawanan! Perluas kosakata dan pahami nuansa bahasa Indonesia.",
      emoji: "🔄",
      route: "/lawan-kata"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Main Logo */}
          <div className="mb-8 inline-block">
            <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-2xl animate-pulse" style={{ animationDuration: '3s' }}>
              LifeQuest
            </div>
            <div className="text-5xl mt-3 text-center">🚀</div>
          </div>
          
          {/* Decorative Line */}
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-8"></div>
          
          {/* Main Tagline */}
          <p className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">
            Eksplorasi Impian & Tujuan Hidupmu
          </p>
          
          <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Mainkan game interaktif yang menyenangkan sambil belajar tentang diri sendiri dan mengejar mimpi Anda! 🌟
          </p>
          
          {/* Animated Icons */}
          <div className="flex justify-center gap-4 text-3xl sm:text-4xl flex-wrap">
            <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0s' }}>💭</span>
            <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.2s' }}>🎯</span>
            <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.4s' }}>⭐</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pilih Petualangan Mu</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-purple-400 rounded-full"></div>
          </div>
          <p className="text-center text-gray-600 mb-10 text-sm sm:text-base">6 game seru untuk mengenal diri lebih baik</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {games.map((game) => (
              <div key={game.id} className="transform hover:scale-105 transition-transform duration-300">
                <GameCard
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  emoji={game.emoji}
                  route={game.route}
                />
              </div>
            ))}
          </div>
        </div>

        {/* How To Play Section */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-green-400 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Gimana Cara Mainnya?</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-emerald-400 rounded-full"></div>
          </div>
          <p className="text-center text-gray-600 mb-10 text-sm sm:text-base">Ikuti 5 langkah mudah untuk memulai petualangan</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Pilih Game", desc: "Pilih salah satu game yang tersedia di atas", icon: "🎮" },
              { step: 2, title: "Baca Petunjuk", desc: "Pahami soal dan instruksi game dengan baik", icon: "📖" },
              { step: 3, title: "Jawab Cepat", desc: "Selesaikan sebelum waktu habis", icon: "⚡" },
              { step: 4, title: "Kumpulkan Poin", desc: "Dapatkan skor berdasarkan akurasi & kecepatan", icon: "⭐" },
              { step: 5, title: "Lihat Ranking", desc: "Cek posisi kamu di leaderboard", icon: "🏆" }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-5 sm:p-6 border-2 border-blue-200 group-hover:border-purple-400 transition-all shadow-lg">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <span className="text-xl sm:text-2xl">{item.icon}</span>
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full text-xs font-bold text-blue-700 mb-2">Langkah {item.step}</span>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm text-center">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-16 sm:mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-40"></div>
          <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl border border-white/30 backdrop-blur">
            <div className="mb-4 text-5xl sm:text-6xl">✨</div>
            <h3 className="text-3xl sm:text-4xl font-black mb-4 drop-shadow-lg">Siap untuk Petualangan? 🚀</h3>
            <p className="text-base sm:text-lg mb-8 opacity-95 max-w-2xl mx-auto">Uji pengetahuan, keahlian, dan ketahanan mental kamu. Setiap game adalah kesempatan untuk tumbuh dan belajar!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#pilih-game" className="px-10 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg">
                Mulai Sekarang 🎮
              </a>
              <a href="/leaderboard" className="px-10 py-4 bg-white/20 border-2 border-white text-white font-bold rounded-full hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg text-lg">
                Lihat Leaderboard 🏆
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-6">
          <p className="text-gray-600 text-lg font-semibold">💙 Dibuat untuk membantu mu mengenal diri lebih baik 🚀</p>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && <WelcomeModal currentUser={currentUser} onClose={handleWelcomeClose} />}
    </div>
  );
}
