import { useEffect } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

export default function LiveBusMarker({ busLocation, isLive, lastUpdated }) {
  const map = useMap()

  const createLiveIcon = (data) => L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <div class="bg-[#e94560] backdrop-blur-md border border-white/20 px-2 py-1 rounded shadow-2xl mb-1 whitespace-nowrap pointer-events-none">
          <p class="text-[9px] font-black text-white leading-none mb-0.5 tracking-tighter uppercase">#${data?.routeNo || 'LIVE'}</p>
          <p class="text-[8px] font-bold text-white/90 leading-none truncate max-w-[70px]">${data?.driverName || 'Verified Driver'}</p>
        </div>
        <div class="bus-marker-container">
          <div class="bus-marker bus-marker-bounce">🚌</div>
          <div class="marker-shadow"></div>
        </div>
      </div>`,
    className: 'custom-bus-marker',
    iconSize: [80, 80],
    iconAnchor: [40, 80]
  });

  useEffect(() => {
    if (isLive && busLocation) {
      map.panTo([busLocation.lat, busLocation.lng]);
    }
  }, [busLocation, isLive, map])

  if (!busLocation || !isLive) return null

  return (
    <Marker position={[busLocation.lat, busLocation.lng]} icon={createLiveIcon(busLocation)}>
      <Popup>
        <div style={{ color: '#000', minWidth: '160px' }}>
          <strong style={{ color: '#e94560' }}>Route #${busLocation.routeNo || 'SETC'}</strong><br />
          <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Driver: {busLocation.driverName || 'Active'}</div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            Lat: {busLocation.lat.toFixed(5)}<br />
            Lng: {busLocation.lng.toFixed(5)}
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '11px', color: '#666' }}>
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
