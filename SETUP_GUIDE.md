# Setup Lengkap - Leaderboard & Login System

Semua fitur sudah diintegrasikan! Berikut cara setup database di Supabase:

## 📋 Step-by-Step Setup

### 1. Buka Supabase Dashboard
- Kunjungi https://app.supabase.com
- Login dengan akun Anda
- Pilih project `ovkefkvrpzzxqkylyiaz`

### 2. Jalankan SQL Schema
- Klik **SQL Editor** di sidebar
- Klik **New Query**
- Copy-paste semua isi dari file `SUPABASE_SCHEMA.sql`
- Klik **Run** atau tekan `Ctrl+Enter`

Atau buka file `SUPABASE_SCHEMA.sql` dan copy seluruh isinya ke SQL Editor.

### 3. Verifikasi Database
Setelah SQL berhasil dijalankan:
- Buka **Table Editor** di sidebar
- Verifikasi ada 3 table:
  - ✅ `users` 
  - ✅ `visitors`
  - ✅ `quiz_results`

### 4. Test Aplikasi

Jalankan aplikasi:
```bash
npm run dev
```

Coba fitur:
1. **First Visit**: Akan ada LoginPage otomatis
2. **Enter Name**: Masukkan nama, tekan Enter atau klik "Masuk"
3. **Check Supabase**: 
   - Buka `users` table → Nama Anda seharusnya ada
   - Buka `visitors` table → Visit Anda seharusnya tercatat
4. **Play Quiz**: Selesaikan Quiz Masa Depan
5. **Check Results**: 
   - Hasil quiz akan otomatis tersimpan di `quiz_results`
6. **View Leaderboard**: 
   - Klik tombol 🏆 di navbar atau buka `/leaderboard`
   - Lihat ranking dengan score terbaik

---

## 🎯 Fitur yang Sudah Aktif

### ✅ Login System
- User bisa masuk dengan nama
- Nama disimpan di localStorage
- Status login ditampilkan di Navbar

### ✅ User Management  
- User baru otomatis dibuat di database `users` table
- User existing bisa login ulang

### ✅ Visitor Tracking
- Setiap visit dicatat di `visitors` table
- Termasuk IP address dan user agent

### ✅ Quiz Results
- Setiap quiz selesai, hasil otomatis tersimpan
- Termasuk semua jawaban detail (correct/incorrect)

### ✅ Leaderboard
- Ranking berdasarkan total score
- Tampil accuracy, best score, games played
- Update realtime

---

## 📱 Flow Aplikasi

```
Kunjungi App
    ↓
Jika belum login → Redirect ke LoginPage
    ↓
Masukkan Nama → [Cek di DB]
    ↓
Jika ada → Login dengan nama existing
Jika baru → Create user baru + login
    ↓
Homepage dengan greeting "Selamat datang, [Nama]!"
    ↓
Klik Login dengan Akun → Bisa ganti nama
Klik 🏆 → Ke Leaderboard
Klik 🚪 → Logout
```

---

## 🔍 Database Struktur

### `users` table
```
id (PK)           | Unique ID
player_name (U)   | Nama unik user
created_at        | Waktu dibuat
```

### `visitors` table
```
id (PK)           | Unique ID
visitor_name      | Nama visitor
ip_address        | IP address
user_agent        | Browser info
visited_at        | Waktu visit
```

### `quiz_results` table
```
id (PK)           | Unique ID
player_name       | Nama player
score             | Total score
total_correct     | Jumlah jawaban benar
total_questions   | Total soal dijawab
duration          | Durasi quiz (detik)
answers_detail    | JSONB semua jawaban
created_at        | Waktu quiz selesai
```

---

## 🐛 Troubleshooting

**Q: Login page terus muncul**
- Buka browser DevTools → Applications → Local Storage
- Pastikan `playerName` ada
- Jika tidak, coba clear cache dan refresh

**Q: Leaderboard kosong**
- Tunggu sampai 1 orang selesai quiz
- Data harus ada di `quiz_results` table
- Refresh leaderboard page

**Q: Visitor tidak tercatat**
- Check `visitors` table dengan filter nama Anda
- Pastikan RLS policy aktif (ALLOW PUBLIC)

**Q: Error "Missing Supabase environment"**
- Pastikan `.env.local` sudah diisi dengan benar
- Restart dev server setelah update `.env.local`

---

## 📊 Monitoring

Lihat real-time data di Supabase Dashboard:

1. **Active Users**: Lihat `users` table
2. **Visitor Stats**: Lihat `visitors` table
3. **Quiz Performance**: Lihat `quiz_results` table
4. **Leaderboard**: Query `get_leaderboard()` function

---

Status: ✅ **Siap Produksi**

Semua fitur sudah terintegrasi penuh dengan Supabase!
