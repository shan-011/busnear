import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white flex flex-col items-center justify-center p-6 space-y-10 animate-fadeInUp">
      <div className="relative">
        <div className="text-[180px] md:text-[240px] font-black text-white/5 tracking-tighter leading-none select-none">404</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="text-8xl filter drop-shadow-3xl mb-4 animate-bounce">🚌</span>
          <p className="text-xl font-black text-white tracking-tighter uppercase whitespace-nowrap">Route Lost In Transit</p>
        </div>
      </div>
      
      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-4xl font-black tracking-tighter uppercase text-brand">Wrong Turn!</h2>
        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed">
          Looks like this bus took a wrong turn or this route hasn't been established yet.
        </p>
      </div>

      <Link 
        to="/" 
        className="px-12 py-5 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}
