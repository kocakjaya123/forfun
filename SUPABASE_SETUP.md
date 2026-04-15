# Setup Supabase untuk Quiz Cinta

## 1. Create Supabase Account
- Kunjungi https://supabase.com
- Sign up dengan email Anda
- Create a new project

## 2. Create Database Table

Buka SQL editor di Supabase dan jalankan query berikut:

```sql
-- Create quiz_results table
CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_correct INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  answers_detail JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create index for faster queries
CREATE INDEX idx_player_name ON quiz_results(player_name);
CREATE INDEX idx_created_at ON quiz_results(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policy for public read/write
CREATE POLICY "Allow public insert and read" ON quiz_results
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Get API Keys
- Go to Project Settings → API
- Copy `Project URL` (SUPABASE_URL)
- Copy `anon public` key (SUPABASE_ANON_KEY)

## 4. Update supabaseClient.js
Edit `src/utils/supabaseClient.js` dan ganti:

```javascript
const SUPABASE_URL = 'your-actual-project-url';
const SUPABASE_ANON_KEY = 'your-actual-anon-key';
```

Dengan nilai yang Anda dapatkan dari langkah 3.

## 5. Data Structure

Setiap quiz result akan disimpan dengan struktur:
```json
{
  "player_name": "Nama Pemain",
  "score": 200,
  "total_correct": 4,
  "total_questions": 6,
  "duration": 60,
  "answers_detail": [
    {
      "questionId": 1,
      "question": "...",
      "selectedAnswerIndex": 0,
      "selectedAnswerText": "...",
      "correctAnswerIndex": 1,
      "correctAnswerText": "...",
      "isCorrect": false
    }
  ],
  "created_at": "2024-04-15T10:30:00Z"
}
```

## Testing
Setelah setup, buka quiz dan selesaikan 1 soal. Check di Supabase → quiz_results table untuk memastikan data tersimpan.
