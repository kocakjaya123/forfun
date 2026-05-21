-- ===================================
-- SUPABASE DATABASE SCHEMA SETUP
-- ===================================
-- Jalankan semua query ini di Supabase SQL Editor

-- 1. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create index untuk faster queries
CREATE INDEX idx_users_player_name ON users(player_name);

-- 2. CREATE VISITORS TABLE
CREATE TABLE IF NOT EXISTS visitors (
  id BIGSERIAL PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes untuk faster queries
CREATE INDEX idx_visitors_name ON visitors(visitor_name);
CREATE INDEX idx_visitors_visited ON visitors(visited_at DESC);

-- add visitor_type column to distinguish visitor kinds (lifequest / sharing / general)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS visitor_type TEXT DEFAULT 'general';

-- 3. CREATE QUIZ_RESULTS TABLE (kalau belum ada)
CREATE TABLE IF NOT EXISTS quiz_results (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_correct INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  answers_detail JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes untuk faster queries
CREATE INDEX idx_quiz_results_player_name ON quiz_results(player_name);
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- ===================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ===================================

-- Enable RLS untuk semua table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies untuk public read/write
CREATE POLICY "Allow public insert and read users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public insert and read visitors" ON visitors
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public insert and read quiz_results" ON quiz_results
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ===================================
-- OPTIONAL: CREATE LEADERBOARD VIEW/FUNCTION
-- ===================================

CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INT DEFAULT 50)
RETURNS TABLE (
  player_name TEXT,
  total_score INT,
  total_correct INT,
  total_questions INT,
  games_played INT,
  best_score INT,
  accuracy FLOAT
) AS $$
SELECT 
  player_name,
  SUM(score)::INT as total_score,
  SUM(total_correct)::INT as total_correct,
  SUM(total_questions)::INT as total_questions,
  COUNT(*)::INT as games_played,
  MAX(score)::INT as best_score,
  (SUM(total_correct)::FLOAT / SUM(total_questions)::FLOAT * 100)::FLOAT as accuracy
FROM quiz_results
GROUP BY player_name
ORDER BY total_score DESC
LIMIT limit_count;
$$ LANGUAGE SQL;

-- ===================================
-- STORIES + COMMENTS TABLES (for Sharing Life Story)
-- ===================================
-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Create comments table for stories
CREATE TABLE IF NOT EXISTS story_comments (
  id BIGSERIAL PRIMARY KEY,
  story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_comments_created_at ON story_comments(created_at DESC);

-- Enable RLS for new tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- Basic policies for MVP: allow public read and insert (adjust for production)
CREATE POLICY IF NOT EXISTS "Public read stories" ON stories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert stories" ON stories FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public read comments" ON story_comments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert comments" ON story_comments FOR INSERT WITH CHECK (true);

-- Disallow public update/delete (only DB admin should change)
CREATE POLICY IF NOT EXISTS "Deny update stories" ON stories FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS "Deny delete stories" ON stories FOR DELETE USING (false);

CREATE POLICY IF NOT EXISTS "Deny update comments" ON story_comments FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS "Deny delete comments" ON story_comments FOR DELETE USING (false);

-- Note: For more secure setup, require authenticated inserts and enable moderation flows.

-- ===================================
-- TRANSACTIONS TABLE (FinanceFlow / UangKu)
-- ===================================

-- Ensure UUID helper (adjust if your Supabase Postgres has different extensions)
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

-- Enable RLS and create a permissive policy for MVP (restrict later)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read and insert transactions" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

