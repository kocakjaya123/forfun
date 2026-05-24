import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home, List, PieChart, Calendar, BarChart2, Settings, Menu, X } from 'lucide-react'
import formatRupiah from '../utils/formatRupiah'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: List, label: 'Transaksi', path: '/transactions' },
  { icon: PieChart, label: 'Budget', path: '/budget' },
  { icon: Calendar, label: 'Planner', path: '/daily' },
  { icon: BarChart2, label: 'Laporan', path: '/reports' },
  { icon: Settings, label: 'Pengaturan', path: '/settings' },
]

export default function Sidebar({ currentPath = '/' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const parseNumber = (v) => {
      const n = Number(String(v || 0).toString().replace(/[^0-9.-]+/g, ''))
      return Number.isFinite(n) ? n : 0
    }

    const updateBalance = () => {
      try {
        const raw = localStorage.getItem('uangku.dailyPlanner.v1')
        if (!raw) {
          setBalance(null)
          return
        }
        const planner = JSON.parse(raw)
        const income = parseNumber(planner.income)
        const fixed = parseNumber(planner.fixedExpenses)
        const savings = parseNumber(planner.savingsGoal)
        const purchases = (planner.purchases || []).reduce((s, p) => s + parseNumber(p.price), 0)
        const debtsIOwe = (planner.debtsIOwe || []).reduce((s, d) => s + parseNumber(d.amount), 0)
        const debtsOwedToMe = (planner.debtsOwedToMe || []).reduce((s, d) => s + parseNumber(d.amount), 0)
        const available = income - fixed - savings - purchases - debtsIOwe + debtsOwedToMe
        setBalance(available)
      } catch {
        setBalance(null)
      }
    }

    updateBalance()

    const onStorage = (e) => {
      if (!e || e.key === null) {
        // some browsers send storage events with null key on clear; refresh anyway
        updateBalance()
        return
      }
      if (e.key === 'uangku.dailyPlanner.v1') updateBalance()
    }
    const onCustom = () => updateBalance()

    window.addEventListener('storage', onStorage)
    window.addEventListener('uangku:planner-updated', onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('uangku:planner-updated', onCustom)
    }
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gray-900 p-3 rounded-2xl text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-950 border-r border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              💰
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">UangKu</h1>
              <p className="text-xs text-gray-500 -mt-1">Kelola dengan Cerdas</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-900 rounded-2xl p-4 text-xs">
            <p className="text-gray-500">Saldo tersedia</p>
            <p className="text-white font-medium">{balance != null ? formatRupiah(balance) : '—'}</p>
          </div>
        </div>
      </div>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
