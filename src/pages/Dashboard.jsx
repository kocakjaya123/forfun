import { useEffect, useState } from 'react';
import { getTransactions, subscribeToTransactions } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../utils/format';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#60a5fa', '#a78bfa', '#f97316'];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, savingsRate: 0 });
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    fetchMonth();
    const unsub = subscribeToTransactions(() => {
      fetchMonth();
    });
    return () => { try { unsub && unsub(); } catch (e) {} };
  }, []);

  const fetchMonth = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const from = `${year}-${month}-01`;
      const to = new Date(year, now.getMonth() + 1, 0).toISOString().slice(0, 10);

      const { data } = await getTransactions({ fromDate: from, toDate: to, limit: 1000 });
      const rows = data || [];
      setTransactions(rows);

      const income = rows.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
      const expense = rows.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
      const balance = income - expense;
      const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
      setSummary({ income, expense, balance, savingsRate });

      // pie data by category (expenses)
      const byCat = {};
      rows.filter(r => r.type === 'expense').forEach(r => {
        byCat[r.category] = (byCat[r.category] || 0) + Number(r.amount);
      });
      const pie = Object.entries(byCat).map(([name, value]) => ({ name, value }));
      setPieData(pie);

      // line data - daily cumulative balance
      const days = {};
      rows.forEach(r => {
        const d = r.transaction_date.slice(0,10);
        days[d] = days[d] || 0;
        days[d] += (r.type === 'income' ? Number(r.amount) : -Number(r.amount));
      });
      const sortedDates = Object.keys(days).sort();
      let cum = 0;
      const line = sortedDates.map(d => {
        cum += days[d];
        return { date: d.slice(8), balance: Math.round(cum) };
      });
      setLineData(line);

      // confetti when positive balance
      if (balance > 0) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400">Ringkasan keuangan pribadi Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/add" className="px-4 py-2 bg-brand-emerald text-black rounded-md font-semibold">+ Tambah Transaksi</Link>
          <Link to="/reports" className="px-3 py-2 bg-white/5 rounded-md">Lihat Laporan</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-sm text-gray-400">Total Balance</div>
            <div className="text-2xl font-bold">{formatRupiah(summary.balance)}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-400">Income Bulan Ini</div>
          <div className="text-2xl font-bold text-income">+ {formatRupiah(summary.income)}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-400">Expense Bulan Ini</div>
          <div className="text-2xl font-bold text-expense">- {formatRupiah(summary.expense)}</div>
          <div className="text-sm text-gray-400 mt-2">Savings Rate: {summary.savingsRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 md:col-span-2" style={{ height: 320 }}>
          <h3 className="font-semibold mb-2">Balance Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4" style={{ height: 320 }}>
          <h3 className="font-semibold mb-2">Expense by Category</h3>
          {pieData.length === 0 ? (
            <div className="text-sm text-gray-400">Belum ada pengeluaran bulan ini.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
                <Tooltip />
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {loading && <div className="text-gray-400">Memuat...</div>}
          {!loading && transactions.length === 0 && <div className="text-gray-500">Belum ada transaksi.</div>}
          {!loading && transactions.slice(0, 6).map(t => (
            <div key={t.id} className="card p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{t.category} <span className="text-sm text-gray-400">• {t.description}</span></div>
                <div className="text-sm text-gray-400">{t.transaction_date}</div>
              </div>
              <div className={"font-semibold " + (t.type === 'income' ? 'income' : 'expense')}>
                {t.type === 'income' ? '+ ' : '- '}{formatRupiah(Number(t.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
