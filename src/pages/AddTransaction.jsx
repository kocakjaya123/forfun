import { useState } from 'react';
import { addTransaction, DEFAULT_CATEGORIES } from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = type === 'income' ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return toast.error('Masukkan jumlah yang valid');
    if (Number(amount) <= 0) return toast.error('Jumlah harus lebih besar dari 0');
    if (!category) return toast.error('Pilih kategori');

    setLoading(true);
    try {
      await addTransaction({ type, amount: Number(amount), category, description, transaction_date: date });
      toast.success('Transaksi berhasil ditambahkan');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menambahkan transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tambah Transaksi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setType('income')} className={`px-4 py-2 rounded ${type === 'income' ? 'bg-brand-emerald text-black' : 'bg-white/5'}`}>Income</button>
          <button type="button" onClick={() => setType('expense')} className={`px-4 py-2 rounded ${type === 'expense' ? 'bg-red-500 text-black' : 'bg-white/5'}`}>Expense</button>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100000" className="w-full p-3 rounded bg-white/5" />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded bg-white/5">
            <option value="">-- Pilih kategori --</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded bg-white/5" />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="misal: Gaji PT ABC" className="w-full p-3 rounded bg-white/5" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-brand-emerald text-black rounded-md font-semibold">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-white/5 rounded-md">Batal</button>
        </div>
      </form>
    </div>
  );
}
