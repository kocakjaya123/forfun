const words = [
  {
    id: 1,
    word: "Motivasi",
    description: "Dorongan yang membuat kamu bangun pagi dan mengejar impian...",
    hints: [
      "Tanpa ini, mimpi hanya jadi khayalan 🌅",
      "Bisa datang dari dalam diri atau orang lain 💪",
      "Kunci untuk mengubah rencana jadi aksi nyata"
    ],
    bonusHints: [
      "8 huruf, diawali huruf M",
      "Lawan katanya adalah 'malas'",
      "\"Aku butuh ___ untuk sukses\" - kalimat yang sering didengar"
    ]
  },
  {
    id: 2,
    word: "Aspirasi",
    description: "Impian besar yang ingin kamu capai di masa depan...",
    hints: [
      "Membuat kamu excited membayangkan 5 tahun ke depan 🎯",
      "Bisa berubah seiring waktu dan pengalaman",
      "Fondasi dari semua tujuan hidupmu"
    ],
    bonusHints: [
      "Punya 8 huruf",
      "Sering diiringi dengan rencana dan target",
      "Bisa berubah jadi kenyataan dengan kerja keras"
    ]
  },
  {
    id: 3,
    word: "Ketekunan",
    description: "Kemauan untuk terus berusaha meski menghadapi tantangan...",
    hints: [
      "Kualitas yang membedakan pemenang dan pecundang ✨",
      "Membuat kegagalan jadi pelajaran berharga",
      "Kebalikan dari 'menyerah' atau 'putus asa'"
    ],
    bonusHints: [
      "2 kata, diawali dengan K dan T",
      "Sinonim: pantang menyerah",
      "Proses yang butuh latihan dan pengalaman"
    ]
  },
  {
    id: 4,
    word: "Discipline",
    description: "Kontrol diri untuk menjalankan rutinitas dan komitmen...",
    hints: [
      "Tanpa ini, impian hanya tinggal mimpi 🎯",
      "Membedakan orang sukses dari yang biasa saja",
      "Kunci untuk membangun kebiasaan baik"
    ],
    bonusHints: [
      "9 huruf, diawali huruf D",
      "Lebih penting dari talenta",
      "\"___ adalah jembatan antara tujuan dan pencapaian\" - Jim Rohn"
    ]
  },
  {
    id: 5,
    word: "Pertumbuhan",
    description: "Proses menjadi lebih baik dan berkembang dari waktu ke waktu...",
    hints: [
      "Tidak pernah berhenti selama hidup masih ada 🌱",
      "Melibatkan belajar dari kesalahan dan pengalaman",
      "Tujuan utama dari semua tantangan hidup"
    ],
    bonusHints: [
      "2 kata, diawali P dan T",
      "Lawan dari stagnasi",
      "Fase penting dalam perjalanan menuju sukses"
    ]
  },
  {
    id: 6,
    word: "Refleksi",
    description: "Proses memikirkan kembali pengalaman untuk belajar dan berkembang...",
    hints: [
      "Waktu yang tepat adalah malam hari sebelum tidur 🤔",
      "Membantu kamu melihat kesalahan dan peluang perbaikan",
      "Dasar dari perubahan positif dalam hidup"
    ],
    bonusHints: [
      "8 huruf, diawali huruf R",
      "Sering dilakukan setelah kegagalan",
      "Alat untuk membangun kebijaksanaan"
    ]
  },
  {
    id: 7,
    word: "Ambisi",
    description: "Keinginan kuat untuk mencapai sesuatu yang besar...",
    hints: [
      "Mendorong kamu untuk keluar dari zona nyaman 🚀",
      "Bisa positif atau negatif tergantung caranya",
      "Dasar dari semua pencapaian luar biasa"
    ],
    bonusHints: [
      "6 huruf, diawali huruf A",
      "Umum terjadi saat menghadapi tantangan besar",
      "Simbol semangat untuk meraih impian"
    ]
  },
  {
    id: 8,
    word: "Ketahanan",
    description: "Kemampuan untuk bertahan menghadapi kesulitan dan tekanan...",
    hints: [
      "Dibangun melalui pengalaman dan latihan 💪",
      "Membedakan yang bertahan dari yang menyerah",
      "Kunci untuk mencapai tujuan jangka panjang"
    ],
    bonusHints: [
      "9 huruf, diawali K",
      "Lawan dari kerapuhan",
      "Sering diuji dalam masa-masa sulit"
    ]
  },
  {
    id: 9,
    word: "Visi",
    description: "Gambaran jelas tentang masa depan yang ingin dicapai...",
    hints: [
      "Panduan untuk semua keputusan yang kamu ambil 👁️",
      "Membantu fokus pada apa yang benar-benar penting",
      "Dasar dari perencanaan strategis"
    ],
    bonusHints: [
      "4 huruf, diawali V",
      "Verb-nya adalah 'melihat'",
      "Peta jalan menuju impian"
    ]
  },
  {
    id: 10,
    word: "Kontribusi",
    description: "Sumbangsih yang diberikan untuk orang lain atau masyarakat...",
    hints: [
      "Membuat hidup terasa lebih bermakna 🌍",
      "Bisa dalam bentuk waktu, tenaga, atau keahlian",
      "Cara terbaik untuk meninggalkan jejak positif"
    ],
    bonusHints: [
      "10 huruf, diawali K",
      "Lawan dari egoisme",
      "Sumber kepuasan terdalam"
    ]
  },
  {
    id: 11,
    word: "Kenangan",
    description: "Momen atau cerita masa lalu yang tetap hidup di dalam ingatan...",
    hints: [
      "Semakin lama terpisah, semakin terasa berharga 📸",
      "Bisa membuat senyum sendiri atau malah sedih",
      "Cara terbaik menjaganya adalah dengan foto dan cerita"
    ],
    bonusHints: [
      "8 huruf, diawali K",
      "Awal katanya: 'ke' + bagian dari 'nang'",
      "Bersama cinta, ini yang paling abadi"
    ]
  },
  {
    id: 12,
    word: "Harapan",
    description: "Keinginan dan kepercayaan akan hal baik yang akan datang...",
    hints: [
      "Membuat hidup terasa bermakna dan punya tujuan ✨",
      "Ketika hilang, segalanya terasa gelap",
      "Dalam cinta: harapan pasangan membalas perasaan"
    ],
    bonusHints: [
      "7 huruf, diawali H",
      "Ancaman utamanya adalah kekecewaan",
      "\"__ yang membuat hidup indah\" - lirik lagu terkenal"
    ]
  },
  {
    id: 13,
    word: "Setia",
    description: "Komitmen untuk tetap bersama dan loyal kepada seseorang...",
    hints: [
      "Janji yang sulit dipenuhi tapi sangat dihargai dalam cinta 💪",
      "Kebalikan dari khianat atau selingkuh",
      "Fondasi dari hubungan yang kuat dan bertahan lama"
    ],
    bonusHints: [
      "5 huruf, diawali S dan diakhiri A",
      "Kualitas yang jarang tapi paling dicari dalam partner",
      "Bisa diwujudkan lewat tindakan nyata setiap hari"
    ]
  },
  {
    id: 14,
    word: "Perhatian",
    description: "Kepedulian dan usaha untuk memahami kebutuhan orang yang kamu sayangi...",
    hints: [
      "Ditunjukkan melalui listening dan mengingat detail kecil 👂",
      "Lebih personal dari sekadar kasih sayang umum",
      "Biasanya lebih dihargai daripada hadiah mahal"
    ],
    bonusHints: [
      "9 huruf, diawali P",
      "Verb-nya: memperhatikan",
      "\"Dia memberikan ___ saat aku merasa sedih\""
    ]
  },
  {
    id: 15,
    word: "Kesetiaan",
    description: "Sikap konsisten untuk tetap mendukung dan bersama seseorang...",
    hints: [
      "Lebih dalam dari sekadar setia, ini adalah karakternya 🏆",
      "Diuji saat muncul PDKT atau godaan dari orang lain",
      "Hadiah terbesar yang bisa diberikan dalam hubungan"
    ],
    bonusHints: [
      "9 huruf, diawali K",
      "Derived dari kata 'setia'",
      "Kualitas yang membedakan cinta sejati dari cinta sesaat"
    ]
  },
  {
    id: 16,
    word: "Rayuan",
    description: "Ucapan manis dan gombal untuk membuat orang tersenyum atau terpikat...",
    hints: [
      "Bikin pipi jadi merah dan hati jadi lembek 😳",
      "Semakin gombal, kadang semakin lucu bukan narsis",
      "Efek jangka panjang: membuat orang terasa special dan dihargai"
    ],
    bonusHints: [
      "6 huruf, diawali R",
      "Sering dipakai saat chatting atau sedang jaran tidur",
      "Bisa bikin marah tapi juga bisa bikin ketawa dan meleleh"
    ]
  },
  {
    id: 17,
    word: "Janji",
    description: "Komitmen ucapan untuk melakukan sesuatu di masa depan...",
    hints: [
      "Ketika dipenuhi, membangun kepercayaan 🤝",
      "Ketika dilanggar berkali-kali, merusak hubungan",
      "Dalam cinta: sering berupa janji untuk selamanya"
    ],
    bonusHints: [
      "5 huruf, diawali dan diakhiri J",
      "\"Aku berjanji akan ___ dan tidak akan pergi\"",
      "Serius tapi sering disepelekan"
    ]
  },
  {
    id: 18,
    word: "Kebersamaan",
    description: "Waktu dan momen yang dihabiskan bersama orang yang kamu sayangi...",
    hints: [
      "Tidak perlu mahal atau fancy, hanya perlu ada bersama 🤍",
      "Menciptakan bonding dan hubungan yang lebih kuat",
      "Lebih berharga daripada apapun saat dirasakan"
    ],
    bonusHints: [
      "11 huruf, diawali K",
      "Berisi 'bersama' di dalamnya",
      "Hal yang paling dikenang setelah seseorang pergi"
    ]
  },
  {
    id: 19,
    word: "Kehilangan",
    description: "Perasaan saat seseorang atau sesuatu yang berarti tidak lagi ada...",
    hints: [
      "Sering memberikan pelajaran atau rasa menyesal 😢",
      "Menggerakkan untuk lebih menghargai apa yang ada sekarang",
      "Waktu adalah obat terbaik untuk melewati fase ini"
    ],
    bonusHints: [
      "10 huruf, diawali K",
      "Lawan dari penemuan atau pertemuan",
      "Membuat kita lebih mengerti arti kehadiran seseorang"
    ]
  },
  {
    id: 20,
    word: "Bahagia",
    description: "Perasaan puas dan senang yang mendalam, terutama saat bersama orang terkasih...",
    hints: [
      "Tujuan akhir dari semua perasaan dan usaha dalam cinta 🌈",
      "Tidak memerlukan hal besar, bisa dari momen sederhana",
      "Paling bermakna ketika dibagi dengan orang tersayang"
    ],
    bonusHints: [
      "7 huruf, diawali B",
      "\"Aku ingin membuat dirimu ___\"",
      "Hasil akhir dari hubungan yang sehat dan bermakna"
    ]
  }
];

export default words;
