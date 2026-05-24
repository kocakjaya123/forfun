import { useEffect, useState } from 'react'
import formatRupiah from '../utils/formatRupiah'
import { Trash2, Edit, Plus } from 'lucide-react'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export default function Transactions(){
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uangku.transactions.v1') || '[]') } catch { return [] }
  })

  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', date: new Date().toISOString().slice(0,10) })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('uangku.transactions.v1', JSON.stringify(transactions))
      window.dispatchEvent(new CustomEvent('uangku:transactions-updated', { detail: transactions }))
    } catch { /* ignore write errors */ }
  }, [transactions])

  function resetForm(){
    setForm({ name: '', amount: '', type: 'expense', date: new Date().toISOString().slice(0,10) })
    setEditingId(null)
  }

  function handleSubmit(e){
    e.preventDefault()
    const name = (form.name || '').trim()
    const amount = Number(String(form.amount || 0).replace(/[^0-9.-]+/g, '')) || 0
    if(!name) return

    if(editingId){
      setTransactions(prev => prev.map(t => t.id === editingId ? { ...t, name, amount, type: form.type, date: form.date } : t))
      resetForm()
      return
    }

    const tx = { id: uid(), name, amount, type: form.type, date: form.date }
    setTransactions(prev => [tx, ...prev])

    // if expense, also add to planner purchases for convenience
    if(tx.type === 'expense'){
      try{
        const raw = localStorage.getItem('uangku.dailyPlanner.v1')
        const planner = raw ? JSON.parse(raw) : { income:0, fixedExpenses:0, savingsGoal:0, debtsIOwe:[], debtsOwedToMe:[], purchases:[] }
        planner.purchases = planner.purchases || []
        planner.purchases.push({ name: tx.name, price: tx.amount, date: tx.date })
        localStorage.setItem('uangku.dailyPlanner.v1', JSON.stringify(planner))
        window.dispatchEvent(new CustomEvent('uangku:planner-updated', { detail: planner }))
      } catch { /* ignore planner write errors */ }
    }

    resetForm()
  }

  function handleEdit(tx){
    setEditingId(tx.id)
    setForm({ name: tx.name, amount: tx.amount, type: tx.type, date: tx.date || new Date().toISOString().slice(0,10) })
  }

  function handleDelete(id){
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-sm text-slate-400">Catat dan kelola transaksi harianmu</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={()=>{ setForm(f=>({...f, type:'expense'})); }} className="px-3 py-2 rounded bg-rose-600 text-white">Buat Expense</button>
          <button onClick={()=>{ setForm(f=>({...f, type:'income'})); }} className="px-3 py-2 rounded bg-emerald-600 text-white">Buat Income</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-2xl space-y-3">
          <div>
            <label className="text-xs text-slate-400">Nama</label>
            <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-2 rounded bg-slate-800 mt-1" />
          </div>
          <div>
            <label className="text-xs text-slate-400">Jumlah</label>
            <input value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} className="w-full p-2 rounded bg-slate-800 mt-1" />
          </div>
          <div className="flex gap-2">
            <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="p-2 rounded bg-slate-800 w-1/2">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="savings">Savings</option>
            </select>
            <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="p-2 rounded bg-slate-800 w-1/2" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-2xl">
              <Plus />
              {editingId ? 'Simpan' : 'Tambahkan'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-2xl bg-slate-800 text-slate-200">Reset</button>
          </div>
        </form>

        <div className="lg:col-span-2 bg-slate-900 p-4 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Riwayat Transaksi</h3>
          <div className="space-y-2">
            {transactions.length === 0 && <div className="text-slate-400">Belum ada transaksi.</div>}
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded hover:bg-slate-800 transition">
                <div>
                  <div className="font-medium text-white">{tx.name}</div>
                  <div className="text-xs text-slate-400">{tx.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}</div>
                  <button onClick={()=>handleEdit(tx)} className="p-2 rounded hover:bg-slate-800"><Edit size={16} /></button>
                  <button onClick={()=>handleDelete(tx.id)} className="p-2 rounded hover:bg-slate-800 text-rose-400"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
