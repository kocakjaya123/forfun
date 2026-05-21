import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signIn, getCurrentUser, syncLocalToSupabase } from '../utils/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Demo credentials (provided by user for quick login)
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
      <div className="card p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
        <p className="text-sm text-gray-400 mb-4">Aplikasi personal finance sederhana — masuk untuk melihat transaksi Anda.</p>
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
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-emerald rounded font-semibold">{loading ? 'Processing...' : 'Sign In'}</button>
          </div>
        </form>

        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-sm text-gray-400 mb-2">Quick access (demo)</p>
          <div className="flex gap-2">
            <button onClick={handleFillDemo} disabled={loading} className="flex-1 px-4 py-2 bg-brand-emerald-dark hover:bg-brand-emerald rounded font-semibold">Use Demo Account</button>
            <button onClick={() => { setEmail(''); setPassword(''); }} className="px-3 py-2 bg-white/5 rounded">Clear</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Demo: <span className="font-mono">{DEMO_CREDENTIALS.email}</span> / <span className="font-mono">{DEMO_CREDENTIALS.password}</span></p>
          <p className="text-xs text-gray-500 mt-2">Email asli: ardhiseptiand@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
