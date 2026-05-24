import { TrendingUp, TrendingDown, Target, Plus } from 'lucide-react'

export default function Dashboard() {
  const balance = 2450000
  const income = 8750000
  const expense = 6300000
  const savingsGoal = 1500000
  const dailyRecom = 85000

  // Data dummy untuk chart
  const monthlyData = [2.8, 3.1, 2.4, 4.2, 3.8, 5.1, 4.5, 3.9, 4.8, 5.3, 4.2, 6.1]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Selamat datang kembali, Septian 👋</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl font-medium transition">
          <Plus size={20} />
          Tambah Transaksi
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="flex justify-between">
          <div>
            <p className="text-purple-200 text-sm">Total Saldo Saat Ini</p>
            <p className="text-5xl font-bold mt-2">Rp {balance.toLocaleString('id-ID')}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-300">
              <TrendingUp size={20} />
              <span className="text-sm">+12.5% bulan ini</span>
            </div>
          </div>
        </div>
        <p className="mt-6 text-purple-200">
          Rekomendasi pengeluaran per hari: <span className="font-semibold text-white">Rp {dailyRecom.toLocaleString('id-ID')}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <TrendingUp className="text-green-500" size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pemasukan Bulan Ini</p>
              <p className="text-3xl font-bold text-green-400 mt-1">Rp {income.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-3 rounded-2xl">
              <TrendingDown className="text-red-500" size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pengeluaran Bulan Ini</p>
              <p className="text-3xl font-bold text-red-400 mt-1">Rp {expense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-2xl">
              <Target className="text-purple-400" size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Target Tabungan</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">Rp {savingsGoal.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart & Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Pengeluaran */}
        <div className="bg-gray-900 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pengeluaran Bulanan</h3>
          <div className="h-80 flex items-end gap-2">
            {monthlyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-xl transition-all hover:scale-105"
                  style={{ height: `${val * 60}px` }}
                ></div>
                <p className="text-xs text-gray-500">Bulan {i+1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transaksi Terbaru</h3>
          <div className="space-y-4">
            {[
              { name: 'Gaji Bulanan', amount: 4500000, type: 'income' },
              { name: 'Belanja Bulanan', amount: 1250000, type: 'expense' },
              { name: 'Transfer ke Tabungan', amount: 800000, type: 'savings' },
              { name: 'Makan Siang', amount: 45000, type: 'expense' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">Hari ini</p>
                </div>
                <p className={`font-medium ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.type === 'income' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
