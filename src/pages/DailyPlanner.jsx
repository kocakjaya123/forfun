import React, { useEffect, useMemo, useState } from 'react'
import formatRupiah from '../utils/formatRupiah'

const STORAGE_KEY = 'uangku.dailyPlanner.v1'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    // ignore
  }
}

export default function DailyPlanner(){
  const [state, setState] = useState(() => loadData() || {
    income: 0,
    fixedExpenses: 0,
    savingsGoal: 0,
    debtsIOwe: [], // {name, amount, date}
    debtsOwedToMe: [],
    purchases: [], // {name, price, date}
  })

  useEffect(() => {
    saveData(state)
  }, [state])

  // small helpers
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0)
  const daysRemaining = Math.max(1, endOfMonth.getDate() - today.getDate() + 1)

  const parseNumber = (v) => {
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  const withinThisMonth = (dateStr) => {
    const d = new Date(dateStr)
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()
  }

  const sumDebtsIOweThisMonth = useMemo(() => {
    return state.debtsIOwe.filter(d => withinThisMonth(d.date)).reduce((s, i) => s + parseNumber(i.amount), 0)
  }, [state.debtsIOwe])

  const sumDebtsOwedToMeThisMonth = useMemo(() => {
    return state.debtsOwedToMe.filter(d => withinThisMonth(d.date)).reduce((s, i) => s + parseNumber(i.amount), 0)
  }, [state.debtsOwedToMe])

  const sumPurchasesThisMonth = useMemo(() => {
    return state.purchases.filter(p => withinThisMonth(p.date)).reduce((s, p) => s + parseNumber(p.price), 0)
  }, [state.purchases])

  const availableThisMonth = useMemo(() => {
    const inc = parseNumber(state.income)
    const fixed = parseNumber(state.fixedExpenses)
    const save = parseNumber(state.savingsGoal)
    return inc - fixed - save - sumDebtsIOweThisMonth - sumPurchasesThisMonth + sumDebtsOwedToMeThisMonth
  }, [state.income, state.fixedExpenses, state.savingsGoal, sumDebtsIOweThisMonth, sumDebtsOwedToMeThisMonth, sumPurchasesThisMonth])

  const dailyBudget = useMemo(() => {
    return Math.floor(availableThisMonth / daysRemaining)
  }, [availableThisMonth, daysRemaining])

  // add/remove handlers
  function addDebt(type, item) {
    setState(prev => ({ ...prev, [type]: [...prev[type], item] }))
  }
  function removeDebt(type, idx) {
    setState(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }))
  }
  function addPurchase(item){
    setState(prev => ({ ...prev, purchases: [...prev.purchases, item] }))
  }
  function removePurchase(idx){
    setState(prev => ({ ...prev, purchases: prev.purchases.filter((_, i) => i !== idx) }))
  }

  // small form state
  const [debtName, setDebtName] = useState('')
  const [debtAmount, setDebtAmount] = useState('')
  const [debtDate, setDebtDate] = useState('')
  const [buyName, setBuyName] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [debtDirection, setDebtDirection] = useState('owe') // 'owe' or 'owed'

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Planner — Keuangan Harian</h1>

      <section className="bg-slate-800 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-slate-300">Pendapatan Bulanan</label>
          <input type="number" value={state.income} onChange={e=>setState(s=>({...s, income: e.target.value}))} className="w-full mt-1 p-2 rounded bg-slate-900" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Pengeluaran Tetap Bulanan</label>
          <input type="number" value={state.fixedExpenses} onChange={e=>setState(s=>({...s, fixedExpenses: e.target.value}))} className="w-full mt-1 p-2 rounded bg-slate-900" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Target Tabungan Bulanan</label>
          <input type="number" value={state.savingsGoal} onChange={e=>setState(s=>({...s, savingsGoal: e.target.value}))} className="w-full mt-1 p-2 rounded bg-slate-900" />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Utang / Piutang</h2>
          <div className="flex gap-2 mb-2">
            <select value={debtDirection} onChange={e=>setDebtDirection(e.target.value)} className="p-2 bg-slate-900 rounded">
              <option value="owe">Saya Berutang</option>
              <option value="owed">Orang Berutang ke Saya</option>
            </select>
            <input placeholder="Nama" value={debtName} onChange={e=>setDebtName(e.target.value)} className="p-2 bg-slate-900 rounded flex-1" />
            <input placeholder="Jumlah" value={debtAmount} onChange={e=>setDebtAmount(e.target.value)} className="p-2 bg-slate-900 rounded w-32" />
            <input type="date" value={debtDate} onChange={e=>setDebtDate(e.target.value)} className="p-2 bg-slate-900 rounded w-40" />
            <button onClick={()=>{
              if(!debtName || !debtAmount) return
              const item = { name: debtName, amount: parseNumber(debtAmount), date: debtDate || new Date().toISOString() }
              if(debtDirection === 'owe') addDebt('debtsIOwe', item)
              else addDebt('debtsOwedToMe', item)
              setDebtName(''); setDebtAmount(''); setDebtDate('')
            }} className="ml-2 bg-emerald-500 px-3 py-2 rounded">Tambah</button>
          </div>

          <div className="grid gap-2">
            <div>
              <h3 className="text-sm text-slate-300">Saya Berutang (this month)</h3>
              <ul className="mt-2">
                {state.debtsIOwe.map((d, i) => (
                  <li key={i} className="flex justify-between text-sm py-1 border-b border-slate-700">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.date ? (new Date(d.date)).toLocaleDateString() : '-'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{formatRupiah(Number(d.amount))}</div>
                      <button onClick={()=>removeDebt('debtsIOwe', i)} className="text-sm text-rose-400">hapus</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <h3 className="text-sm text-slate-300">Orang Berutang ke Saya (this month)</h3>
              <ul className="mt-2">
                {state.debtsOwedToMe.map((d, i) => (
                  <li key={i} className="flex justify-between text-sm py-1 border-b border-slate-700">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.date ? (new Date(d.date)).toLocaleDateString() : '-'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{formatRupiah(Number(d.amount))}</div>
                      <button onClick={()=>removeDebt('debtsOwedToMe', i)} className="text-sm text-rose-400">hapus</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Jadwalkan Pembelian</h2>
          <div className="flex gap-2 mb-2">
            <input placeholder="Nama barang" value={buyName} onChange={e=>setBuyName(e.target.value)} className="p-2 bg-slate-900 rounded flex-1" />
            <input placeholder="Harga" value={buyPrice} onChange={e=>setBuyPrice(e.target.value)} className="p-2 bg-slate-900 rounded w-32" />
            <input type="date" value={buyDate} onChange={e=>setBuyDate(e.target.value)} className="p-2 bg-slate-900 rounded w-40" />
            <button onClick={()=>{
              if(!buyName || !buyPrice) return
              addPurchase({ name: buyName, price: parseNumber(buyPrice), date: buyDate || new Date().toISOString() })
              setBuyName(''); setBuyPrice(''); setBuyDate('')
            }} className="ml-2 bg-emerald-500 px-3 py-2 rounded">Tambah</button>
          </div>

          <ul className="mt-2">
            {state.purchases.sort((a,b)=> new Date(a.date) - new Date(b.date)).map((p, i) => (
              <li key={i} className="flex justify-between py-2 border-b border-slate-700 text-sm">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.date ? (new Date(p.date)).toLocaleDateString() : '-'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div>{formatRupiah(Number(p.price))}</div>
                  <button onClick={()=>removePurchase(i)} className="text-rose-400 text-sm">hapus</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-800 p-4 rounded mb-4">
        <h2 className="font-semibold">Ringkasan Bulanan</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900 rounded">
            <div className="text-xs text-slate-400">Pendapatan</div>
            <div className="font-bold">{formatRupiah(Number(state.income))}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <div className="text-xs text-slate-400">Pengeluaran Tetap</div>
            <div className="font-bold">{formatRupiah(Number(state.fixedExpenses))}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <div className="text-xs text-slate-400">Utang bayar (bulan ini)</div>
            <div className="font-bold">{formatRupiah(Number(sumDebtsIOweThisMonth))}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <div className="text-xs text-slate-400">Piutang masuk (bulan ini)</div>
            <div className="font-bold">{formatRupiah(Number(sumDebtsOwedToMeThisMonth))}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm text-slate-300">Anggaran tersedia bulan ini</h3>
          <div className="text-3xl font-bold mt-1">{formatRupiah(Number(availableThisMonth))}</div>
          <div className="text-sm text-slate-400">Sisa hari bulan: {daysRemaining} hari</div>

          <div className={`mt-4 p-4 rounded ${dailyBudget <= 0 ? 'bg-rose-800' : 'bg-slate-900'}`}>
            <div className="text-sm text-slate-400">Rekomendasi pengeluaran per hari</div>
            <div className="text-2xl font-bold mt-1">{formatRupiah(Number(Math.max(0, dailyBudget)))}</div>
            {dailyBudget <= 0 && (
              <div className="text-sm text-rose-300 mt-2">Perhatian: anggaran negatif. Kurangi pengeluaran atau tunda pembelian.</div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-800 p-4 rounded">
        <h2 className="font-semibold mb-2">Rencana Pembelian (urut tanggal)</h2>
        <ul>
          {state.purchases.sort((a,b)=> new Date(a.date) - new Date(b.date)).map((p,i)=> (
            <li key={i} className="flex justify-between py-2 border-b border-slate-700">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-400">{p.date ? (new Date(p.date)).toLocaleDateString() : '-'}</div>
              </div>
              <div className="text-sm">{formatRupiah(Number(p.price))}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
