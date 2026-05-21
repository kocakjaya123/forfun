import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signIn, signUp, getCurrentUser } from '../utils/supabaseClient';

export default function Auth() {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Demo credentials (provided by user for quick login)
  const DEMO_CREDENTIALS = { email: 'kocakjaya123', password: 'ursafirst123' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn({ email, password });
        toast.success('Login sukses');
      } else {
        await signUp({ email, password });
        toast.success('Akun dibuat — cek email untuk verifikasi jika diperlukan');
      }
      // redirect to dashboard
      const user = await getCurrentUser();
      if (user) navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Auth error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      await signIn(DEMO_CREDENTIALS);
      toast.success('Login sukses (demo)');
      const user = await getCurrentUser();
      if (user) navigate('/');
    } catch (err) {
      console.error('Demo login failed', err);
      toast.error(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
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
            <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-500 rounded font-semibold">{loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create')}</button>
            <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="px-3 py-2 bg-white/5 rounded">{mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}</button>
          </div>
        </form>

        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-sm text-gray-400 mb-2">Quick access (demo)</p>
          <div className="flex gap-2">
            <button onClick={handleDemoLogin} disabled={loading} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-semibold">Use demo account</button>
            <button onClick={() => { setEmail(''); setPassword(''); }} className="px-3 py-2 bg-white/5 rounded">Clear</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Demo: <span className="font-mono">{DEMO_CREDENTIALS.email}</span> / <span className="font-mono">{DEMO_CREDENTIALS.password}</span></p>
        </div>
      </div>
    </div>
  );
}
