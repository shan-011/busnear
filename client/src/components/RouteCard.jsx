import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RouteCard({ route, isSelected, onClick }) {
  const navigate = useNavigate();

  const handleLink = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/route/${route.route_no}`);
    }
  };

  // Ensure color is at least a default if not present
  const routeColor = route.color || (route.type === 'A/C' ? '#8b5cf6' : '#3b82f6');

  return (
    <div 
      className={`glass glass-hover p-5 w-full cursor-pointer group animate-fadeInUp shadow-xl transition-all ${
        isSelected ? 'border-brand/60 bg-brand/10 ring-2 ring-brand/20 scale-[1.02]' : 'border-white/10'
      }`}
      onClick={handleLink}
    >
      {/* Badge & Route No */}
      <div className="flex items-center justify-between mb-4">
        <span 
          className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white shadow-lg shadow-black/20"
          style={{ backgroundColor: routeColor }}
        >
          {route.type}
        </span>
        <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-brand' : 'text-gray-500 group-hover:text-brand'}`}>
          #{route.route_no}
        </span>
      </div>

      {/* From → To */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold mb-1 opacity-60">Origin</div>
          <div className={`text-base font-bold truncate ${isSelected ? 'text-brand' : 'text-white'}`}>{route.from}</div>
        </div>
        <div className={`flex flex-col items-center justify-center p-2 rounded-full border transition-colors ${isSelected ? 'bg-brand/20 border-brand/40 text-brand' : 'bg-white/5 border-white/10 text-gray-400 group-hover:bg-brand/10 group-hover:text-brand'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold mb-1 opacity-60">Destination</div>
          <div className={`text-base font-bold truncate ${isSelected ? 'text-brand' : 'text-white'}`}>{route.to}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1">Distance & Depot</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white/80">{route.route_length}km</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="text-[10px] font-black text-brand tracking-tighter uppercase whitespace-nowrap overflow-hidden">{route.depot}</span>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1">Daily Services</span>
          <div className="text-xs font-bold text-white/80">{route.no_of_service} Buses/Day</div>
        </div>
      </div>

      {/* Timings */}
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-[#0f0f1a]/40 p-2 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
          <div className="text-[8px] uppercase font-black text-gray-500 mb-0.5 tracking-widest">First Bus</div>
          <div className="text-xs font-black text-success tracking-tighter">{route.first_bus}</div>
        </div>
        <div className="bg-[#0f0f1a]/40 p-2 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors text-right">
          <div className="text-[8px] uppercase font-black text-gray-500 mb-0.5 tracking-widest">Last Bus</div>
          <div className="text-xs font-black text-gray-400 tracking-tighter">{route.last_bus}</div>
        </div>
      </div>
    </div>
  );
}
