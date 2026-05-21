import { useEffect, useState } from 'react';
import { getTransactions } from '../utils/supabaseClient';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatRupiah } from '../utils/format';

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#60a5fa', '#a78bfa', '#f97316'];

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState([]);

  useEffect(() => { fetchMonth(); }, [year, month]);

  const fetchMonth = async () => {
    const m = String(month).padStart(2, '0');
    const from = `${year}-${m}-01`;
    const to = new Date(year, month, 0).toISOString().slice(0,10);
    const { data } = await getTransactions({ fromDate: from, toDate: to, limit: 1000 });
    setData(data || []);
  };

  const expenseByCat = () => {
    const map = {};
    (data||[]).filter(d => d.type==='expense').forEach(d => map[d.category] = (map[d.category]||0)+Number(d.amount));
    return Object.entries(map).map(([name, value])=>({ name, value }));
  };

  const trend = () => {
    const days = {};
    (data||[]).forEach(r=>{
      const d = r.transaction_date.slice(0,10);
      days[d] = days[d] || 0;
      days[d] += (r.type==='income' ? Number(r.amount) : -Number(r.amount));
    });
    const sorted = Object.keys(days).sort();
    let cum = 0;
    return sorted.map(d=>{ cum+=days[d]; return { date: d.slice(8), balance: Math.round(cum) }; });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex items-center gap-2">
          <select value={month} onChange={e=>setMonth(Number(e.target.value))} className="p-2 rounded bg-white/5">
            {Array.from({length:12}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} className="p-2 rounded bg-white/5 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4" style={{ height: 320 }}>
          <h3 className="font-semibold mb-2">Expense by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseByCat()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
              <Tooltip />
              {expenseByCat().map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4" style={{ height: 320 }}>
          <h3 className="font-semibold mb-2">Balance Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend()}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Transactions ({data.length})</h3>
        <div className="space-y-2">
          {data.map(t => (
            <div key={t.id} className="card p-3 flex justify-between">
              <div>
                <div className="font-medium">{t.category} <span className="text-sm text-gray-400">• {t.description}</span></div>
                <div className="text-sm text-gray-400">{t.transaction_date}</div>
              </div>
              <div className={"font-semibold " + (t.type==='income' ? 'income' : 'expense')}>{t.type==='income'?'+ ':'- '}{formatRupiah(Number(t.amount))}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
