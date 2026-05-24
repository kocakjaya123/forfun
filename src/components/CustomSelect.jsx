export default function CustomSelect({options=[]}){
  return (
    <div className="relative">
      <select className="w-full p-2 rounded bg-slate-700">
        {options.map((o,i)=> <option key={i} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
