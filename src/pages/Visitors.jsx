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
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg sticky top-0 z-20 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white truncate">👥 Visitor Stats</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-3 sm:px-4 rounded-full transition-all text-xs sm:text-lg flex-shrink-0"
            >
              ← Home
            </button>
          </div>
          <p className="text-white/90 text-xs sm:text-sm">Tracking orang yang telah mengunjungi aplikasi</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {/* Total Visits */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 sm:p-6 shadow-lg border-3 border-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-semibold">Total Kunjungan</p>
                <p className="text-3xl sm:text-5xl font-bold mt-1 sm:mt-2">{stats.totalVisits}</p>
              </div>
              <div className="text-4xl sm:text-6xl opacity-30">📊</div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 sm:p-6 shadow-lg border-3 border-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-semibold">Orang Unik</p>
                <p className="text-3xl sm:text-5xl font-bold mt-1 sm:mt-2">{stats.uniqueVisitors}</p>
              </div>
              <div className="text-4xl sm:text-6xl opacity-30">👤</div>
            </div>
          </div>

          {/* Today Visits */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 sm:p-6 shadow-lg border-3 border-orange-600 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm font-semibold">Kunjungan Hari Ini</p>
                <p className="text-3xl sm:text-5xl font-bold mt-1 sm:mt-2">{stats.todayVisits}</p>
              </div>
              <div className="text-4xl sm:text-6xl opacity-30">📅</div>
            </div>
          </div>
        </div>

        {/* Visitors List */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-4 sm:px-8 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">📋 Daftar Pengunjung</h2>
          </div>

          {isLoading ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-lg sm:text-2xl text-gray-600">⏳ Memuat data...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-lg sm:text-2xl text-gray-600">📭 Belum ada pengunjung</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-3 p-4">
                {visitors.map((visitor, idx) => (
                  <div
                    key={visitor.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-bold text-purple-700">#{idx + 1}</p>
                        <p className="text-lg font-semibold text-gray-800">{visitor.visitor_name}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                        {getTimeAgo(visitor.visited_at)}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p><span className="font-bold">Kota:</span> {visitor.city || 'N/A'}</p>
                      <p><span className="font-bold">Negara:</span> {visitor.country || 'N/A'}</p>
                      <p><span className="font-bold">Kunjungan:</span> {formatDate(visitor.visited_at)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-3 border-purple-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">#</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">👤 Nama</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">📅 Waktu</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">⏰ Lalu</th>
                      
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">Kota</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-purple-700">Negara</th>
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
                        <td className="px-4 sm:px-6 py-3">
                          <span className="font-bold text-purple-600 text-sm">{idx + 1}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="font-semibold text-gray-800 text-xs sm:text-sm">{visitor.visitor_name}</span>
                        </td>
                        
                        <td className="px-4 sm:px-6 py-3">
                          <span className="text-xs text-gray-600">{formatDate(visitor.visited_at)}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            {getTimeAgo(visitor.visited_at)}
                          </span>
                        </td>
                        
                        <td className="px-4 sm:px-6 py-3">
                          <span className="text-xs text-gray-700">{visitor.city || 'N/A'}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="text-xs text-gray-700">{visitor.country || 'N/A'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Refresh Button */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t-2 border-purple-200 flex justify-center">
            <button
              onClick={loadVisitors}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 border-3 border-purple-200 shadow-lg">
          <h3 className="text-base sm:text-lg font-bold text-purple-700 mb-3 sm:mb-4">ℹ️ Informasi</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
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
