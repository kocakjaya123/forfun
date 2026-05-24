import TransactionForm from '../components/TransactionForm'

export default function AddTransaction(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Transaction</h1>
      <TransactionForm />
    </div>
  )
}
