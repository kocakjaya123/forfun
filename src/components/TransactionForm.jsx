export default function TransactionForm(){
  return (
    <form className="bg-slate-800 p-4 rounded-lg">
      <div className="flex gap-2 mb-3">
        <button className="flex-1 py-2 rounded bg-emerald-500">Income</button>
        <button className="flex-1 py-2 rounded bg-slate-700">Expense</button>
      </div>
      <div className="mb-3">
        <input className="w-full p-2 rounded bg-slate-700" placeholder="Amount" />
      </div>
      <div className="mb-3">
        <input className="w-full p-2 rounded bg-slate-700" placeholder="Category" />
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-emerald-500 rounded">Add</button>
      </div>
    </form>
  )
}
