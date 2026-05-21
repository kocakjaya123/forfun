import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';

export default function Categories() {
  const [incomeCats, setIncomeCats] = useState([]);
  const [expenseCats, setExpenseCats] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    const ic = JSON.parse(localStorage.getItem('ff_income_cats') || 'null');
    const ec = JSON.parse(localStorage.getItem('ff_expense_cats') || 'null');
    setIncomeCats(ic || ['Gaji','Freelance','Investasi','Bonus','Lainnya']);
    setExpenseCats(ec || ['Makanan','Transport','Tagihan','Belanja','Hiburan','Kesehatan','Lainnya']);
  }, []);

  useEffect(() => { localStorage.setItem('ff_income_cats', JSON.stringify(incomeCats)); }, [incomeCats]);
  useEffect(() => { localStorage.setItem('ff_expense_cats', JSON.stringify(expenseCats)); }, [expenseCats]);

  const add = () => {
    if (!newCat) return toast.error('Masukkan nama kategori');
    if (type === 'income') setIncomeCats(prev => [newCat, ...prev]);
    else setExpenseCats(prev => [newCat, ...prev]);
    setNewCat('');
  };

  const remove = (t, idx) => {
    if (!confirm('Hapus kategori ini?')) return;
    if (t === 'income') setIncomeCats(prev => prev.filter((_,i) => i!==idx));
    else setExpenseCats(prev => prev.filter((_,i) => i!==idx));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      <div className="mb-4 flex gap-2">
        <div className="w-36">
          <CustomSelect value={type} onChange={e=>setType(e.target.value)} className="p-2">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </CustomSelect>
        </div>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Nama kategori" className="p-2 rounded bg-white/5 flex-1" />
        <button onClick={add} className="px-4 py-2 bg-brand-emerald rounded">Tambah</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-3">
          <h3 className="font-semibold mb-2">Income Categories</h3>
          <ul className="space-y-2">
            {incomeCats.map((c,i) => (
              <li key={c} className="flex justify-between items-center">
                <span>{c}</span>
                <button onClick={()=>remove('income', i)} className="text-sm text-red-400">Hapus</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-3">
          <h3 className="font-semibold mb-2">Expense Categories</h3>
          <ul className="space-y-2">
            {expenseCats.map((c,i) => (
              <li key={c} className="flex justify-between items-center">
                <span>{c}</span>
                <button onClick={()=>remove('expense', i)} className="text-sm text-red-400">Hapus</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
