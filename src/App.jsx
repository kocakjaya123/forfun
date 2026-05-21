import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import RequireAuth from './components/RequireAuth';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
          <Route path="/add" element={<RequireAuth><AddTransaction /></RequireAuth>} />
          <Route path="/categories" element={<RequireAuth><Categories /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path="/goals" element={<RequireAuth><Goals /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
