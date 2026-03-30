import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function HomePage() {
  const { connected, liveBuses } = useApp()

  const features = [
    {
      icon: '🗺️',
      title: 'Live Bus Tracking',
      desc: 'See real-time GPS location of SETC buses on an interactive map.'
    },
    {
      icon: '📅',
      title: 'Schedule & Timings',
      desc: 'Browse all 549 SETC routes with departure timings, depots, and stops.'
    },
    {
      icon: '📱',
      title: 'SMS Alerts',
      desc: 'Get bus schedules and SOS notifications sent directly to your phone.'
    },
    {
      icon: '🚨',
      title: 'SOS Emergency',
      desc: 'One-tap SOS alert sends your location to officials and your contacts.'
    },
  ]

  const stats = [
    { value: '549', label: 'SETC Routes' },
    { value: '24/7', label: 'Live Tracking' },
    { value: 'SMS', label: 'Instant Alerts' },
    { value: 'Free', label: 'Always Free' },
  ]

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 40px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(233,69,96,0.15) 0%, transparent 60%)'
      }}>

        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '20px', marginBottom: '24px',
          background: connected
            ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
          border: connected
            ? '1px solid rgba(74,222,128,0.3)'
            : '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: connected ? '#4ade80' : '#6b7280',
            boxShadow: connected ? '0 0 8px #4ade80' : 'none',
            display: 'inline-block'
          }} />
          <span style={{
            fontSize: '12px', fontWeight: '600',
            color: connected ? '#4ade80' : '#9ca3af'
          }}>
            {connected
              ? `${liveBuses?.length || 0} buses broadcasting live`
              : 'Backend connected'}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 8vw, 72px)',
          fontWeight: '800', lineHeight: '1.1',
          color: '#fff', marginBottom: '20px',
          letterSpacing: '-2px'
        }}>
          Track SETC Buses
          <br />
          <span style={{ color: '#e94560' }}>In Real Time</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#a0aec0', maxWidth: '520px',
          lineHeight: '1.7', marginBottom: '36px'
        }}>
          Live GPS tracking for Tamil Nadu SETC buses.
          View schedules, get SMS alerts, and stay safe with one-tap SOS.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/map" style={{
            padding: '14px 28px', borderRadius: '10px',
            background: '#e94560', color: '#fff',
            textDecoration: 'none', fontWeight: '700',
            fontSize: '15px', border: '2px solid #e94560'
          }}>
            🗺️ View Live Map
          </Link>
          <Link to="/schedule" style={{
            padding: '14px 28px', borderRadius: '10px',
            background: 'transparent', color: '#fff',
            textDecoration: 'none', fontWeight: '700',
            fontSize: '15px',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            📅 Browse Routes
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '32px', flexWrap: 'wrap',
          justifyContent: 'center', marginTop: '60px'
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '28px', fontWeight: '800',
                color: '#e94560', lineHeight: '1'
              }}>{s.value}</p>
              <p style={{
                fontSize: '12px', color: '#6b7280',
                marginTop: '4px', fontWeight: '500'
              }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontSize: '32px',
          fontWeight: '700', color: '#fff', marginBottom: '48px'
        }}>
          Everything you need
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '28px 24px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s'
            }}>
              <span style={{ fontSize: '32px' }}>{f.icon}</span>
              <h3 style={{
                color: '#fff', fontWeight: '700',
                fontSize: '16px', margin: '12px 0 8px'
              }}>{f.title}</h3>
              <p style={{
                color: '#718096', fontSize: '14px', lineHeight: '1.6'
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bottom */}
      <div style={{
        textAlign: 'center', padding: '60px 24px 80px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <h2 style={{
          color: '#fff', fontSize: '28px',
          fontWeight: '700', marginBottom: '16px'
        }}>
          Ready to get started?
        </h2>
        <p style={{
          color: '#718096', marginBottom: '28px', fontSize: '15px'
        }}>
          Create a free account to unlock SMS alerts and SOS features.
        </p>
        <Link to="/register" style={{
          padding: '14px 32px', borderRadius: '10px',
          background: '#e94560', color: '#fff',
          textDecoration: 'none', fontWeight: '700', fontSize: '15px'
        }}>
          Create Free Account
        </Link>
      </div>
    </div>
  )
}
