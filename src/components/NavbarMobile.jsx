import React from 'react'
import { Menu } from 'lucide-react'

export default function NavbarMobile(){
  return (
    <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
      <div className="text-lg font-bold">UangKu</div>
      <button aria-label="menu" className="p-2"><Menu /></button>
    </header>
  )
}
