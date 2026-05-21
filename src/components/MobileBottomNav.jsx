import { useNavigate } from 'react-router-dom';
import { PieChart, List, PlusCircle, BarChart2, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[rgba(11,18,32,0.9)] backdrop-blur-sm border-t border-white/6 py-2">
      <div className="max-w-6xl mx-auto px-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-xs text-slate-200">
          <PieChart size={18} />
          <span className="mt-1">Dashboard</span>
        </button>

        <button onClick={() => navigate('/transactions')} className="flex flex-col items-center text-xs text-slate-200">
          <List size={18} />
          <span className="mt-1">Transactions</span>
        </button>

        <button onClick={() => navigate('/add')} className="-mt-6 bg-brand-emerald text-black rounded-full p-3 shadow-soft">
          <PlusCircle size={22} />
        </button>

        <button onClick={() => navigate('/reports')} className="flex flex-col items-center text-xs text-slate-200">
          <BarChart2 size={18} />
          <span className="mt-1">Reports</span>
        </button>

        <button onClick={() => navigate('/goals')} className="flex flex-col items-center text-xs text-slate-200">
          <Target size={18} />
          <span className="mt-1">Goals</span>
        </button>
      </div>
    </nav>
  );
}
