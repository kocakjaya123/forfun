import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signIn, getCurrentUser, syncLocalToSupabase } from '../utils/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

  useEffect(() => {
    // if already authenticated and Supabase is configured, redirect to dashboard
    (async () => {
      try {
        const u = await getCurrentUser();
        if (u && supabaseConfigured) navigate('/');
      } catch (e) {}
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabaseConfigured) {
        toast.error('Supabase belum dikonfigurasi. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env');
        return;
      }

      await signIn({ email, password });
      toast.success('Login sukses');
      // redirect to dashboard
      const user = await getCurrentUser();
      if (user) {
        // if logged into a real Supabase account, try to migrate local demo transactions
        try {
          if (!user.isDemo) {
            const res = await syncLocalToSupabase();
            if (res.inserted > 0) toast.success(`Synced ${res.inserted} transactions to your account`);
          }
        } catch (e) {
          console.warn('Sync local to Supabase failed', e?.message || e);
        }
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Auth error');
    } finally {
      setLoading(false);
    }
  };

  // no demo helpers — keep login clean

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center mb-6">
        <span className="text-4xl bg-gradient-to-br from-brand-emerald to-brand-accent p-3 rounded-lg inline-block">💰</span>
        <div className="text-2xl font-extrabold text-white mt-3">UangKu</div>
      </div>
      <div className="card p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign In to UangKu</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email atau username</label>
            <input type="text" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full p-3 rounded bg-white/5" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full p-3 rounded bg-white/5" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-emerald rounded font-semibold">{loading ? 'Signing In...' : 'Sign In'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
