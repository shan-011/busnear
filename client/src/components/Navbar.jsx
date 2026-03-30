import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'

export default function Navbar() {
  const { connected, liveBuses, user } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'Live Tracking' },
    { to: '/schedule', label: 'Schedule' },
  ]

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const handleLogout = () => {
    signOut(auth)
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-20 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 md:px-12 transition-all">

      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 mr-auto group transform hover:scale-105 transition-all">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-brand/20">
          <span className="text-xl">🚌</span>
        </div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-brand transition-colors">
          Bus<span className="text-brand">Near</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center space-x-1 mx-auto bg-white/5 p-1 rounded-2xl border border-white/10">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive(link.to)
              ? 'bg-brand text-white shadow-xl shadow-brand/20'
              : 'text-gray-500 hover:text-white'
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side controls */}
      <div className="hidden md:flex items-center space-x-6 ml-auto">
        <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success shadow-[0_0_8px_#4ade80]' : 'bg-gray-600'} animate-pulse`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {connected ? 'Real-Time Sync' : 'Offline Mode'}
          </span>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            {user.userType === 'driver' && (
              <Link to="/driver" className="text-xs font-black uppercase tracking-widest text-brand">Dashboard</Link>
            )}
            <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-brand">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="bg-white text-[#0f0f1a] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-90 active:scale-95 transition-all shadow-xl">
              Login
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-2xl ml-4 focus:outline-none"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#0f0f1a] border-b border-white/10 p-6 flex flex-col space-y-4 md:hidden animate-fadeInUp">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`text-sm font-black uppercase tracking-widest p-4 rounded-xl ${isActive(link.to) ? 'bg-brand text-white' : 'text-gray-500'}`}>
              {link.label}
            </Link>
          ))}
          <Link to="/driver" onClick={() => setMenuOpen(false)} className="text-sm font-black uppercase tracking-widest p-4 rounded-xl text-gray-400">Driver Mode</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-brand text-white text-sm font-black uppercase tracking-widest p-4 rounded-xl text-center">Login</Link>
        </div>
      )}
    </nav>
  )
}
