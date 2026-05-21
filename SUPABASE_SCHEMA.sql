-- Supabase SQL schema for UangKu Personal Finance Tracker

-- Table: profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  currency text default 'IDR',
  created_at timestamptz default now()
);

-- Table: categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income','expense')),
  color text,
  created_at timestamptz default now()
);

-- Table: transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  amount numeric not null,
  type text not null check (type in ('income','expense')),
  category_id uuid references categories(id) on delete set null,
  note text,
  occurred_at date not null,
  inserted_at timestamptz default now()
);

-- Table: goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  target_date date,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_transactions_user_date on transactions (user_id, occurred_at desc);
create index if not exists idx_categories_user on categories (user_id);

-- RLS (to be enabled on Supabase)
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage their transactions" ON transactions
--   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
