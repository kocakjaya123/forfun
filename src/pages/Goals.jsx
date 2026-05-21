import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTransactions } from '../utils/supabaseClient';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  useEffect(() => {
    const g = JSON.parse(localStorage.getItem('ff_goals') || '[]');
    setGoals(g);
  }, []);

  useEffect(() => { localStorage.setItem('ff_goals', JSON.stringify(goals)); }, [goals]);

  const addGoal = () => {
    if (!title || !target) return toast.error('Isi judul dan target');
    setGoals(prev => [{ id: Date.now(), title, target: Number(target), created_at: new Date().toISOString() }, ...prev]);
    setTitle(''); setTarget('');
  };

  const removeGoal = (id) => {
    if (!confirm('Hapus goal?')) return;
    setGoals(prev => prev.filter(g=>g.id!==id));
  };

  const [savings, setSavings] = useState(0);
  useEffect(() => {
    (async () => {
      const now = new Date();
      const from = `${now.getFullYear()}-01-01`;
      const to = new Date(now.getFullYear(), 12, 0).toISOString().slice(0,10);
      const { data } = await getTransactions({ fromDate: from, toDate: to, limit: 10000 });
      const income = (data||[]).filter(d=>d.type==='income').reduce((s,d)=>s+Number(d.amount),0);
      const expense = (data||[]).filter(d=>d.type==='expense').reduce((s,d)=>s+Number(d.amount),0);
      setSavings(income-expense);
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Goals & Savings</h2>
        <div className="text-sm text-gray-400">Total Savings: Rp {savings.toLocaleString('id-ID')}</div>
      </div>

      <div className="mb-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Goal title" className="p-2 rounded bg-white/5 mr-2" />
        <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="Target amount" className="p-2 rounded bg-white/5 mr-2" />
        <button onClick={addGoal} className="px-3 py-2 bg-emerald-500 rounded">Add</button>
      </div>

      <div className="space-y-3">
        {goals.length===0 && <div className="text-gray-400">Belum ada goal.</div>}
        {goals.map(g=>{
          const progress = Math.min(100, Math.round((savings / g.target) * 100));
          return (
            <div key={g.id} className="card p-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-medium">{g.title}</div>
                  <div className="text-sm text-gray-400">Target: Rp {g.target.toLocaleString('id-ID')}</div>
                </div>
                <div className="text-sm font-semibold">{progress}%</div>
              </div>
              <div className="w-full bg-white/5 rounded h-3 overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-3 bg-emerald-500" />
              </div>
              <div className="mt-2 text-right">
                <button onClick={()=>removeGoal(g.id)} className="text-red-400 text-sm">Hapus</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
