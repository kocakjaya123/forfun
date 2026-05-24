import React from 'react'
import { Link } from 'react-router-dom'
import { Home, List, PieChart, Calendar, BarChart2, Settings, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-72 fixed left-0 top-0 h-screen p-6 glass card-shadow">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center text-white font-bold">UQ</div>
          <div>
            <div className="text-xl font-bold text-white">UangKu</div>
            <div className="text-xs text-slate-300">Kelola Keuanganmu</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <Home className="text-slate-100" />
              <span className="text-slate-100">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <List className="text-slate-100" />
              <span className="text-slate-100">Transaksi</span>
            </Link>
          </li>
          <li>
            <Link to="/goals" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <PieChart className="text-slate-100" />
              <span className="text-slate-100">Budget</span>
            </Link>
          </li>
          <li>
            <Link to="/daily" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <Calendar className="text-slate-100" />
              <span className="text-slate-100">Planner</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <BarChart2 className="text-slate-100" />
              <span className="text-slate-100">Laporan</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
              <Settings className="text-slate-100" />
              <span className="text-slate-100">Pengaturan</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-6">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 transition">
          <User className="text-slate-100" />
          <span className="text-slate-100">Profile</span>
        </Link>
      </div>
    </aside>
  )
}
