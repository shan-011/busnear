import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [userType, setUserType] = useState('passenger')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Email and password required'); return }
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const res = await axios.post(`${BASE}/api/auth/login`, {
        uid: cred.user.uid, userType
      })
      setUser(res.data.profile)
      navigate(userType === 'driver' ? '/driver' : '/map')
    } catch (err) {
      const msg = err.code?.includes('auth/') 
        ? `Auth Error: ${err.message}. (Check if Email/Pass Auth is enabled in Firebase Console)` 
        : (err.message);
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff',
    padding: '12px 14px', width: '100%',
    outline: 'none', fontSize: '14px'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f1a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '36px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(233,69,96,0.15)',
            border: '1px solid rgba(233,69,96,0.3)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            fontSize: '24px'
          }}>🚌</div>
          <h1 style={{
            color: '#fff', fontSize: '22px',
            fontWeight: '700', marginBottom: '6px'
          }}>Welcome Back</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Sign in to BusNear
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['passenger','driver'].map(t => (
            <button key={t} onClick={() => setUserType(t)} style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: userType === t
                ? '1px solid #e94560' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontWeight: '600', fontSize: '13px',
              background: userType === t
                ? 'rgba(233,69,96,0.15)' : 'rgba(255,255,255,0.04)',
              color: userType === t ? '#e94560' : '#a0aec0'
            }}>
              {t === 'driver' ? '🚌 Driver' : '👤 Passenger'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input style={inp} placeholder="Email" type="email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input style={inp} placeholder="Password" type="password"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        {error && (
          <div style={{
            marginTop: '12px', padding: '10px 14px',
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: '8px', color: '#e94560', fontSize: '13px'
          }}>⚠️ {error}</div>
        )}

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '13px', marginTop: '20px',
          borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: loading ? '#374151' : '#e94560',
          color: '#fff', fontWeight: '700', fontSize: '15px'
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: '#718096', fontSize: '13px'
        }}>
          No account?{' '}
          <Link to="/register" style={{
            color: '#e94560', fontWeight: '600', textDecoration: 'none'
          }}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}
