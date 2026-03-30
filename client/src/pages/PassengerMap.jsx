import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import RoutePanel from '../components/RoutePanel'
import LiveBusMarker from '../components/LiveBusMarker'
import BusInfoDrawer from '../components/BusInfoDrawer'
import { useFirebaseBus } from '../hooks/useFirebaseBus'
import { getCoord } from '../hooks/useBusSimulation'
import { sendSOS } from '../services/api'
import { useApp } from '../context/AppContext'
import { useLocation } from 'react-router-dom'
import { getRouteByNumber } from '../data/setcRoutes'

const TN_CENTER = [10.7, 78.8]

function MapUpdater({ selectedRoute }) {
  const map = useMap();
  useEffect(() => {
    if (selectedRoute) {
      const fromC = getCoord(selectedRoute.from);
      const toC = getCoord(selectedRoute.to);
      if (fromC[0] !== toC[0] || fromC[1] !== toC[1]) {
        map.fitBounds([fromC, toC], { padding: [50, 50], maxZoom: 9 });
      } else {
        map.setView(fromC, 10);
      }
    } else {
      map.setView(TN_CENTER, 7);
    }
  }, [selectedRoute, map]);
  return null;
}

export default function PassengerMap() {
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [roadPath, setRoadPath] = useState([])
  const { user } = useApp()
  const { busLocation, isLive, lastUpdated } = useFirebaseBus()
  const location = useLocation()

  // Fetch real road path from OSRM with error handling andlng/lat swap
  useEffect(() => {
    const fetchRoadPath = async () => {
      if (!selectedRoute) {
        setRoadPath([]);
        return;
      }
      const fromC = getCoord(selectedRoute.from) || TN_CENTER;
      const toC = getCoord(selectedRoute.to) || TN_CENTER;

      try {
        // OSRM expects coordinates as lng,lat
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromC[1]},${fromC[0]};${toC[1]},${toC[0]}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoadPath(coords);
        } else {
          setRoadPath([fromC, toC]);
        }
      } catch (err) {
        console.error("OSRM Path Error:", err);
        setRoadPath([fromC, toC]); // Fallback
      }
    };
    fetchRoadPath();
  }, [selectedRoute]);

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const routeNo = params.get('route')
    if (routeNo) {
      const r = getRouteByNumber(routeNo)
      if (r) setSelectedRoute(r)
    } else {
      setSelectedRoute(null)
    }
  }, [location.search])

  const handleSOS = async () => {
    if (!user) {
      alert("Please login first to send an SOS alert."); return;
    }
    try {
      await sendSOS({
        passengerName: user.name,
        phone: user.phone,
        lat: busLocation?.lat || 0,
        lng: busLocation?.lng || 0,
        routeNo: selectedRoute?.route_no || 'Unknown'
      });
      alert(`🚨 SOS ALERT SENT!\nAuthorities and the driver for ${selectedRoute?.route_no || 'this route'} have been notified with your location.`);
    } catch (err) {
      alert("Failed to send SOS. Please check your connection.");
    }
  }

  const fromCoord = selectedRoute ? getCoord(selectedRoute.from) : null;
  const toCoord = selectedRoute ? getCoord(selectedRoute.to) : null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#0f0f1a', paddingTop: '80px'
    }}>
      {/* Live status bar */}
      <div style={{ background: '#1a1a2e' }}
        className="flex items-center gap-3 px-4 py-2 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-500'
            }`}
            style={isLive ? {
              boxShadow: '0 0 6px #4ade80',
              animation: 'pulse 1.5s infinite'
            } : {}} />
          <span className="text-sm font-medium text-white">
            {isLive ? '🟢 Bus is Live' : '⚫ Bus Offline'}
          </span>
        </div>
        {isLive && lastUpdated && (
          <span className="text-xs text-gray-400">
            Last update: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Map + Panel */}
      <div className="flex flex-1 overflow-hidden h-full">
        <RoutePanel
          onRouteSelect={(route) => setSelectedRoute(route)}
          selectedRoute={selectedRoute?.route_no}
        />
        <div className="flex-1 relative h-full">
          <MapContainer
            center={TN_CENTER}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            {/* Auto zoom/pan updater */}
            <MapUpdater selectedRoute={selectedRoute} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Firebase live GPS bus */}
            <LiveBusMarker
              busLocation={busLocation}
              isLive={isLive}
              lastUpdated={lastUpdated}
            />

            {/* Selected route path and markers */}
            {selectedRoute && fromCoord && toCoord && roadPath.length > 0 && (
              <>
                <Polyline positions={roadPath} color="#e94560" weight={6} opacity={0.8} />
                <Marker position={fromCoord} icon={L.divIcon({ html: '<span class="animate-bounce">🚩</span>', className: 'text-2xl' })}>
                  <Popup>
                    <div style={{ color: '#000' }}>
                      <strong>From: {selectedRoute.from}</strong><br />
                      Route #{selectedRoute.route_no}
                    </div>
                  </Popup>
                </Marker>
                <Marker position={toCoord} icon={L.divIcon({ html: '<span class="animate-pulse">🏁</span>', className: 'text-2xl' })}>
                  <Popup>
                    <div style={{ color: '#000' }}>
                      <strong>To: {selectedRoute.to}</strong><br />
                      Route #{selectedRoute.route_no}
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>

          {/* SOS Floating Button (Static similar to WhatsApp) */}
          <button
            className="fixed bottom-32 right-10 z-[2000] bg-red-600 text-white w-16 h-16 rounded-full font-black shadow-2xl flex items-center justify-center border-4 border-red-500/50 hover:scale-110 active:scale-95 transition-all animate-pulse"
            onClick={handleSOS}
            title="Emergency SOS"
          >
            SOS
          </button>
        </div>
      </div>

      <BusInfoDrawer
        isOpen={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        route={selectedRoute}
      />
    </div>
  )
}
