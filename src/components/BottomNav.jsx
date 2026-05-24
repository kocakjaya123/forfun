import React from 'react'
import { Home, List, PlusCircle, BarChart2, User } from 'lucide-react'

export default function BottomNav(){
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-md rounded-xl px-4 py-2 flex gap-6 md:hidden">
      <button className="text-slate-200"><Home /></button>
      <button className="text-slate-200"><List /></button>
      <button className="accent-gradient text-white rounded-full p-3 shadow-lg -mt-6"><PlusCircle /></button>
      <button className="text-slate-200"><BarChart2 /></button>
      <button className="text-slate-200"><User /></button>
    </nav>
  )
}
