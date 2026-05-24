import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import NavbarMobile from './components/NavbarMobile'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Reports from './pages/Reports'
import Goals from './pages/Goals'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import DailyPlanner from './pages/DailyPlanner'

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="md:pl-72">
          <NavbarMobile />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/daily" element={<DailyPlanner/>} />
              <Route path="/transactions" element={<Transactions/>} />
              <Route path="/add" element={<AddTransaction/>} />
              <Route path="/reports" element={<Reports/>} />
              <Route path="/goals" element={<Goals/>} />
              <Route path="/categories" element={<Categories/>} />
              <Route path="/profile" element={<Profile/>} />
            </Routes>
          </main>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

