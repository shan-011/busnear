import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export default function Register() {
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [userType, setUserType] = useState('passenger')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', routeNo: '', depot: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleRegister = async () => {
    setError('')
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(
        auth, form.email, form.password
      )
      const res = await axios.post(`${BASE}/api/auth/register`, {
        uid: cred.user.uid, name: form.name,
        email: form.email, phone: form.phone,
        userType, routeNo: form.routeNo, depot: form.depot
      })
      setUser(res.data.profile)
      navigate(userType === 'driver' ? '/driver' : '/map')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
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
        width: '100%', maxWidth: '440px',
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
          }}>Create Account</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Join BusNear today — it's free
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['passenger','driver'].map(t => (
            <button key={t} onClick={() => setUserType(t)} style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: userType === t
                ? '1px solid #e94560'
                : '1px solid rgba(255,255,255,0.1)',
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
          <input style={inp} placeholder="Full Name"
            value={form.name} onChange={e => update('name', e.target.value)} />
          <input style={inp} placeholder="Email" type="email"
            value={form.email} onChange={e => update('email', e.target.value)} />
          <input style={inp} placeholder="Password (min 6 characters)" type="password"
            value={form.password} onChange={e => update('password', e.target.value)} />
          <input style={inp} placeholder="Phone number (+91XXXXXXXXXX)"
            value={form.phone} onChange={e => update('phone', e.target.value)} />
          {userType === 'driver' && (
            <>
              <input style={inp} placeholder="Assigned Route No. (e.g. 831UD)"
                value={form.routeNo} onChange={e => update('routeNo', e.target.value)} />
              <input style={inp} placeholder="Depot Code (e.g. CC, MDU, CBE)"
                value={form.depot} onChange={e => update('depot', e.target.value)} />
            </>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '12px', padding: '10px 14px',
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: '8px', color: '#e94560', fontSize: '13px'
          }}>⚠️ {error}</div>
        )}

        <button onClick={handleRegister} disabled={loading} style={{
          width: '100%', padding: '13px', marginTop: '20px',
          borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: loading ? '#374151' : '#e94560',
          color: '#fff', fontWeight: '700', fontSize: '15px'
        }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: '#718096', fontSize: '13px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#e94560', fontWeight: '600', textDecoration: 'none'
          }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
