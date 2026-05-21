import React from 'react'

export default function Dashboard(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-800 p-4 rounded">Main</div>
        <div className="bg-slate-800 p-4 rounded">Side</div>
      </div>
    </div>
  )
}
