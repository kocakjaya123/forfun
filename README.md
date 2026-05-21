# UangKu — Personal Finance Tracker

UangKu membantu kamu mengelola keuangan pribadi dengan cepat, aman, dan enak dipandang.
Dirancang untuk pemakaian sehari-hari: catat pemasukan & pengeluaran, lihat ringkasan, dan capai target tabungan.

Highlights
- Tema konsisten: hijau-emerald + gold (accent) untuk tampilan yang hangat dan profesional
- Dukungan offline/demo: localStorage demo bila Supabase belum dikonfigurasi
- Floating action button untuk menambah transaksi cepat
- Format mata uang Rupiah rapi (contoh: Rp 1.234.567)

Fitur
- Dashboard: total balance, income & expense, grafik tren, dan ringkasan harian
- Tambah Transaksi: income/expense, kategori, tanggal, dan catatan
- Daftar Transaksi: cari, filter, dan hapus transaksi
- Laporan: pie chart kategori & tren balance per hari
- Goals: atur target tabungan dan lihat progress
- Auth (Supabase) atau demo (local fallback)

Screenshots
- Jika ingin menambahkan screenshot, taruh file di `public/screenshots/` lalu referensikan di README. (Tidak ada screenshot default saat ini.)

Quick Start (Local Development)
1. Install dependencies:

```bash
npm install
```

2. Salin variabel environment:

Buat file `.env` atau `.env.local` dan isi:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Jalankan dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Supabase setup
1. Buat project baru di https://app.supabase.com dan catat `URL` dan `ANON KEY`.
2. Di Supabase → SQL Editor, jalankan file `SUPABASE_SCHEMA.sql` untuk membuat tabel `transactions`.
3. Aktifkan Row Level Security (RLS) jika ingin multi-user, dan tambahkan policy untuk membatasi akses ke pemilik data.

File penting
- `SUPABASE_SCHEMA.sql` — schema tabel `transactions`
- `src/utils/supabaseClient.js` — helper CRUD + demo fallback
- `src/pages/` — semua halaman aplikasi (Dashboard, Transactions, AddTransaction, Reports, Goals, Profile)

Design & UX
- Warna brand ada di `tailwind.config.js` (`brand.emerald` dan `brand.accent`).
- Floating Action Button (`src/components/FabAdd.jsx`) untuk akses cepat ke form tambah transaksi.
- Notifikasi menggunakan `react-hot-toast` dan konfeti saat balance positif (`canvas-confetti`).

Troubleshooting
- Jika ada error saat build, pastikan environment variables diisi. Untuk testing cepat, gunakan mode demo (masuk dengan username demo yang ada di `src/utils/supabaseClient.js`).

Kontribusi
- Fork, buat branch, dan kirim PR. Untuk perubahan besar, buka issue terlebih dahulu.

Terima kasih sudah menggunakan UangKu — kalau mau, saya bisa bantu menambahkan CI, RLS per-user, atau integrasi edit transaksi.
