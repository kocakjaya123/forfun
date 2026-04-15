import GameCard from '../components/GameCard';

export default function Home({ currentUser }) {
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
        <div className="text-center mb-12">
          {currentUser && (
            <div className="mb-6 p-4 bg-white/50 backdrop-blur rounded-2xl border-2 border-blue-300 inline-block">
              <p className="text-lg font-bold text-blue-700">👋 Selamat datang, <span className="text-blue-600">{currentUser}</span>!</p>
            </div>
          )}
          
          <div className="mb-4 inline-block">
            <div className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 drop-shadow-lg">
              LifeQuest 🚀
            </div>
          </div>
          
          <p className="text-xl sm:text-2xl text-gray-700 font-semibold mb-2">
            Tempat mengeksplorasi impian, masa depan, dan pertumbuhan diri!
          </p>
          
          <p className="text-lg text-gray-600 mb-6">
            Seberapa serius kamu dengan tujuan hidupmu? Mari kita uji bersama! 💪
          </p>
          
          <div className="flex justify-center gap-3 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>�</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎯</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Pilih Game Mu</h2>
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
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Gimana Cara Mainnya? 🎮</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Pilih Game", desc: "Pilih salah satu game yang tersedia di atas" },
              { step: 2, title: "Baca Petunjuk", desc: "Pahami soal dan instruksi game dengan baik" },
              { step: 3, title: "Jawab Cepat", desc: "Selesaikan sebelum waktu habis" },
              { step: 4, title: "Kumpulkan Poin", desc: "Dapatkan skor berdasarkan akurasi & kecepatan" },
              { step: 5, title: "Lihat Ranking", desc: "Cek posisi kamu di leaderboard" }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200 hover:border-purple-400 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">Siap untuk dimulai? 🚀</h3>
          <p className="text-lg mb-6 opacity-95">Uji pengetahuan dan kemampuanmu sekarang juga!</p>
          <a href="#pilih-game" className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-colors text-lg">
            Mulai Bermain →
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-6">
          <p className="text-gray-600 text-lg font-semibold">💙 Dibuat untuk membantu mu mengenal diri lebih baik 🚀</p>
        </div>
      </div>
    </div>
  );
}
