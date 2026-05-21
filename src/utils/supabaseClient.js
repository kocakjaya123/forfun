import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MISSING_ENV = !SUPABASE_URL || !SUPABASE_ANON_KEY;
if (MISSING_ENV) {
  console.warn('Supabase environment variables missing. App will run in local/demo mode. To enable Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env and restart the dev server.');
}

let _supabase = null;
if (!MISSING_ENV) {
  try {
    // Use default persistence so sessions survive reloads
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Failed to create Supabase client:', e?.message || e);
    _supabase = null;
  }
}

const getSupabase = () => {
  if (!_supabase) {
    console.warn('Supabase client not initialized. Returning null.');
    return null;
  }
  return _supabase;
};

export const isSupabaseConfigured = () => Boolean(_supabase);

// Local storage keys and helpers
const LOCAL_USER_KEY = 'ff_user';
const LOCAL_TX_KEY = 'ff_txns';

const genId = () => {
  try { return crypto.randomUUID(); } catch (e) { return 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2,9); }
};

const getLocalUser = () => {
  try { const raw = localStorage.getItem(LOCAL_USER_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
};

const setLocalUser = (user) => {
  try { localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user)); } catch (e) {}
  // emit auth event for non-supabase flows
  try { window.dispatchEvent(new CustomEvent('ff:auth', { detail: { event: 'SIGNED_IN', session: { user } } })); } catch (e) {}
};

const clearLocalUser = () => {
  try { localStorage.removeItem(LOCAL_USER_KEY); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent('ff:auth', { detail: { event: 'SIGNED_OUT', session: null } })); } catch (e) {}
};

const readLocalTxns = () => {
  try { const raw = localStorage.getItem(LOCAL_TX_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
};

const writeLocalTxns = (txs) => {
  try { localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(txs)); } catch (e) {}
};

// TRANSACTIONS CRUD
export const addTransaction = async ({ user_id = null, type, amount, category, description = '', transaction_date }) => {
  try {
    const supabase = getSupabase();
    // prefer Supabase when a session user exists
    if (supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const sbUser = userData?.user || null;
        if (sbUser) {
          const owner = user_id || sbUser.id || null;
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
        }
      } catch (e) {
        // continue to fallback checks
      }
    }

    // local/demo fallback when no Supabase session exists
    const localUser = getLocalUser();
    if (localUser) {
      const id = genId();
      const payload = { id, user_id: localUser.id, type, amount, category, description, transaction_date, created_at: new Date().toISOString() };
      const txs = readLocalTxns();
      txs.unshift(payload);
      writeLocalTxns(txs);
      return payload;
    }

    if (_supabase && !localUser) {
      throw new Error('Not authenticated. Sign in to save transactions to Supabase.');
    }
    throw new Error('Supabase not configured. Cannot add transaction.');
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
    // Prefer Supabase when a session exists
    if (supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const sbUser = userData?.user || null;
        if (sbUser) {
          let query = supabase.from('transactions').select('*', { count: 'exact' }).order('transaction_date', { ascending: false }).range(offset, offset + limit - 1);
          // scope to current user for clarity (RLS should also enforce this)
          query = query.eq('user_id', sbUser.id);
          if (fromDate) query = query.gte('transaction_date', fromDate);
          if (toDate) query = query.lte('transaction_date', toDate);
          if (type) query = query.eq('type', type);
          if (category) query = query.eq('category', category);
          if (search) query = query.ilike('description', `%${search}%`);
          const { data, error, count } = await query;
          if (error) throw error;
          return { data: data || [], count };
        }
      } catch (e) {
        // fall through to local fallback
      }
    }

    const localUser = getLocalUser();
    if (localUser) {
      let txs = readLocalTxns().filter(t => t.user_id === localUser.id);
      if (fromDate) txs = txs.filter(t => t.transaction_date >= fromDate);
      if (toDate) txs = txs.filter(t => t.transaction_date <= toDate);
      if (type) txs = txs.filter(t => t.type === type);
      if (category) txs = txs.filter(t => t.category === category);
      if (search) txs = txs.filter(t => (t.description || '').toLowerCase().includes(search.toLowerCase()));
      txs.sort((a,b) => b.transaction_date.localeCompare(a.transaction_date));
      const sliced = txs.slice(offset, offset + limit);
      return { data: sliced, count: txs.length };
    }

    if (!supabase) {
      console.warn('Supabase not configured; returning no transactions.');
      return { data: [], count: 0 };
    }

    // If Supabase is configured but no session, return empty (prompt login from UI)
    return { data: [], count: 0 };
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
    if (supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const sbUser = userData?.user || null;
        if (sbUser) {
          const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).eq('user_id', sbUser.id).select().single();
          if (error) throw error;
          return data;
        }
      } catch (e) {
        // continue to fallback
      }
    }

    const localUser = getLocalUser();
    if (localUser) {
      const txs = readLocalTxns();
      const idx = txs.findIndex(t => t.id === id && t.user_id === localUser.id);
      if (idx === -1) throw new Error('Transaction not found');
      txs[idx] = { ...txs[idx], ...updates };
      writeLocalTxns(txs);
      return txs[idx];
    }

    throw new Error('Supabase not configured or not authenticated. Cannot update transaction.');
  } catch (err) {
    console.error('updateTransaction error', err);
    throw err;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const sbUser = userData?.user || null;
        if (sbUser) {
          const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', sbUser.id);
          if (error) throw error;
          return true;
        }
      } catch (e) {
        // continue to fallback
      }
    }

    const localUser = getLocalUser();
    if (localUser) {
      const txs = readLocalTxns();
      const filtered = txs.filter(t => !(t.id === id && t.user_id === localUser.id));
      writeLocalTxns(filtered);
      return true;
    }

    throw new Error('Supabase not configured or not authenticated. Cannot delete transaction.');
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
  throw new Error('Sign up disabled. Use your existing account to sign in.');
};

export const signIn = async ({ email, password }) => {
  // If env variables were provided but client failed to initialize, do not fallback to local demo
  if (!MISSING_ENV && !_supabase) {
    throw new Error('Supabase configured but client failed to initialize. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // If Supabase client is available, use real auth
  if (_supabase) {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // Local/demo fallback: only when env is missing
  if (MISSING_ENV) {
    if (!email) throw new Error('Email/username required for local mode');
    const user = { id: genId(), email, isDemo: true };
    setLocalUser(user);
    return { user };
  }

  throw new Error('Unable to sign in');
};

export const signOut = async () => {
  const localUser = getLocalUser();
  if (localUser) {
    clearLocalUser();
    return true;
  }
  if (_supabase) {
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    return true;
  }
  return true;
};

export const getCurrentUser = async () => {
  // Prefer Supabase session if available
  if (_supabase) {
    try {
      const { data, error } = await _supabase.auth.getUser();
      if (!error && data?.user) return data.user;
    } catch (e) {
      // fall through to local
    }
  }
  return getLocalUser();
};

export const onAuthStateChange = (cb) => {
  if (_supabase) {
    const { data: subscription } = _supabase.auth.onAuthStateChange((event, session) => {
      try { cb(event, session); } catch (e) { console.error(e); }
    });
    return subscription;
  }

  const handler = (e) => {
    const { event, session } = e.detail || {};
    try { cb(event, session); } catch (err) { console.error(err); }
  };
  window.addEventListener('ff:auth', handler);
  return { unsubscribe: () => window.removeEventListener('ff:auth', handler) };
};

// Sync local demo transactions to Supabase for the currently authenticated Supabase user
export const syncLocalToSupabase = async () => {
  const localUser = getLocalUser();
  if (!localUser) return { inserted: 0 };
  const txs = readLocalTxns().filter(t => t.user_id === localUser.id);
  if (!txs.length) return { inserted: 0 };
  if (!_supabase) throw new Error('Supabase not configured');

  const { data: userData } = await _supabase.auth.getUser();
  const currentUser = userData?.user;
  if (!currentUser) throw new Error('No Supabase user session found');

  const payloads = txs.map(t => ({
    user_id: currentUser.id,
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    transaction_date: t.transaction_date,
    created_at: t.created_at
  }));

  const { data, error } = await _supabase.from('transactions').insert(payloads).select();
  if (error) throw error;

  // Clear local demo data after successful sync
  writeLocalTxns([]);
  clearLocalUser();
  return { inserted: (data || []).length, data };
};

export default _supabase;

