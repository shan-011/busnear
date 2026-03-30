import { useEffect } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

const busIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#e94560; border:3px solid white;
    border-radius:50%; width:36px; height:36px;
    display:flex; align-items:center;
    justify-content:center; font-size:18px;
    box-shadow:0 0 12px rgba(233,69,96,0.8);">🚌</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

export default function LiveBusMarker({ busLocation, isLive, lastUpdated }) {
  const map = useMap()
  useEffect(() => {
    if (busLocation) map.setView([busLocation.lat, busLocation.lng], 15)
  }, [busLocation])

  if (!busLocation || !isLive) return null

  return (
    <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
      <Popup>
        <div style={{ color:'#000', minWidth:'160px' }}>
          <strong>🚌 Live Bus</strong><br/>
          Lat: {busLocation.lat.toFixed(5)}<br/>
          Lng: {busLocation.lng.toFixed(5)}<br/>
          {lastUpdated && (
            <span style={{ fontSize:'11px', color:'#666' }}>
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
