import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { useBusSimulation, CITY_COORDS } from '../hooks/useBusSimulation';
import BusInfoDrawer from './BusInfoDrawer';
import LiveBusMarker from './LiveBusMarker';

const TN_CENTER = [10.7, 78.8];

// Function to safely get coords for a city
const getSafeCoord = (cityName) => {
  const norm = cityName.toUpperCase().split('(')[0].trim();
  for (const key in CITY_COORDS) {
    if (norm.includes(key) || key.includes(norm)) return CITY_COORDS[key];
  }
  return TN_CENTER;
};

// Component to handle map view updates
function MapUpdater({ selectedRoute }) {
  const map = useMap();
  useEffect(() => {
    if (selectedRoute) {
      const fromCoord = getSafeCoord(selectedRoute.from);
      const toCoord = getSafeCoord(selectedRoute.to);
      const bounds = L.latLngBounds([fromCoord, toCoord]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
    }
  }, [selectedRoute, map]);
  return null;
}

export default function MapView({ firebaseBusLocation, firebaseIsLive, firebaseLastUpdated }) {
  const { liveBuses, selectedRoute } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeBus, setActiveBus] = useState(null);
  const { position: simPosition } = useBusSimulation(selectedRoute);

  const routePolyline = selectedRoute ? [
    getSafeCoord(selectedRoute.from),
    getSafeCoord(selectedRoute.to)
  ] : [];

  const createBusIcon = (busData, isLive = false) => L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <div class="bg-[#0f0f1a]/95 backdrop-blur-md border border-brand/40 px-2 py-1 rounded shadow-2xl mb-1 whitespace-nowrap pointer-events-none">
          <p class="text-[9px] font-black text-brand leading-none mb-0.5 tracking-tighter uppercase">#${busData.routeId || busData.routeNo || 'SETC'}</p>
          <p class="text-[8px] font-bold text-white/90 leading-none truncate max-w-[70px]">${busData.driverName || 'Driver'}</p>
        </div>
        <div class="bus-marker-container">
          <div class="bus-marker ${isLive ? 'bus-marker-bounce' : ''}">🚌</div>
          <div class="marker-shadow"></div>
        </div>
      </div>`,
    className: 'custom-bus-marker',
    iconSize: [80, 80],
    iconAnchor: [40, 80]
  });

  return (
    <div className="relative w-full h-full dark-map overflow-hidden">
      <MapContainer
        center={TN_CENTER}
        zoom={7}
        zoomControl={false}
        className="w-full h-full bg-[#0a0a14]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Selected Route Polyline */}
        {selectedRoute && (
          <Polyline
            positions={routePolyline}
            color="#e94560"
            weight={3}
            dashArray="10, 10"
            lineCap="round"
          />
        )}

        {/* Live Buses from context */}
        {liveBuses.map(bus => (
          <Marker
            key={bus.routeId}
            position={[bus.lat, bus.lng]}
            icon={createBusIcon(bus, true)}
            eventHandlers={{
              click: () => {
                setActiveBus(bus);
                setDrawerOpen(true);
              }
            }}
          >
            <Popup className="bus-popup">
              <div className="text-xs font-bold text-brand">#{bus.routeId}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">{bus.status || 'On Time'}</div>
            </Popup>
          </Marker>
        ))}

        {/* Selected Route Bus (Animated Simulation) */}
        {selectedRoute && simPosition && (
          <Marker
            position={simPosition}
            icon={createBusIcon({ routeId: selectedRoute.route_no }, false)}
            opacity={0.8}
            eventHandlers={{
              click: () => {
                setActiveBus({ route: selectedRoute });
                setDrawerOpen(true);
              }
            }}
          />
        )}

        {/* Firebase Live GPS Bus Marker */}
        <LiveBusMarker
          busLocation={firebaseBusLocation}
          isLive={firebaseIsLive}
          lastUpdated={firebaseLastUpdated}
        />

        <MapUpdater selectedRoute={selectedRoute} />
      </MapContainer>

      {/* Bus Status Indicator Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0f0f1a]/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-6 min-w-[300px] pointer-events-none">
        <div className="flex items-center space-x-3">
          <div className={firebaseIsLive ? 'live-dot' : ''}
            style={!firebaseIsLive ? { width: 8, height: 8, borderRadius: '50%', background: '#666' } : {}}>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${firebaseIsLive ? 'text-[#10b981]' : 'text-gray-500'}`}>
            {firebaseIsLive ? 'GPS Live' : 'No GPS Signal'}
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <div className="truncate flex-1">
          <span className="text-[10px] font-bold text-gray-400 block uppercase mb-0.5">Current Context</span>
          <span className="text-xs font-black text-white truncate block">
            {selectedRoute ? `Route ${selectedRoute.route_no} Active` : 'Tamil Nadu (Central View)'}
          </span>
        </div>
      </div>

      <BusInfoDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        route={activeBus?.route || selectedRoute}
      />
    </div>
  );
}
