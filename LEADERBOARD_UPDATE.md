# Leaderboard Update - Game Type & Dummy Data Guide

## 📋 Update Summary

Leaderboard sekarang menampilkan:
- ✅ Pilihan game untuk filter (Quiz, Tebak Kata, Acak Kata, dll)
- ✅ Score per game
- ✅ Ranking dari besar ke kecil
- ✅ Dummy data untuk testing

---

## 🚀 Setup Steps

### 1. **Database Migration** (Jika sudah ada data sebelumnya)

Jika Anda sudah punya quiz_results table tanpa `game_type` column:

1. Buka Supabase SQL Editor
2. Copy-paste isi file `MIGRATION_ADD_GAME_TYPE.sql`
3. Klik **Run**

### 2. **Tambah Dummy Data**

1. Buka Supabase SQL Editor
2. Copy-paste isi file `DUMMY_DATA.sql`
3. Klik **Run**

Ini akan menambahkan:
- 6 dummy users
- 23 dummy quiz results dengan berbagai game types
- 6 dummy visitors

---

## 📊 Dummy Data Details

### Players dengan Score Ranking:

**Budi Santoso** - Total: 1850 poin ⭐ #1
- Quiz Masa Depan: 250
- Tebak Kata Cinta: 420
- Acak Kata: 380
- Benar atau Salah: 300
- Pasangkan Kata: 500

**Siti Nurhaliza** - Total: 1400 poin 🥈 #2
- Quiz Masa Depan: 300
- Tebak Kata Cinta: 450
- Acak Kata: 350
- Benar atau Salah: 350

**Dewi Lestari** - Total: 1460 poin 🥉 #3
- Quiz Masa Depan: 220
- Tebak Kata Cinta: 400
- Benar atau Salah: 320
- Pasangkan Kata: 520

**Ahmad Wijaya** - Total: 1280 poin
- Quiz Masa Depan: 200
- Tebak Kata Cinta: 380
- Acak Kata: 320
- Benar atau Salah: 280
- Pasangkan Kata: 480

**Rony Kristanto** - Total: 1030 poin
- Quiz Masa Depan: 280
- Tebak Kata Cinta: 390
- Acak Kata: 360

**Maya Putri** - Total: 1450 poin
- Quiz Masa Depan: 260
- Tebak Kata Cinta: 410
- Benar atau Salah: 290
- Pasangkan Kata: 490

---

## 🎮 Game Types

Leaderboard sekarang support 5 game types:

1. **Quiz Masa Depan** 🎯
2. **Tebak Kata Cinta** 💕
3. **Acak Kata** 🔀
4. **Benar atau Salah** 🤔
5. **Pasangkan Kata** 🎴

---

## 🔧 Fitur Baru di Leaderboard

### Filter by Game Type
- Klik button game untuk melihat ranking per game
- Klik "Semua Game" untuk lihat total score

### Metrics per Game
- Times Played: Berapa kali game itu dimainkan
- Best Score: Score tertinggi untuk game itu
- Accuracy: Presentase jawaban benar
- Total Score: Total semua score untuk game itu

---

## 📝 Code Changes

### Files Updated:

1. **SUPABASE_SCHEMA.sql** - Add `game_type` column
2. **supabaseClient.js** - Update `saveQuizResult()` untuk terima `gameType`
3. **QuizCinta.jsx** - Pass `'Quiz Masa Depan'` saat save
4. **Leaderboard.jsx** - Add game filtering + metrics
5. **MIGRATION_ADD_GAME_TYPE.sql** - NEW - For existing databases
6. **DUMMY_DATA.sql** - NEW - Sample data for testing

---

## 🧪 Testing

1. **Fresh Setup:**
   - Run SUPABASE_SCHEMA.sql
   - Run DUMMY_DATA.sql
   - Open leaderboard → Should see 6 players with data

2. **Add New Game Type:**
   - Edit game files (WordGuess, AcakKata, TrueOrFalse, MatchingGame)
   - Update saveResult calls dengan game_type masing-masing

3. **Real Data:**
   - Main quiz → Compare dengan dummy data
   - Check leaderboard → Data baru harus appear

---

## 📌 Next Steps (Optional)

Untuk menambah game type lainnya, update di:

1. **Game file** (e.g., `WordGuess.jsx`):
   ```javascript
   saveQuizResult(playerName, 'Tebak Kata Cinta', score, totalCorrect, allAnswers, duration);
   ```

2. **Leaderboard.jsx** - Update `gameTypes` array:
   ```javascript
   { id: 'Tebak Kata Cinta', name: '💕 Tebak Kata Cinta' }
   ```

---

## ✅ Done!

Leaderboard sekarang fully functional dengan:
- ✅ Multi-game support
- ✅ Per-game filtering
- ✅ Detailed statistics
- ✅ Dummy data untuk demo
- ✅ Real-time updates
