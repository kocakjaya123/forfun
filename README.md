"# 🚀 LifeQuest - Platform Permainan Kata-Kata Kehidupan & Impian

Selamat datang di **LifeQuest** - tempat mengeksplorasi impian, masa depan, dan pertumbuhan diri dengan tema serius dan inspiratif! 💪🎯🌟

## 🌈 Fitur Utama

- **Tebak Kata Impian** - Main tebak-tebakan kata seputar aspirasi dan motivasi dengan petunjuk yang bertahap
- **Sistem Hint Bertingkat** - 3 hint utama + 3 hint bonus (dengan easter egg yang motivatif!)
- **Timer Countdown** - Pilih durasi (1/2/3 menit) dan berlomba melawan waktu
- **Sistem Poin Dinamis** - Semakin sedikit hint, semakin banyak poin!
- **Easter Egg Spesial** - Jawab benar 5 kali berturut-turut dan lihat hujan bintang! ⭐
- **Pesan Motivasi Akhir** - Hasil game dengan pesan khusus sesuai skor kamu
- **Modal "Traktir Septian"** - Lucu dan interaktif untuk unlock hint tambahan

## 🛠️ Tech Stack

- **React 18** - UI Framework modern
- **Vite** - Bundler super cepat
- **Tailwind CSS** - Styling dengan utility-first approach
- **React Router v7** - Navigasi antar halaman
- **JavaScript ES6+** - Pure vanilla, no bloat!

## 📁 Struktur Project

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar dengan branding
│   ├── GameCard.jsx        # Card untuk setiap game
│   └── TraktirModal.jsx    # Modal easter egg "traktir Septian"
├── pages/
│   ├── Home.jsx            # Halaman utama dengan daftar game
│   └── games/
│       └── WordGuess.jsx   # Game tebak kata utama
├── data/
│   └── words.js            # Database 20 kata dengan hints
├── utils/
│   └── gameUtils.js        # Utility functions (scoring, helpers)
├── App.jsx                 # Main app router
├── main.jsx                # Entry point React
├── index.css               # Tailwind + custom styles
└── index.html              # HTML template

```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 16+ dan npm/yarn

### Installation

```bash
# Clone atau buka folder project
cd forfun

# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Buka di browser
# http://localhost:5173
```

### Build untuk Production

```bash
npm run build

# Preview build
npm run preview

# Deploy ke Vercel
# 1. Push ke GitHub
# 2. Connect di Vercel dashboard
# 3. Auto deploy setiap push ke main
```

## 🎮 Cara Bermain

### Setup
1. Klik "Main Sekarang" di kartu game
2. Pilih durasi timer (1/2/3 menit)
3. Klik "Mulai Game!"

### Gameplay
1. Baca deskripsi/petunjuk untuk menemukan kata
2. Ketik jawaban dan tekan Enter atau klik "Jawab"
3. Gunakan tombol "Hint" jika butuh bantuan (3 hint + bonus)
4. Lanjut ke soal berikutnya setelah menjawab
5. Game selesai saat timer habis

### Scoring System
- **Jawab benar tanpa hint**: 100 poin ⭐
- **Jawab benar + 1 hint**: 75 poin
- **Jawab benar + 2 hint**: 50 poin
- **Jawab benar + 3 hint**: 25 poin
- **Jawab benar + hint bonus**: 10 poin
- **Jawab salah**: 0 poin (lanjut soal berikutnya)

### Easter Eggs 🎉
- **5 Jawaban Benar Berturut-turut** → Hujan hati selama 3 detik! 💕💕💕
- **Limit Hint Habis** → Muncul modal lucu untuk "traktir Septian makan" → unlock 3 hint bonus
- **Hasil Akhir** → Pesan romantis berdasarkan total skor

## 📊 Database Kata

20 kata premium seputar cinta dan perasaan, masing-masing dengan:
- 1 deskripsi utama yang romantis
- 3 hint bertahap (abstrak → spesifik)
- 3 hint bonus (lebih konkret)

**Kata-kata**: Rindu, Cemburu, Jatuh cinta, Kangen, Patah hati, Baper, Deg-degan, Sayang, Pelukan, Ciuman, Kenangan, Harapan, Setia, Perhatian, Kesetiaan, Rayuan, Janji, Kebersamaan, Kehilangan, Bahagia

## 🎨 Design & Styling

- **Warna Utama**: Merah muda (#ec4899), Ungu soft (#a855f7), Gold, Putih
- **Rounded Corners**: Dominan di seluruh UI (border-radius 2xl+)
- **Animasi**: Hati melayang, bounce hearts, smooth transitions
- **Font**: Nunito & Poppins (Google Fonts) - playful & modern
- **Responsive**: Mobile-first design, optimal di semua ukuran layar

## 🔧 Customization

### Menambah Game Baru

1. Buat folder baru di `src/pages/games/`
2. Buat file `.jsx` untuk game tersebut
3. Import dan tambahkan route di `App.jsx`
4. Tambahkan card di `Home.jsx` dengan route baru

### Mengubah Daftar Kata

Edit file `src/data/words.js`:
```javascript
{
  id: 21,
  word: "YataKata",
  description: "Deskripsi romantis...",
  hints: ["Hint 1", "Hint 2", "Hint 3"],
  bonusHints: ["Bonus 1", "Bonus 2", "Bonus 3"]
}
```

### Mengubah Scoring

Edit file `src/utils/gameUtils.js` - fungsi `calculateScore()`

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.14.1",
  "tailwindcss": "^3.4.1",
  "vite": "^5.4.1"
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push ke GitHub
git add .
git commit -m "Update FurFun"
git push

# 2. Di Vercel Dashboard:
# - Import project dari GitHub
# - Build command: npm run build
# - Output dir: dist
# - Auto-deploy on push

# Hasil: https://your-project.vercel.app
```

### Alternatif (Netlify)

```bash
npm run build
# Drag & drop folder 'dist' ke Netlify
```

## 💡 Tips & Tricks

- Jawaban tidak case-sensitive (RINDU = rindu = Rindu) ✅
- Input otomatis fokus untuk UX yang smooth
- Hover effects di semua button untuk visual feedback
- Mobile-optimized: touch-friendly buttons dan font sizes
- Layout responsive: grid auto-adjust di mobile/tablet/desktop

## 🎯 Roadmap Fitur

- [ ] Multiplayer mode (tanding skor)
- [ ] Leaderboard global
- [ ] Custom word sets/kategori
- [ ] Sound effects & background music
- [ ] Share skor ke social media
- [ ] Dark mode toggle
- [ ] More games (rhyme matching, word association, dll)

## 📝 License

Open-source untuk keperluan edukatif dan hiburan. Bebas digunakan dengan menyebutkan credit.

## 💖 Special Notes

Dibuat dengan penuh cinta untuk yang special. Setiap kata di game ini adalah representasi dari perasaan yang dalam dan bermakna. Semoga kamu menikmati setiap momen bermain FurFun dan semakin memahami keindahan dalam setiap kata tentang cinta! ❤️

---

**Dibuat oleh Septian** - Made with ❤️ for amazing people

**Selamat bermain!** 🎮💕✨" 
