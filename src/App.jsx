import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { getCurrentUser, onAuthStateChange } from './utils/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch (e) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();

    sub = onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user);
      else if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => { try { sub?.unsubscribe?.(); } catch (e) {} };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">Memeriksa autentikasi...</div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={user ? <RequireAuth><Dashboard /></RequireAuth> : <Navigate to="/auth" replace />} />
          <Route path="/transactions" element={user ? <RequireAuth><Transactions /></RequireAuth> : <Navigate to="/auth" replace />} />
          <Route path="/add" element={user ? <RequireAuth><AddTransaction /></RequireAuth> : <Navigate to="/auth" replace />} />
          <Route path="/reports" element={user ? <RequireAuth><Reports /></RequireAuth> : <Navigate to="/auth" replace />} />
          <Route path="/goals" element={user ? <RequireAuth><Goals /></RequireAuth> : <Navigate to="/auth" replace />} />
          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
      </main>
      {user && <FabAdd />}
    </Router>
  );
}

export default App;
