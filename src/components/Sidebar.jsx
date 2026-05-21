import React from 'react'
import { Home, List, PlusCircle, BarChart2, Target, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-72 bg-slate-900 h-screen p-6 fixed left-0 top-0">
      <div className="text-2xl font-bold mb-8 text-emerald-400">UangKu</div>
      <nav className="flex-1">
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-slate-200 hover:text-white transition-default cursor-pointer"><Home /> Dashboard</li>
          <li className="flex items-center gap-3 text-slate-200 hover:text-white transition-default cursor-pointer"><List /> Transactions</li>
          <li className="flex items-center gap-3 text-slate-200 hover:text-white transition-default cursor-pointer"><PlusCircle /> Add</li>
          <li className="flex items-center gap-3 text-slate-200 hover:text-white transition-default cursor-pointer"><BarChart2 /> Reports</li>
          <li className="flex items-center gap-3 text-slate-200 hover:text-white transition-default cursor-pointer"><Target /> Goals</li>
        </ul>
      </nav>
      <div className="mt-6 flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer"><User /> Profile</div>
    </aside>
  )
}
