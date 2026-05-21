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
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
