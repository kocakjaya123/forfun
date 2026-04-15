export const calculateScore = (hintsUsed, bonusHintsUsed) => {
  if (bonusHintsUsed > 0) return 10;
  if (hintsUsed === 0) return 100;
  if (hintsUsed === 1) return 75;
  if (hintsUsed === 2) return 50;
  if (hintsUsed === 3) return 25;
  return 0;
};

export const normalizeAnswer = (answer) => {
  return answer.toLowerCase().trim();
};

export const getResultMessage = (score, totalWords) => {
  const correctCount = Math.round((score / 100) * totalWords);
  
  if (score >= 1500) {
    return {
      title: "🔥 Master Hidup! 🔥",
      message: "Wow, kamu benar-benar memahami setiap aspek kehidupan! Hatimu penuh wisdom dan inspirasi! 💖✨",
      emoji: "👑"
    };
  } else if (score >= 1000) {
    return {
      title: "💕 Visioner! 💕",
      message: "Kamu tahu banyak tentang kehidupan dan masa depan! Visiomu jelas dan tulus! 🌹",
      emoji: "💞"
    };
  } else if (score >= 500) {
    return {
      title: "💗 Inspiratif! 💗",
      message: "Kamu inspiratif dan memahami kehidupan dengan baik! Terus berkembang yaa! 🌸",
      emoji: "💓"
    };
  } else if (score >= 200) {
    return {
      title: "💌 Pemula Hidup! 💌",
      message: "Kamu mulai memahami dunia kehidupan! Syukur-syukur next time bisa lebih baik! 🎀",
      emoji: "🥰"
    };
  } else {
    return {
      title: "🎮 Coba Lagi Ya! 🎮",
      message: "Tidak apa-apa! Setiap permainan adalah kesempatan untuk belajar lebih banyak tentang kehidupan! 💫",
      emoji: "😊"
    };
  }
};

export const triggerHeartRain = (callback) => {
  const container = document.createElement('div');
  container.className = 'fixed inset-0 pointer-events-none overflow-hidden';
  document.body.appendChild(container);

  const hearts = ['❤️', '💕', '💖', '💗', '💝'];
  
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = 'absolute text-4xl animate-party-hearts';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '100%';
    heart.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
    heart.style.zIndex = '50';
    
    container.appendChild(heart);
  }

  setTimeout(() => {
    container.remove();
    if (callback) callback();
  }, 3000);
};

export const getWisdomQuote = (score) => {
  const quotes = {
    masterHidup: [
      "Kehidupan sejati adalah ketika kamu lebih peduli dengan pertumbuhan dirimu daripada kesuksesan sementara.",
      "Perjalanan terbaik adalah ketika kamu bisa menjadi diri sendiri dan dunia masih menerima siapa kamu.",
      "Kehidupan bukan hanya tentang mencapai tujuan, tapi tentang menjadi orang yang lebih baik setiap hari.",
      "Di dalam kehidupan bermakna, tidak ada 'saya' atau 'kamu', hanya 'kita' sebagai bagian dari dunia."
    ],
    visioner: [
      "Impian adalah bahasa yang dapat dipahami oleh setiap jiwa.",
      "Yang terbaik dari masa depan adalah mengetahui kamu memiliki visi yang jelas.",
      "Kehidupan yang tulus tidak pernah membuat Anda merasa kecil.",
      "Komitmen adalah jantung dari setiap perjalanan yang indah."
    ],
    inspiratif: [
      "Mulai dari sini, belajarlah untuk hidup dengan lebih bermakna.",
      "Setiap hari adalah kesempatan baru untuk menunjukkan potensimu.",
      "Impian Anda penting dan berharga.",
      "Terus tumbuh dalam memahami kehidupan dan aspirasi orang lain."
    ],
    pemula: [
      "Setiap ahli dimulai dari pemula. Terus belajar tentang kehidupan!",
      "Jangan malu untuk mengejar impianmu kepada dunia.",
      "Kehidupan adalah perjalanan pembelajaran yang indah.",
      "Yang penting adalah niat tulus dan hati yang terbuka."
    ],
    cobaDulu: [
      "Maaf bukan kelemahan, tapi kesempatan untuk tumbuh lebih baik.",
      "Setiap permainan dirancang untuk mengajarkan kita tentang pentingnya kehidupan.",
      "Jangan takut untuk mencoba lagi, karena setiap kegagalan adalah pembelajaran.",
      "Kehidupan adalah permainan yang tak pernah terlambat untuk dipelajari."
    ]
  };

  let category;
  if (score >= 1500) {
    category = 'masterHidup';
  } else if (score >= 1000) {
    category = 'visioner';
  } else if (score >= 500) {
    category = 'inspiratif';
  } else if (score >= 200) {
    category = 'pemula';
  } else {
    category = 'cobaDulu';
  }

  const categoryQuotes = quotes[category];
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
};
