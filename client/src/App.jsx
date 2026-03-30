import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PassengerMap from './pages/PassengerMap'
import SchedulePage from './pages/SchedulePage'
import DriverApp from './pages/DriverApp'
import Login from './pages/Login'
import Register from './pages/Register'
import WhatsAppChat from './components/WhatsAppChat'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/map"       element={<PassengerMap />} />
            <Route path="/schedule"  element={<SchedulePage />} />
            <Route path="/driver"    element={<DriverApp />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
          </Routes>
          <WhatsAppChat />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}
