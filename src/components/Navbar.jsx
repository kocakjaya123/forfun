import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PieChart, List, PlusCircle, BarChart2, Target, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const auth = useAuth();

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <nav className="sticky top-0 z-40 bg-transparent border-b border-white/6 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl bg-gradient-to-br from-brand-emerald to-brand-accent p-2 rounded-lg shadow-md">💰</span>
            <span className="text-lg font-extrabold">UangKu</span>
          </Link>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => navigate('/')} className="px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-white/3"> <PieChart size={16} className="inline mr-2" /> Dashboard</button>
            <button onClick={() => navigate('/transactions')} className="px-3 py-2 rounded-md text-sm hover:bg-white/3"> <List size={16} className="inline mr-2"/> Transactions</button>
            <button onClick={() => navigate('/add')} className="px-3 py-2 rounded-md text-sm bg-brand-emerald text-black font-semibold hover:scale-105 transition-transform"> <PlusCircle size={16} className="inline mr-2"/> Add</button>
            <button onClick={() => navigate('/reports')} className="px-3 py-2 rounded-md text-sm hover:bg-white/3"> <BarChart2 size={16} className="inline mr-2"/> Reports</button>
            <button onClick={() => navigate('/goals')} className="px-3 py-2 rounded-md text-sm hover:bg-white/3"> <Target size={16} className="inline mr-2"/> Goals</button>
          </div>

          <div className="ml-2 flex items-center gap-2">
            {auth.user ? (
              <>
                <span className="hidden sm:inline text-sm px-2 py-1 bg-white/5 rounded">{auth.user.email}</span>
                <button onClick={async () => { await auth.signout(); navigate('/auth'); }} className="px-3 py-2 rounded-md text-sm bg-red-600/40">Sign Out</button>
              </>
            ) : (
              <button onClick={() => navigate('/auth')} className="px-3 py-2 rounded-md text-sm bg-white/5">Sign In</button>
            )}

            <button onClick={() => setDark((d) => !d)} className="p-2 rounded-md hover:bg-white/3">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
