import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { db } from '../services/firebase'
import { ref, set } from 'firebase/database'

const driverIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#0f3460; border:3px solid white;
    border-radius:50%; width:40px; height:40px;
    display:flex; align-items:center;
    justify-content:center; font-size:20px;
    box-shadow:0 0 12px rgba(15,52,96,0.8);">🚌</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

function DriverMapUpdater({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location && location.lat && location.lng) {
      map.setView([location.lat, location.lng], map.getZoom() || 15);
    }
  }, [location, map]);
  return null;
}

export default function DriverApp() {
  const [tracking, setTracking] = useState(false)
  const [location, setLocation] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [intervalId, setIntervalId] = useState(null)
  const [currentPos, setCurrentPos] = useState(null)
  const [error, setError] = useState(null)

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported'); return
    }
    const wId = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCurrentPos(p); setLocation(p); setError(null)
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    )
    const iId = setInterval(() => {
      setCurrentPos(pos => {
        if (pos) {
          set(ref(db, 'bus1'), {
            lat: pos.lat,
            lng: pos.lng,
            time: Date.now()
          });
        }
        return pos;
      });
    }, 2000)
    setWatchId(wId); setIntervalId(iId); setTracking(true)
  }

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId)
    if (intervalId) clearInterval(intervalId)
    setTracking(false); setCurrentPos(null)
  }

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [watchId, intervalId])

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f1a',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px', marginTop: '64px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(233,69,96,0.15)',
            border: '1px solid rgba(233,69,96,0.3)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px'
          }}>🚌</div>
          <div>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Driver Mode</p>
            <p style={{ color: '#718096', fontSize: '12px' }}>GPS Broadcaster</p>
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
          background: tracking ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
          border: tracking ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)',
          color: tracking ? '#4ade80' : '#9ca3af'
        }}>
          {tracking ? '🟢 Broadcasting' : '⏸ Stopped'}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '50vh' }}>
        <MapContainer
          center={location ? [location.lat, location.lng] : [11.0168, 76.9558]}
          zoom={15} style={{ height: '100%', width: '100%' }}
        >
          <DriverMapUpdater location={location} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {location && (
            <Marker position={[location.lat, location.lng]} icon={driverIcon}>
              <Popup>📍 You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Controls */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            color: '#e94560', fontSize: '13px'
          }}>⚠️ {error}</div>
        )}
        {location && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <p style={{ color: '#718096', fontSize: '11px', marginBottom: '4px' }}>Current Position</p>
            <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={startTracking} disabled={tracking} style={{
            padding: '14px', borderRadius: '12px', border: 'none',
            cursor: tracking ? 'not-allowed' : 'pointer',
            background: tracking ? 'rgba(255,255,255,0.05)' : '#10b981',
            color: tracking ? '#4b5563' : '#fff',
            fontWeight: '700', fontSize: '14px',
            boxShadow: tracking ? 'none' : '0 4px 14px rgba(16,185,129,0.4)'
          }}>🚀 Start Live Trip</button>
          <button onClick={stopTracking} disabled={!tracking} style={{
            padding: '14px', borderRadius: '12px', border: 'none',
            cursor: !tracking ? 'not-allowed' : 'pointer',
            background: !tracking ? 'rgba(255,255,255,0.05)' : '#e94560',
            color: !tracking ? '#4b5563' : '#fff',
            fontWeight: '700', fontSize: '14px'
          }}>⏹ End Trip</button>
        </div>
      </div>
    </div>
  )
}
