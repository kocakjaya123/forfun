import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== USER FUNCTIONS =====
export const createUser = async (playerName) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          player_name: playerName,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    console.log('User created successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const getUserByName = async (playerName) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('player_name', playerName)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ===== VISITOR TRACKING =====
export const trackVisitor = async (visitorName = 'guest') => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          visitor_name: visitorName,
          ip_address: await getClientIp(),
          user_agent: navigator.userAgent,
          visited_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    console.log('Visitor tracked:', visitorName);
    return data;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return null;
  }
};

export const getVisitorStats = async () => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visited_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return [];
  }
};

// Helper untuk get IP (optional)
const getClientIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

// ===== QUIZ RESULTS FUNCTIONS =====
export const saveQuizResult = async (playerName, gameType, score, totalCorrect, allAnswers, duration) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        {
          player_name: playerName,
          game_type: gameType,
          score: score,
          total_correct: totalCorrect,
          total_questions: allAnswers.length,
          duration: duration,
          answers_detail: allAnswers || [],
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    console.log('Quiz result saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return null;
  }
};

export const getQuizResults = async () => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return [];
  }
};

export const getPlayerResults = async (playerName) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('player_name', playerName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching player results:', error);
    return [];
  }
};

export const getLeaderboard = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .rpc('get_leaderboard', { limit_count: limit });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

