import { useMemo } from 'react'
import formatRupiah from '../utils/formatRupiah'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function parseNumber(v){
  const n = Number(String(v || 0).toString().replace(/[^0-9.-]+/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default function Dashboard(){
  // load planner data for quick figures
  const planner = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('uangku.dailyPlanner.v1') || '{}') } catch { return {} }
  }, [])

  const income = parseNumber(planner.income)
  const fixed = parseNumber(planner.fixedExpenses)
  const savings = parseNumber(planner.savingsGoal)

  const purchases = (planner.purchases || []).map(p => ({ ...p, price: parseNumber(p.price) }))
  const debtsIOwe = (planner.debtsIOwe || []).map(d => ({ ...d, amount: parseNumber(d.amount) }))
  const debtsOwedToMe = (planner.debtsOwedToMe || []).map(d => ({ ...d, amount: parseNumber(d.amount) }))

  // compute monthly totals (by month index)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthly = months.map((m) => ({ name: m, expense: 0 }))
  // use a stable "now" for calculations during render
  const now = new Date()

  purchases.forEach(p => {
    const dateStr = p.date || now.toISOString()
    const d = new Date(dateStr)
    const mi = d.getMonth()
    monthly[mi].expense += p.price || 0
  })
  debtsIOwe.forEach(d => {
    const dateStr = d.date || now.toISOString()
    const dd = new Date(dateStr)
    monthly[dd.getMonth()].expense += d.amount || 0
  })

  const sumPurchasesThisMonth = purchases.filter(p => { const d = new Date(p.date||now.toISOString()); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).reduce((s,p)=>s+p.price,0)
  const sumDebtsIOweThisMonth = debtsIOwe.filter(d => { const dd = new Date(d.date||now.toISOString()); return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear() }).reduce((s,p)=>s+p.amount,0)
  const sumDebtsOwedToMeThisMonth = debtsOwedToMe.reduce((s,p)=>s+p.amount,0)

  const availableThisMonth = income - fixed - savings - sumDebtsIOweThisMonth - sumPurchasesThisMonth + sumDebtsOwedToMeThisMonth

  const recent = [
    ...purchases.map(p=>({ type: 'Pembelian', name: p.name, amount: p.price, date: p.date })),
    ...debtsIOwe.map(d=>({ type: 'Utang', name: d.name, amount: d.amount, date: d.date })),
  ].sort((a,b)=> new Date(b.date) - new Date(a.date)).slice(0,8)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass p-6 rounded-xl card-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-300">Total Balance</div>
              <div className="text-4xl font-bold mt-1">{formatRupiah(Number(Math.max(0, availableThisMonth)))}</div>
              <div className="text-xs text-slate-400 mt-2">Rekomendasi pengeluaran per hari: <span className="font-semibold">{formatRupiah(Math.max(0, Math.floor(availableThisMonth / Math.max(1, (new Date(new Date().getFullYear(), new Date().getMonth()+1,0).getDate() - new Date().getDate() + 1)))))}</span></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900/50 text-slate-200">Saldo</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-slate-900/40">
              <div className="text-xs text-slate-400">Income</div>
              <div className="font-semibold mt-1">{formatRupiah(income)}</div>
            </div>
            <div className="p-4 rounded-md bg-slate-900/40">
              <div className="text-xs text-slate-400">Expense (this mo.)</div>
              <div className="font-semibold mt-1">{formatRupiah(sumPurchasesThisMonth + sumDebtsIOweThisMonth)}</div>
            </div>
            <div className="p-4 rounded-md bg-slate-900/40">
              <div className="text-xs text-slate-400">Savings Goal</div>
              <div className="font-semibold mt-1">{formatRupiah(savings)}</div>
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-300">Overview</div>
              <div className="text-lg font-bold">Ringkasan</div>
            </div>
            <div className="text-sm text-slate-400">Bulan ini</div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-400">Utang bayar</div>
            <div className="font-semibold">{formatRupiah(sumDebtsIOweThisMonth)}</div>
            <div className="text-xs text-slate-400 mt-3">Piutang masuk</div>
            <div className="font-semibold">{formatRupiah(sumDebtsOwedToMeThisMonth)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-300">Pengeluaran Bulanan</div>
              <div className="text-lg font-bold">Chart</div>
            </div>
            <div className="text-sm text-slate-400">Tahun ini</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(v)=> (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)} />
                <Tooltip formatter={(v)=>formatRupiah(v)} />
                <Bar dataKey="expense" fill="url(#grad)" radius={[6,6,0,0]}>
                </Bar>
                <defs>
                  <linearGradient id="grad" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#DB2777" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-4 rounded-xl card-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-slate-300">Recent Transactions</div>
              <div className="text-lg font-bold">Aktivitas Terbaru</div>
            </div>
            <Link to="/transactions" className="text-sm text-slate-400">Lihat semua</Link>
          </div>

          <ul className="space-y-3">
            {recent.length === 0 && <li className="text-sm text-slate-400">Belum ada transaksi.</li>}
            {recent.map((r,i)=> (
              <li key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.type} • {r.date ? (new Date(r.date)).toLocaleDateString() : '-'}</div>
                </div>
                <div className={`font-semibold ${r.type === 'Pembelian' ? 'text-rose-400' : 'text-emerald-400'}`}>{formatRupiah(r.amount)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link to="/add" className="fixed right-8 bottom-8 p-4 rounded-full accent-gradient text-white shadow-lg hidden md:flex items-center justify-center">
        <Plus />
      </Link>
    </div>
  )
}
