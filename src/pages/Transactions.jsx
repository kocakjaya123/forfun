import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction, DEFAULT_CATEGORIES, subscribeToTransactions } from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import { formatRupiah } from '../utils/format';

export default function Transactions() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => { fetchList(); }, [search, type, category]);

  useEffect(() => {
    const unsub = subscribeToTransactions(() => fetchList());
    return () => { try { unsub && unsub(); } catch (e) {} };
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const filters = { limit: 200 };
      if (type !== 'all') filters.type = type;
      if (search) filters.search = search;
      if (category !== 'all') filters.category = category;
      const { data } = await getTransactions(filters);
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat transaksi');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      const ok = await deleteTransaction(id);
      if (ok) {
        toast.success('Transaksi dihapus');
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else toast.error('Gagal menghapus');
    } catch (err) { toast.error('Gagal menghapus'); }
  };

  const categories = [...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." className="p-2 rounded bg-white/5" />
          <select value={type} onChange={e => setType(e.target.value)} className="p-2 rounded bg-white/5">
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded bg-white/5">
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-gray-400">Memuat...</div>}
        {!loading && transactions.length === 0 && <div className="text-gray-500">Tidak ada transaksi.</div>}
        {!loading && transactions.map(t => (
          <div key={t.id} className="card p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{t.category} <span className="text-sm text-gray-400">• {t.description}</span></div>
              <div className="text-sm text-gray-400">{t.transaction_date}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className={"font-semibold " + (t.type === 'income' ? 'income' : 'expense')}>{t.type === 'income' ? '+ ' : '- '}{formatRupiah(Number(t.amount))}</div>
              <button onClick={() => handleDelete(t.id)} className="px-3 py-1 rounded bg-red-600/40">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
