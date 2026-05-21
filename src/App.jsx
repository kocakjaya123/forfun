import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Auth from './pages/Auth';
import RequireAuth from './components/RequireAuth';
import './index.css';
import FabAdd from './components/FabAdd';
import MobileBottomNav from './components/MobileBottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, checking } = useAuth();

  if (checking) return <div className="min-h-screen flex items-center justify-center">Memeriksa autentikasi...</div>;

  return (
    <Router>
      {user && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <Routes key={user ? 'authed' : 'anon'}>
          {!user && <Route path="/auth" element={<Auth />} />}

          {user && (
            <>
              <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
              <Route path="/add" element={<RequireAuth><AddTransaction /></RequireAuth>} />
              <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
              <Route path="/goals" element={<RequireAuth><Goals /></RequireAuth>} />
            </>
          )}

          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
      </main>
      {user && <FabAdd />}
      {user && <MobileBottomNav />}
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
