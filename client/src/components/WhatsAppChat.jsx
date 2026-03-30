import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function WhatsAppChat() {
  const { user } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Twilio Sandbox Details
  const chatbotNumber = "+14155238886"; 
  const sandboxJoinCode = "join roof-hang";
  
  const message = user 
    ? `Hi BusNear! I am ${user.name} (${user.phone}). I need help tracking a bus on route ${user.routeNo || 'SHN'}.`
    : "Hi BusNear! I need help with bus tracking.";

  return (
    <div className="fixed bottom-8 right-8 z-[2000] flex flex-col items-end gap-3">
      {/* Sandbox Connection Tip */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-green-500/30 max-w-[240px] animate-fadeInUp mb-2">
          <p className="text-[10px] font-black uppercase text-green-600 mb-2 tracking-widest flex items-center gap-1">
            <span>🛡️ Sandbox Connection</span>
          </p>
          <p className="text-[11px] text-[#0f0f1a] font-bold leading-relaxed mb-3">
            First-time user? Send <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500">{sandboxJoinCode}</code> to connect our AI.
          </p>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="group flex items-center gap-4">
        {/* Helper Label */}
        <div className="bg-white text-[#0f0f1a] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap">
           Chat with BusNear 🤖
        </div>

        <a 
          href={`https://wa.me/${chatbotNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative"
        >
          {/* Pulsing Ring */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
          
          {/* Button */}
          <div className="relative bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all text-3xl">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.097 3.389l-.715 2.615 2.735-.718c.846.505 1.815.795 2.857.795 3.182 0 5.767-2.586 5.767-5.767 0-3.181-2.585-5.767-5.767-5.767zm3.391 8.243c-.148.419-.757.764-1.045.811-.277.045-.63.078-1.026-.048-.22-.07-1.134-.411-2.022-1.201-.715-.635-1.196-1.422-1.336-1.662-.14-.24-.015-.37.11-.495.112-.114.24-.285.359-.427.12-.142.159-.24.239-.4.079-.16.039-.3-.02-.427-.059-.126-.532-1.282-.729-1.758-.192-.463-.384-.399-.532-.407-.134-.007-.289-.009-.444-.009-.155 0-.407.058-.621.285-.214.228-.816.798-.816 1.946s.835 2.257.952 2.414c.117.157 1.644 2.508 3.983 3.518.556.24 1.055.398 1.413.511.558.178 1.066.153 1.468.093.447-.067 1.378-.563 1.573-1.107.195-.544.195-1.011.136-1.107-.058-.097-.214-.155-.448-.272z" />
             </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
