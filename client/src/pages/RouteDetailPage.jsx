import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRouteByNumber } from '../data/setcRoutes';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_COORDS } from '../hooks/useBusSimulation';
import { requestScheduleSMS } from '../services/api';
import { useApp } from '../context/AppContext';

const TN_CENTER = [10.7, 78.8];

const getSafeCoord = (cityName) => {
  const norm = cityName.toUpperCase().split('(')[0].trim();
  for (const key in CITY_COORDS) {
    if (norm.includes(key) || key.includes(norm)) return CITY_COORDS[key];
  }
  return TN_CENTER;
};

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [roadPath, setRoadPath] = useState([]);
  const route = useMemo(() => getRouteByNumber(id), [id]);

  useEffect(() => {
    if (route) {
      const fromC = getSafeCoord(route.from);
      const toC = getSafeCoord(route.to);
      fetch(`https://router.project-osrm.org/route/v1/driving/${fromC[1]},${fromC[0]};${toC[1]},${toC[0]}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoadPath(coords);
        })
        .catch(() => setRoadPath([fromC, toC]));
    }
  }, [route]);

  const handleScheduleAlert = async () => {
    if (!user || !user.phone) {
      alert("Please login with a phone number to receive alerts.");
      return;
    }
    try {
      await requestScheduleSMS(user.phone, route.route_no);
      alert(`✅ SMS Alert sent! You will receive the schedule for ${route.route_no} shortly.`);
    } catch (err) {
      alert("Failed to send alert. Try again later.");
    }
  };

  if (!route) {
    return (
      <div className="bg-[#0f0f1a] min-h-screen text-white flex flex-col items-center justify-center space-y-6">
        <span className="text-6xl">🚦</span>
        <h1 className="text-4xl font-black tracking-tighter">Route #{id} Not Found</h1>
        <Link to="/schedule" className="bg-brand px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20">Go Back to Schedules</Link>
      </div>
    );
  }

  const groupTimings = (timings) => {
    const groups = {
      Morning: { label: 'Morning (05:00 - 11:59)', icon: '☀️', times: [] },
      Afternoon: { label: 'Afternoon (12:00 - 16:59)', icon: '🌤', times: [] },
      Evening: { label: 'Evening (17:00 - 20:59)', icon: '🌇', times: [] },
      Night: { label: 'Night (21:00 - 04:59)', icon: '🌙', times: [] }
    };

    timings.forEach(t => {
      const hour = parseInt(t.split('.')[0]);
      if (hour >= 5 && hour < 12) groups.Morning.times.push(t);
      else if (hour >= 12 && hour < 17) groups.Afternoon.times.push(t);
      else if (hour >= 17 && hour < 21) groups.Evening.times.push(t);
      else groups.Night.times.push(t);
    });
    return groups;
  };

  const timingGroups = groupTimings(route.timings_array);
  const fromCoord = getSafeCoord(route.from);
  const toCoord = getSafeCoord(route.to);

  const busIcon = L.divIcon({
    html: `<div class="bus-marker-container"><div class="bus-marker bus-marker-bounce">🚌</div></div>`,
    className: 'custom-bus-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  return (
    <div className="bg-[#0f0f1a] min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-7xl animate-fadeInUp">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand transition-colors group"
        >
          <span className="text-xl group-hover:translate-x-[-4px] transition-transform">←</span>
          <span>Return</span>
        </button>

        {/* Detailed Header Section */}
        <header className="mb-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg text-white shadow-xl animate-pulse"
                    style={{ backgroundColor: route.color }}
                  >
                    {route.type}
                  </div>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-tight">
                  Route #{route.route_no}
                </h1>
              </div>
              <div className="hidden lg:block w-96 h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800"
                  alt="SETC Bus"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center space-x-4">
              <span>SETC {route.depot} Operated Service</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
              <span>{route.no_of_service} Buses Daily</span>
            </div>
          </div>

          <div className="glass p-6 min-w-[280px] shadow-3xl transform border-white/5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">First Departure</span>
              <span className="text-lg font-black text-success tracking-tighter">{route.first_bus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Departure</span>
              <span className="text-lg font-black text-white tracking-tighter">{route.last_bus}</span>
            </div>
          </div>
        </header>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
    {/* Departure Timeline Groups */}
    <div className="space-y-8">
      <h3 className="text-xl font-black uppercase tracking-widest text-white border-b-2 border-brand/40 pb-3 flex items-center space-x-4">
        <span>Departure Schedule</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </h3>

      {Object.values(timingGroups).map((g, i) => g.times.length > 0 && (
        <div key={i} className="animate-fadeInUp relative" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="text-[10px] uppercase font-black text-gray-500 mb-4 flex items-center space-x-3">
            <span className="text-lg">{g.icon}</span>
            <span className="tracking-[0.1em]">{g.label}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {g.times.map(t => (
              <span key={t} className="text-sm font-black text-white bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:border-brand/50 hover:bg-white/10 transition-all cursor-pointer shadow-xl">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Route Visualization Card */}
    <div className="space-y-8 flex flex-col">
      <h3 className="text-xl font-black uppercase tracking-widest text-white border-b-2 border-brand/40 pb-3 flex items-center space-x-4">
        <span>Route Path</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </h3>

      <div className="flex-1 glass border border-white/10 rounded-3xl overflow-hidden relative shadow-3xl h-[400px]">
        <MapContainer center={TN_CENTER} zoom={7} zoomControl={false} className="w-full h-full bg-[#0a0a14] dark-map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={roadPath} color="#e94560" weight={6} opacity={0.8} />
          <Marker position={fromCoord} icon={L.divIcon({ html: '🚩', className: 'text-2xl' })} />
          <Marker position={toCoord} icon={L.divIcon({ html: '🏁', className: 'text-2xl' })} />
        </MapContainer>

        <div className="absolute top-0 inset-x-0 p-8 flex flex-col space-y-6 z-[10] pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="bg-[#0f0f1a]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
              <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">From</span>
              <span className="text-lg font-black text-white uppercase">{route.from}</span>
            </div>
            <div className="bg-[#0f0f1a]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl text-right">
              <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">To</span>
              <span className="text-lg font-black text-white uppercase">{route.to}</span>
            </div>
          </div>

          <div className="self-center bg-brand text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand/40">
            {route.route_length} Kilometers
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleScheduleAlert}
          className="bg-brand text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Set SMS/WA Alert
        </button>
        <button
          onClick={() => navigate(`/map?route=${route.route_no}`)}
          className="bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 active:scale-[0.98] transition-all border-l-4 border-l-green-500"
        >
          Track Live on Map
        </button>
      </div>
    </div>
  </div>
      </div >
    </div >
  );
}
