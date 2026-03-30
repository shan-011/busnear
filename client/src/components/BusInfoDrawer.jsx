import React, { useState } from 'react';

export default function BusInfoDrawer({ isOpen, onClose, route }) {
  if (!route) return null;

  const [reminderSet, setReminderSet] = useState(false);

  const groupTimings = (timings) => {
    const groups = {
      Morning: [],
      Afternoon: [],
      Evening: [],
      Night: []
    };

    timings.forEach(t => {
      const hour = parseInt(t.split('.')[0]);
      if (hour >= 5 && hour < 12) groups.Morning.push(t);
      else if (hour >= 12 && hour < 17) groups.Afternoon.push(t);
      else if (hour >= 17 && hour < 21) groups.Evening.push(t);
      else groups.Night.push(t);
    });
    return groups;
  };

  const timingGroups = groupTimings(route.timings_array);

  const handleShare = () => {
    const text = `Check SETC Route ${route.route_no}: ${route.from} to ${route.to} (${route.route_length}km). First: ${route.first_bus}, Last: ${route.last_bus} - via BusNear`;
    
    if (navigator.share) {
      navigator.share({
        title: 'BusNear SETC Route',
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Route info copied to clipboard!');
    }
  };

  const handleReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
  };

  return (
    <div 
      className={`fixed top-0 bottom-0 right-0 z-[110] w-[400px] glass border-l border-white/20 transform transition-transform duration-500 shadow-3xl flex flex-col p-8 overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-8 bg-brand rounded-full"></div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase">
              #{route.route_no}
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
              {route.region} Depot · {route.depot}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        {/* Route visualization */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
             <span className="text-6xl">🚌</span>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div>
              <span className="text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2 block">Origin Station</span>
              <span className="text-xl font-bold text-white block">{route.from}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-[1px] bg-white/20 dash-line"></div>
              <span className="text-[10px] font-black italic bg-brand/20 text-brand px-2 py-0.5 rounded border border-brand/20">
                 {route.route_length} km
              </span>
              <div className="flex-1 h-[1px] bg-white/20 dash-line"></div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2 block">Destination Station</span>
              <span className="text-xl font-bold text-white block">{route.to}</span>
            </div>
          </div>
        </div>

        {/* Departure Grid */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/10 pb-2">
            Departure Schedule
          </h3>
          
          {Object.entries(timingGroups).map(([group, times]) => times.length > 0 && (
             <div key={group} className="animate-fadeInUp">
                <div className="text-[9px] uppercase font-bold text-gray-500 mb-2 flex items-center space-x-2">
                   <span>{group}</span>
                   <span className="w-1 h-3 rounded-full bg-white/20"></span>
                   <span className="text-[8px] italic">{times.length} services</span>
                </div>
                <div className="flex flex-wrap gap-2">
                   {times.map(t => (
                      <span key={t} className="text-xs font-bold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:border-brand/40 hover:text-brand transition-all">
                        {t}
                      </span>
                   ))}
                </div>
             </div>
          ))}
        </div>

        {/* Actions Context Group */}
        <div className="grid grid-cols-2 gap-4">
           <button 
            onClick={handleReminder}
            className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl border transition-all ${
              reminderSet 
                ? 'bg-success/20 border-success text-success' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
           >
              <div className="text-2xl">{reminderSet ? '🔔' : '⏰'}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                 {reminderSet ? 'Reminder Set' : 'Set Reminder'}
              </span>
           </button>
           <button 
            onClick={handleShare}
            className="flex flex-col items-center justify-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white transition-all shadow-xl"
           >
              <div className="text-2xl">🔗</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Share Route</span>
           </button>
        </div>
      </div>

      {/* Footer info badge */}
      <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }}></div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
               {route.type} Class Service
            </span>
         </div>
         <div className="text-xs font-black text-gray-500">
            #{route.route_no}
         </div>
      </div>
    </div>
  );
}
