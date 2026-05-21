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

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full p-3 rounded bg-white/5" />
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
      </div>
    </div>
  );
}
