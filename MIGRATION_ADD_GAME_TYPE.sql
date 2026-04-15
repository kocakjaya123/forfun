-- ===================================
-- MIGRATION: Add game_type Column
-- ===================================
-- Jalankan ini jika Anda sudah punya table quiz_results tapi belum ada game_type column

ALTER TABLE quiz_results 
ADD COLUMN game_type TEXT DEFAULT 'Quiz Masa Depan';

-- Update existing records (pastikan semuanya punya game_type)
UPDATE quiz_results 
SET game_type = 'Quiz Masa Depan' 
WHERE game_type IS NULL;

-- Make column NOT NULL
ALTER TABLE quiz_results 
ALTER COLUMN game_type SET NOT NULL;

-- Create index untuk faster queries
CREATE INDEX idx_quiz_results_game_type ON quiz_results(game_type);
