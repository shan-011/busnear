import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function SOSModal() {
  const { setSosActive } = useApp();
  const [coords, setCoords] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, []);

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setSosActive(false), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0a0a14]/90 backdrop-blur-sm"
        onClick={() => !isSending && !isSent && setSosActive(false)}
      ></div>
      
      <div className="relative w-full max-w-sm glass p-8 text-center animate-fadeInUp shadow-3xl border-brand/20">
        {!isSent ? (
          <>
            <div className="w-20 h-20 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6 sos-pulse">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Emergency Alert?</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your location and details will be sent to the driver and your emergency contacts immediately.
            </p>
            
            {coords && (
              <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 mb-8">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Current Location</div>
                <div className="text-xs font-mono text-brand font-bold tracking-tight">
                   {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="w-full bg-brand text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-brand/20"
              >
                {isSending ? 'Sending Alert...' : 'SEND SOS NOW'}
              </button>
              <button 
                onClick={() => setSosActive(false)}
                disabled={isSending}
                className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 animate-fadeInUp">
            <div className="w-20 h-20 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Alert Sent Successfully</h2>
            <p className="text-success font-bold text-sm">Help is on the way.</p>
          </div>
        )}
      </div>
    </div>
  );
}
