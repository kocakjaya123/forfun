-- ===================================
-- DUMMY DATA FOR LEADERBOARD
-- ===================================
-- Jalankan ini di Supabase SQL Editor untuk populate data testing

-- Insert dummy users
INSERT INTO users (player_name, created_at) VALUES
  ('Budi Santoso', NOW() - INTERVAL '30 days'),
  ('Siti Nurhaliza', NOW() - INTERVAL '25 days'),
  ('Ahmad Wijaya', NOW() - INTERVAL '20 days'),
  ('Dewi Lestari', NOW() - INTERVAL '15 days'),
  ('Rony Kristanto', NOW() - INTERVAL '10 days'),
  ('Maya Putri', NOW() - INTERVAL '5 days')
ON CONFLICT (player_name) DO NOTHING;

-- Insert dummy quiz results untuk Budi Santoso
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Budi Santoso', 'Quiz Masa Depan', 250, 5, 6, 60, '[]', NOW() - INTERVAL '28 days'),
  ('Budi Santoso', 'Tebak Kata Cinta', 420, 7, 10, 120, '[]', NOW() - INTERVAL '27 days'),
  ('Budi Santoso', 'Acak Kata', 380, 5, 8, 90, '[]', NOW() - INTERVAL '26 days'),
  ('Budi Santoso', 'Benar atau Salah', 300, 4, 5, 60, '[]', NOW() - INTERVAL '25 days'),
  ('Budi Santoso', 'Pasangkan Kata', 500, 10, 10, 120, '[]', NOW() - INTERVAL '24 days');

-- Insert dummy quiz results untuk Siti Nurhaliza
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Siti Nurhaliza', 'Quiz Masa Depan', 300, 6, 6, 60, '[]', NOW() - INTERVAL '23 days'),
  ('Siti Nurhaliza', 'Tebak Kata Cinta', 450, 8, 10, 120, '[]', NOW() - INTERVAL '22 days'),
  ('Siti Nurhaliza', 'Acak Kata', 350, 5, 7, 90, '[]', NOW() - INTERVAL '21 days'),
  ('Siti Nurhaliza', 'Benar atau Salah', 350, 5, 6, 60, '[]', NOW() - INTERVAL '20 days');

-- Insert dummy quiz results untuk Ahmad Wijaya
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Ahmad Wijaya', 'Quiz Masa Depan', 200, 4, 6, 60, '[]', NOW() - INTERVAL '19 days'),
  ('Ahmad Wijaya', 'Tebak Kata Cinta', 380, 6, 10, 120, '[]', NOW() - INTERVAL '18 days'),
  ('Ahmad Wijaya', 'Acak Kata', 320, 4, 6, 90, '[]', NOW() - INTERVAL '17 days'),
  ('Ahmad Wijaya', 'Benar atau Salah', 280, 4, 5, 60, '[]', NOW() - INTERVAL '16 days'),
  ('Ahmad Wijaya', 'Pasangkan Kata', 480, 9, 10, 120, '[]', NOW() - INTERVAL '15 days');

-- Insert dummy quiz results untuk Dewi Lestari
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Dewi Lestari', 'Quiz Masa Depan', 220, 4, 6, 60, '[]', NOW() - INTERVAL '14 days'),
  ('Dewi Lestari', 'Tebak Kata Cinta', 400, 7, 10, 120, '[]', NOW() - INTERVAL '13 days'),
  ('Dewi Lestari', 'Benar atau Salah', 320, 5, 6, 60, '[]', NOW() - INTERVAL '12 days'),
  ('Dewi Lestari', 'Pasangkan Kata', 520, 10, 10, 120, '[]', NOW() - INTERVAL '11 days');

-- Insert dummy quiz results untuk Rony Kristanto
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Rony Kristanto', 'Quiz Masa Depan', 280, 5, 6, 60, '[]', NOW() - INTERVAL '10 days'),
  ('Rony Kristanto', 'Tebak Kata Cinta', 390, 7, 10, 120, '[]', NOW() - INTERVAL '9 days'),
  ('Rony Kristanto', 'Acak Kata', 360, 5, 7, 90, '[]', NOW() - INTERVAL '8 days');

-- Insert dummy quiz results untuk Maya Putri
INSERT INTO quiz_results (player_name, game_type, score, total_correct, total_questions, duration, answers_detail, created_at) VALUES
  ('Maya Putri', 'Quiz Masa Depan', 260, 5, 6, 60, '[]', NOW() - INTERVAL '5 days'),
  ('Maya Putri', 'Tebak Kata Cinta', 410, 7, 10, 120, '[]', NOW() - INTERVAL '4 days'),
  ('Maya Putri', 'Benar atau Salah', 290, 4, 5, 60, '[]', NOW() - INTERVAL '3 days'),
  ('Maya Putri', 'Pasangkan Kata', 490, 9, 10, 120, '[]', NOW() - INTERVAL '2 days');

-- Insert visitors
INSERT INTO visitors (visitor_name, ip_address, user_agent, visited_at) VALUES
  ('Budi Santoso', '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '28 days'),
  ('Siti Nurhaliza', '192.168.1.2', 'Mozilla/5.0', NOW() - INTERVAL '23 days'),
  ('Ahmad Wijaya', '192.168.1.3', 'Mozilla/5.0', NOW() - INTERVAL '19 days'),
  ('Dewi Lestari', '192.168.1.4', 'Mozilla/5.0', NOW() - INTERVAL '14 days'),
  ('Rony Kristanto', '192.168.1.5', 'Mozilla/5.0', NOW() - INTERVAL '10 days'),
  ('Maya Putri', '192.168.1.6', 'Mozilla/5.0', NOW() - INTERVAL '5 days');

-- Verify data
SELECT COUNT(*) as total_results FROM quiz_results;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_visitors FROM visitors;
