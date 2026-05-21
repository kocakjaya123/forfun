## UangKu — Personal Finance Tracker

UangKu adalah aplikasi web untuk mengelola keuangan pribadi: input pemasukan, pengeluaran, visualisasi, laporan bulanan, dan target tabungan.

Fitur utama:
- Dashboard dengan total balance, income & expense bulan ini, dan charts
- Tambah transaksi (Income / Expense) dengan kategori, tanggal, dan catatan
- Daftar transaksi lengkap dengan pencarian, filter, dan penghapusan
- Manage kategori (lokal, tersimpan di browser)
- Laporan bulanan dan chart (pie & trend)
- Goals / Savings tracking
- Profile & settings (nama, currency)

Tech stack:
- React 18 + Vite
- Tailwind CSS
- React Router v7
- Supabase (Postgres) via `@supabase/supabase-js`
- Recharts, date-fns, lucide-react, react-hot-toast, canvas-confetti

Quick start
1. Install dependencies:

```bash
npm install
```

2. Copy environment variables (see `.env.example`) and fill your Supabase URL and anon key.

3. Run dev server:

```bash
npm run dev
```

Database (Supabase)
- Saya menambahkan tabel `transactions` di `SUPABASE_SCHEMA.sql`. Jalankan SQL tersebut di Supabase SQL editor.
- Contoh schema:

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Env vars (example in `.env.example`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Developer notes
- Supabase client helpers are in `src/utils/supabaseClient.js` (CRUD + realtime helper)
- Pages live in `src/pages/` (Dashboard, Transactions, AddTransaction, Categories, Reports, Goals, Profile)
- Components and styles use Tailwind; theme is dark-first and mobile-friendly

Next steps you might want me to do:
- Integrate authenticated users + RLS per-user transactions
- Persist categories in Supabase
- Add edit-transaction UI
- Add tests and CI

Enjoy UangKu — aplikasi ini sekarang bernama `UangKu`.
