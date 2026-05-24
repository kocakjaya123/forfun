import React from 'react'
import { Menu, Search } from 'lucide-react'

export default function NavbarMobile(){
  return (
    <header className="md:hidden flex items-center justify-between p-4 glass">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-r from-accentStart to-accentEnd flex items-center justify-center text-white font-bold">UQ</div>
        <div className="text-white font-semibold">UangKu</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-200"><Search /></button>
        <button aria-label="menu" className="p-2 text-slate-200"><Menu /></button>
      </div>
    </header>
  )
}
