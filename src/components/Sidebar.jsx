import React from 'react'
import { Link } from 'react-router-dom'
import { Home, List, PlusCircle, BarChart2, Target, User, Calendar } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-72 bg-slate-900 h-screen p-6 fixed left-0 top-0">
      <div className="text-2xl font-bold mb-8 text-emerald-400">UangKu</div>
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <Link to="/" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <Home /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/daily" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <Calendar /> Daily
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <List /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/add" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <PlusCircle /> Add
            </Link>
          </li>
          <li>
            <Link to="/reports" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <BarChart2 /> Reports
            </Link>
          </li>
          <li>
            <Link to="/goals" className="flex items-center gap-3 text-slate-200 hover:text-white transition-default">
              <Target /> Goals
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-6">
        <Link to="/profile" className="flex items-center gap-3 text-slate-300 hover:text-white transition-default">
          <User /> Profile
        </Link>
      </div>
    </aside>
  )
}
