import React from 'react';
import { useApp } from '../context/AppContext';
import SOSModal from './SOSModal';

export default function SOSButton() {
  const { sosActive, setSosActive } = useApp();

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-center space-y-3">
        <button 
          onClick={() => setSosActive(true)}
          className="w-16 h-16 rounded-full bg-brand flex items-center justify-center sos-pulse shadow-2xl shadow-brand/40 group active:scale-90 transition-transform"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand bg-[#0f0f1a] px-3 py-1 rounded-full border border-brand/20 shadow-xl">
          SOS
        </span>
      </div>
      {sosActive && <SOSModal />}
    </>
  );
}
