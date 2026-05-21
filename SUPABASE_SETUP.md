# UangKu — Supabase Setup

Panduan singkat untuk menyiapkan Supabase agar bekerja dengan UangKu (transactions).

## 1. Buat Project Supabase
- Kunjungi https://supabase.com dan buat project baru.

## 2. Buat Table `transactions`
Buka SQL editor di Supabase dan jalankan query berikut:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Basic permissive policy for MVP (ubah untuk produksi)
CREATE POLICY "Public read and insert transactions" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Ambil API Keys
- Project Settings → API
- Copy `Project URL` (SUPABASE_URL)
- Copy `anon public` key (SUPABASE_ANON_KEY)

## 4. Environment
Tambahkan nilai ke file `.env` (atau gunakan Secrets di deployment):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Saya juga menambahkan `.env.example` ke repo sebagai contoh.

## 5. integrasi di kode
Edit `src/utils/supabaseClient.js` dan isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sesuai langkah 3.

## 6. Testing
- Jalankan app secara lokal, tambahkan transaksi melalui UI dan cek tabel `transactions` di Supabase.

Catatan: Untuk produksi, aktifkan autentikasi dan kebijakan RLS yang ketat (hanya user dapat mengakses transaksinya sendiri).
