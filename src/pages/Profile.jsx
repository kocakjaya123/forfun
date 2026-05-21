import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile() {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('IDR');

  useEffect(() => {
    const n = localStorage.getItem('ff_user_name') || '';
    const c = localStorage.getItem('ff_currency') || 'IDR';
    setName(n); setCurrency(c);
  }, []);

  const save = () => {
    localStorage.setItem('ff_user_name', name);
    localStorage.setItem('ff_currency', currency);
    toast.success('Profile disimpan');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile & Settings</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400">Nama</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded bg-white/5" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Currency</label>
          <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full p-2 rounded bg-white/5">
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <button onClick={save} className="px-4 py-2 bg-emerald-500 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
