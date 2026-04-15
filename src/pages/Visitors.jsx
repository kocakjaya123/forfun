import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisitorStats } from '../utils/supabaseClient';

export default function VisitorsPage() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setIsLoading(true);
    try {
      const data = await getVisitorStats();

      if (data && data.length > 0) {
        setVisitors(data);

        // Calculate stats
        const uniqueNames = new Set(data.map(v => v.visitor_name)).size;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayCount = data.filter(v => {
          const visitDate = new Date(v.visited_at);
          visitDate.setHours(0, 0, 0, 0);
          return visitDate.getTime() === today.getTime();
        }).length;

        setStats({
          totalVisits: data.length,
          uniqueVisitors: uniqueNames,
          todayVisits: todayCount
        });
      }
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
    setIsLoading(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h yang lalu`;
    const days = Math.floor(hours / 24);
    return `${days}d yang lalu`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg sticky top-0 z-20 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">👥 Visitor Stats</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-all text-lg"
            >
              ← Home
            </button>
          </div>
          <p className="text-white/90 text-sm">Tracking orang yang telah mengunjungi aplikasi</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Visits */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 shadow-lg border-3 border-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold">Total Kunjungan</p>
                <p className="text-5xl font-bold mt-2">{stats.totalVisits}</p>
              </div>
              <div className="text-6xl opacity-30">📊</div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 shadow-lg border-3 border-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold">Orang Unik</p>
                <p className="text-5xl font-bold mt-2">{stats.uniqueVisitors}</p>
              </div>
              <div className="text-6xl opacity-30">👤</div>
            </div>
          </div>

          {/* Today Visits */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 shadow-lg border-3 border-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold">Kunjungan Hari Ini</p>
                <p className="text-5xl font-bold mt-2">{stats.todayVisits}</p>
              </div>
              <div className="text-6xl opacity-30">📅</div>
            </div>
          </div>
        </div>

        {/* Visitors List */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">📋 Daftar Pengunjung</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-2xl text-gray-600">⏳ Memuat data...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-2xl text-gray-600">📭 Belum ada pengunjung</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-3 border-purple-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">#</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">👤 Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">🌐 IP Address</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">📅 Waktu Kunjungan</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">⏰ Waktu Lalu</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-700">🔧 Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor, idx) => (
                    <tr
                      key={visitor.id}
                      className={`border-b-2 border-purple-100 hover:bg-purple-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-purple-600 text-lg">{idx + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 text-base">{visitor.visitor_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-200 px-3 py-1 rounded-lg text-gray-700">
                          {visitor.ip_address || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(visitor.visited_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                          {getTimeAgo(visitor.visited_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 max-w-xs truncate block">
                          {visitor.user_agent ? visitor.user_agent.substring(0, 50) : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Refresh Button */}
          <div className="px-8 py-6 bg-gray-50 border-t-2 border-purple-200 flex justify-center">
            <button
              onClick={loadVisitors}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-2xl p-6 border-3 border-purple-200 shadow-lg">
          <h3 className="text-lg font-bold text-purple-700 mb-4">ℹ️ Informasi</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Total pengunjung: <span className="font-bold">{stats.totalVisits}</span></li>
            <li>✅ Orang unik yang pernah login: <span className="font-bold">{stats.uniqueVisitors}</span></li>
            <li>✅ Setiap orang yang login akan tercatat di database</li>
            <li>✅ Ketika mereka main game dan selesai, score mereka auto-save ke leaderboard</li>
            <li>✅ Total score terus terakumulasi setiap kali mereka bermain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
