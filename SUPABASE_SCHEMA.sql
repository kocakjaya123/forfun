-- ===================================
-- SUPABASE SCHEMA FOR FINANCEFLOW
-- Only essential objects for transactions + RLS
-- ===================================

-- Ensure UUID helper is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table: each row owned by an authenticated user (auth.users)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Enable Row Level Security and create restrictive policies so each user can only access their own rows
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT only when they set user_id = auth.uid()
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = user_id);

-- Allow authenticated users to SELECT only their own transactions
CREATE POLICY "Users can select their own transactions" ON transactions
  FOR SELECT
  USING (auth.uid()::uuid = user_id);

-- Allow authenticated users to UPDATE only their own transactions
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE
  USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);

-- Allow authenticated users to DELETE only their own transactions
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE
  USING (auth.uid()::uuid = user_id);

-- Note: service_role (server key) bypasses RLS. For server-side operations, use service role with caution.

