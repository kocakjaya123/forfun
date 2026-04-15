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

export const getResultMessage = (score, totalWords, theme = 'default') => {
  // Provide theme-aware, emotional messages depending on score bands.
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Helper: return category key based on score
  const categoryByScore = (s) => {
    if (s >= 1500) return 'top';
    if (s >= 1000) return 'high';
    if (s >= 700) return 'midHigh';
    if (s >= 400) return 'mid';
    if (s >= 200) return 'starter';
    return 'low';
  };

  const cat = categoryByScore(score);

  const themes = {
    // Dream / Impian theme
    dream: {
      top: {
        titles: ["🌟 Pemimpi Legendaris", "✨ Cahaya Impian", "🚀 Penggerak Impian"],
        messages: [
          "Impianmu bukan sekadar mimpi — itu adalah panggilan yang menginspirasi orang lain. Teruskan jejak indah ini.",
          "Kata-katamu seperti bintang yang menuntun langkah. Dunia butuh lebih banyak pemimpi sepertimu.",
          "Kamu menunjukkan bahwa mimpi bisa menjadi nyata jika dijaga dengan hati dan tekad." 
        ],
        emoji: '🌟'
      },
      high: {
        titles: ["🚀 Penggerak Impian", "🌈 Sang Visioner"],
        messages: [
          "Ada energi besar dalam caramu bermimpi — itu membuat orang lain berani berharap juga.",
          "Kamu tahu bagaimana merangkai langkah dari mimpi — terus bawa semangat itu." 
        ],
        emoji: '🚀'
      },
      midHigh: {
        titles: ["✨ Pemimpi Berani", "🌱 Impian yang Tumbuh"],
        messages: [
          "Keberanianmu untuk bermimpi sudah luar biasa — biarkan itu tumbuh menjadi tindakan.",
          "Kamu menaruh harapan yang nyata dalam jawabanmu — itu tanda yang bagus." 
        ],
        emoji: '✨'
      },
      mid: {
        titles: ["🌤️ Langkah Penuh Harap", "💫 Mimpi yang Mulai Nyata"],
        messages: [
          "Jalan menuju mimpi dimulai dari langkah kecil — kamu sudah memulai dengan baik.",
          "Pertahankan semangat ini; impianmu layak diperjuangkan." 
        ],
        emoji: '🌤️'
      },
      starter: {
        titles: ["🌱 Pemula Berani", "🤍 Awal yang Manis"],
        messages: [
          "Ini baru permulaan — impian perlu waktu dan kasih sayang. Jangan menyerah.",
          "Terus pelihara harapanmu; setiap usaha kecil memperkuat mimpi besar." 
        ],
        emoji: '🌱'
      },
      low: {
        titles: ["⚡ Mulai Lagi", "🎯 Coba Lagi"],
        messages: [
          "Jangan patah semangat — mimpi tumbuh lewat latihan dan kegigihan. Ayo coba lagi.",
          "Setiap percobaan adalah investasi untuk impianmu. Terus berjalan." 
        ],
        emoji: '⚡'
      }
    },

    // Love / Cinta theme (kept from previous messages)
    love: {
      top: {
        titles: ["👑 Sang Pemikat Hati", "🌟 Puncak Cinta", "🔥 Master Perasaan"],
        messages: [
          "Setiap jawabanmu terasa seperti pelukan hangat — kamu membuat orang tersentuh. Terus jaga hati yang begitu besar.",
          "Kau bukan sekadar bermain; kau berbicara dengan perasaan. Hasil ini menunjukkan ketulusan yang dalam.",
          "Hatimu memancarkan kehangatan. Orang lain pasti merasakan sentuhan lembut dalam setiap pilihanmu."
        ],
        emoji: '👑'
      },
      high: {
        titles: ["💞 Cinta Mendalam", "🌹 Hati yang Peka"],
        messages: [
          "Ada ketulusan di setiap pilihanmu — itu membuat permainan jadi lebih bermakna. Terus pelihara empati itu.",
          "Kau menunjukkan kelembutan dan pengertian. Hasil ini adalah cermin dari hati yang peduli."
        ],
        emoji: '💞'
      },
      midHigh: {
        titles: ["💗 Menyentuh Hati", "✨ Romantis Sekali"],
        messages: [
          "Kamu berhasil membuat hati bergetar — bukan hanya karena skor, tapi karena nuansa dalam setiap jawaban.",
          "Ada sentuhan hangat dalam gayamu bermain. Terus kembangkan perasaan yang indah itu." 
        ],
        emoji: '💗'
      },
      mid: {
        titles: ["💌 Hangat dan Tulus", "🌤️ Semangat yang Lembut"],
        messages: [
          "Langkahmu sudah tepat — ada ketulusan yang mulai muncul. Jangan takut untuk terus merasakan.",
          "Kamu menunjukkan niat yang baik dan hati yang hangat. Jadikan ini pijakan untuk berkembang."
        ],
        emoji: '💌'
      },
      starter: {
        titles: ["🌱 Pemula yang Penuh Harapan", "🤍 Awal yang Manis"],
        messages: [
          "Ini baru awal — hati yang tulus akan tumbuh seiring waktu. Terus coba, karena kamu punya rasa yang berharga.",
          "Jangan kecil hati. Setiap langkah membawa pembelajaran, dan hatimu tetap berharga." 
        ],
        emoji: '🌱'
      },
      low: {
        titles: ["🤍 Pelan tapi Pasti", "🎮 Belajar dengan Hati"],
        messages: [
          "Tidak apa-apa belum sempurna — yang paling penting adalah ketulusan niatmu. Hati yang lembut selalu berharga.",
          "Setiap kegagalan adalah pelajaran; jangan tutup hatimu. Coba lagi dan biarkan perasaanmu tumbuh." 
        ],
        emoji: '🤍'
      }
    },

    // Default / Life / Inspirational theme
    default: {
      top: {
        titles: ["🔥 Master Hidup! 🔥", "🌟 Puncak Kebijaksanaan"],
        messages: [
          "Kamu menunjukkan kedewasaan dan kebijaksanaan. Terus jadi inspirasi bagi sekitarmu.",
          "Hasil ini mencerminkan kerja keras dan rasa ingin tahu yang dalam. Hebat!"
        ],
        emoji: '👑'
      },
      high: {
        titles: ["💕 Visioner! 💕", "🌱 Pembelajar Hebat"],
        messages: [
          "Kamu punya visi yang kuat dan kemampuan untuk berkembang. Teruskan perjalanan ini.",
          "Keingintahuanmu membuka banyak peluang — terus gali dan belajar." 
        ],
        emoji: '💞'
      },
      midHigh: {
        titles: ["💗 Inspiratif! 💗", "✨ Berjiwa Besar"],
        messages: [
          "Kamu inspiratif dan punya rasa ingin tahu. Terus kembangkan potensimu.",
          "Langkahmu sudah di jalur yang benar — terus asah kemampuan dan hati." 
        ],
        emoji: '💗'
      },
      mid: {
        titles: ["💌 Pemula yang Bersemangat", "🌤️ Langkah Positif"],
        messages: [
          "Perjalanan ini masih panjang, tapi kamu sudah mengambil langkah yang baik.",
          "Terus berlatih dan belajar — hasilnya akan mengikuti." 
        ],
        emoji: '💌'
      },
      starter: {
        titles: ["🌱 Pemula yang Penuh Harapan", "🤍 Awal yang Baik"],
        messages: [
          "Setiap ahli dimulai dari pemula. Terus belajar dan jangan takut mencoba.",
          "Langkah kecil hari ini bisa jadi lompatan besar di masa depan." 
        ],
        emoji: '🌱'
      },
      low: {
        titles: ["🎮 Coba Lagi Ya!", "🤍 Pelan tapi Pasti"],
        messages: [
          "Tidak apa-apa belum sempurna — setiap percobaan mengajarkan sesuatu.",
          "Terus latihan dan tetap terbuka pada pembelajaran baru." 
        ],
        emoji: '🤍'
      }
    }
  };

  const themeKey = themes[theme] ? theme : 'default';
  const node = themes[themeKey][cat];
  return { title: pick(node.titles), message: pick(node.messages), emoji: node.emoji };
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
