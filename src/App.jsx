import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  return (
    <Router>
      {user && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={user ? <RequireAuth><Dashboard /></RequireAuth> : <Auth />} />
          <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
          <Route path="/add" element={<RequireAuth><AddTransaction /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path="/goals" element={<RequireAuth><Goals /></RequireAuth>} />
        </Routes>
      </main>
      {user && <FabAdd />}
    </Router>
  );
}

export default App;
