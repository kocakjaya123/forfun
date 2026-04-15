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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 pb-12">
      {/* Minimal decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-3xl opacity-10 animate-float-heart">🌟</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-float-heart" style={{ animationDelay: '0.4s' }}>🔥</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        {/* Info Section */}
        <div className="bg-white/70 backdrop-blur rounded-3xl p-8 border-4 border-blue-300 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span>🚀</span> Cara Bermain <span>🚀</span>
            </h3>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3 items-start">
                <span className="text-pink-500 font-bold text-xl">1️⃣</span>
                <span><strong>Pilih Tim:</strong> Tentukan durasi timer sebelum mulai (1/2/3 menit)</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-pink-500 font-bold text-xl">2️⃣</span>
                <span><strong>Tebak Kata:</strong> Baca petunjuk dan tebak kata yang dimaksud</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-pink-500 font-bold text-xl">3️⃣</span>
                <span><strong>Gunakan Hint:</strong> Tersedia 3 hint per soal untuk membantu</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-pink-500 font-bold text-xl">4️⃣</span>
                <span><strong>Kumpulkan Poin:</strong> Semakin sedikit hint, semakin banyak poin! 💰</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-pink-500 font-bold text-xl">5️⃣</span>
                <span><strong>Lihat Hasil:</strong> Cek skor dan pesan romantis di akhir game</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-pink-100 rounded-2xl border-2 border-pink-300">
              <p className="text-center text-pink-900 font-semibold">
                💡 Tip: Jawab benar 5 kali berturut-turut dan lihat sesuatu yang spesial terjadi! 💫
              </p>
            </div>
          </div>
        </div>

        {/* Footer Hearts */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-3">Dibuat dengan ❤️ untuk yang special</p>
          <div className="flex justify-center gap-2 text-2xl">
            <span className="animate-float-heart">💕</span>
            <span className="animate-float-heart" style={{ animationDelay: '0.2s' }}>💖</span>
            <span className="animate-float-heart" style={{ animationDelay: '0.4s' }}>💗</span>
          </div>
        </div>
      </div>
    </div>
  );
}
