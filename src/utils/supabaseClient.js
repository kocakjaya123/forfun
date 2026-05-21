import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MISSING_ENV = !SUPABASE_URL || !SUPABASE_ANON_KEY;
if (MISSING_ENV) {
  console.error('Missing Supabase environment variables. Please check .env or .env.local and restart the dev server.');
}

let _supabase = null;
if (!MISSING_ENV) {
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  } catch (e) {
    console.error('Failed to create Supabase client:', e?.message || e);
    _supabase = null;
  }
}

const getSupabase = () => {
  if (!_supabase) {
    throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and restart the dev server.');
  }
  return _supabase;
};

// TRANSACTIONS CRUD
export const addTransaction = async ({ user_id = null, type, amount, category, description = '', transaction_date }) => {
  try {
    const supabase = getSupabase();
    // ensure we attach the authenticated user's id when available
    let owner = user_id;
    if (!owner) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        owner = userData?.user?.id || null;
      } catch (e) {
        // ignore - will rely on DB default if configured
      }
    }

    const payload = {
      user_id: owner,
      type,
      amount,
      category,
      description,
      transaction_date,
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('transactions').insert([payload]).select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('addTransaction error', err);
    // network-friendly message
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('name not resolved') || msg.includes('networkerror')) {
      throw new Error(`Network error: cannot reach Supabase at ${SUPABASE_URL}. Check VITE_SUPABASE_URL in your .env and your network connection.`);
    }
    throw err;
  }
};

export const getTransactions = async ({ fromDate = null, toDate = null, type = null, category = null, search = null, limit = 100, offset = 0 } = {}) => {
  try {
    const supabase = getSupabase();
    let query = supabase.from('transactions').select('*').order('transaction_date', { ascending: false }).range(offset, offset + limit - 1);

    if (fromDate) query = query.gte('transaction_date', fromDate);
    if (toDate) query = query.lte('transaction_date', toDate);
    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('description', `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], count };
  } catch (err) {
    console.error('getTransactions error', err);
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('name not resolved') || msg.includes('networkerror')) {
      throw new Error(`Network error: cannot reach Supabase at ${SUPABASE_URL}. Check VITE_SUPABASE_URL in your .env and your network connection.`);
    }
    return { data: [], count: 0 };
  }
};

export const updateTransaction = async (id, updates) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('updateTransaction error', err);
    throw err;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('deleteTransaction error', err);
    return false;
  }
};

// Summary helpers
export const getMonthlySummary = async (year, month) => {
  try {
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const toDate = new Date(year, month, 0).toISOString().slice(0, 10);
    const supabase = getSupabase();

    const { data, error } = await supabase.rpc('get_monthly_summary', { p_from: from, p_to: toDate });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('getMonthlySummary rpc not available, falling back to client aggregation', err.message || err);
    // Fallback: fetch raw transactions and compute client-side
    const { data } = await getTransactions({ fromDate: `${year}-${String(month).padStart(2, '0')}-01`, toDate: new Date(year, month, 0).toISOString().slice(0, 10), limit: 1000 });
    const incomes = (data || []).filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = (data || []).filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { incomes, expenses, transactions: data || [] };
  }
};

// Realtime subscription helper
export const subscribeToTransactions = (callback) => {
  if (!_supabase) {
    console.warn('subscribeToTransactions: Supabase not configured; subscription disabled.');
    return () => {};
  }
  const channel = getSupabase().channel('public:transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
    callback(payload);
  }).subscribe();

  return () => getSupabase().removeChannel(channel);
};

// Basic categories list (defaults) — can be extended to persist in DB
export const DEFAULT_CATEGORIES = {
  income: ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya'],
  expense: ['Makanan', 'Transport', 'Tagihan', 'Belanja', 'Hiburan', 'Kesehatan', 'Lainnya']
};

// ===== AUTH HELPERS =====
export const signUp = async ({ email, password }) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signIn = async ({ email, password }) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

export const getCurrentUser = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user || null;
};

export const onAuthStateChange = (cb) => {
  if (!_supabase) {
    console.warn('onAuthStateChange: Supabase not configured; auth events disabled.');
    return { data: null };
  }
  const { data: subscription } = getSupabase().auth.onAuthStateChange((event, session) => {
    try { cb(event, session); } catch (e) { console.error(e); }
  });
  return subscription;
};

export default _supabase;

