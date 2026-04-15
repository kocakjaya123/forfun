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
