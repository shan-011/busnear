import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { setcRoutes } from '../data/setcRoutes';
import SearchBar from '../components/SearchBar';
import RouteCard from '../components/RouteCard';
import WhatsAppChat from '../components/WhatsAppChat';

export default function Home() {
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();

  const handleSearch = (q) => {
    setSearchQuery(q);
    navigate(`/schedule?q=${q}`);
  };

  const popularRoutes = useMemo(() => {
    return [...setcRoutes]
      .sort((a, b) => b.no_of_service - a.no_of_service)
      .slice(0, 10);
  }, []);

  const stats = [
    { label: '549 Routes', icon: '📍' },
    { label: '24 Depots', icon: '🚌' },
    { label: '24/7 Service', icon: '⏱' },
    { label: 'SOS Safety', icon: '🛡' }
  ];

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Overlay Image */}
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957" 
            alt="SETC Bus" 
            className="w-full h-full object-cover rounded-bl-[100px] shadow-2xl transition-transform duration-[10s] hover:scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0f0f1a]"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl animate-fadeInUp">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 transform hover:scale-105 transition-transform cursor-pointer">
              <span className="text-xl">🚌</span>
              <span className="text-xs font-black uppercase tracking-widest text-brand">SETC Real-Time Tracking · Tamil Nadu</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
              Track Your <br/>
              <span className="text-brand">SETC Bus</span> Now
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-lg">
              Live GPS tracking and schedules for all 549 SETC routes across Tamil Nadu. Stay safe with one-tap SOS and WhatsApp alerts.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-full sm:w-[400px]">
                <SearchBar 
                  placeholder="Search city, route or depot..."
                  onSearch={(v) => console.log(v)}
                  className="shadow-2xl shadow-brand/10 transform hover:scale-[1.02] transition-transform"
                />
              </div>
              <button 
                onClick={() => navigate('/schedule')}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-sm hover:brightness-110 hover:translate-y-[-2px] transition-all shadow-xl shadow-brand/20 active:scale-95 whitespace-nowrap"
              >
                View Schedules
              </button>
            </div>

            <div className="mt-12 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-4">
              <span>Popular:</span>
              <span className="text-white hover:text-brand cursor-pointer transition-colors" onClick={() => handleSearch('Chennai')}>Chennai</span>
              <span className="w-1 h-1 bg-white/10 rounded-full"></span>
              <span className="text-white hover:text-brand cursor-pointer transition-colors" onClick={() => handleSearch('Madurai')}>Madurai</span>
              <span className="w-1 h-1 bg-white/10 rounded-full"></span>
              <span className="text-white hover:text-brand cursor-pointer transition-colors" onClick={() => handleSearch('Coimbatore')}>Coimbatore</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-white/5 border-y border-white/5 relative z-20">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
             <div key={i} className="flex items-center space-x-4 animate-fadeInUp" style={{ animationDelay: `${i*100}ms` }}>
                <span className="text-3xl filter drop-shadow-xl">{stat.icon}</span>
                <span className="text-sm font-black uppercase tracking-widest text-white/80">{stat.label}</span>
             </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">Everything You Need</h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs underline decoration-brand/50 underline-offset-8">Modernized SETC Commute Experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              title: "Live GPS Tracking", 
              img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", 
              desc: "Watch SETC buses move in real time on an interactive map. Drivers broadcast their location via mobile GPS." 
            },
            { 
              title: "Full Schedule Access", 
              img: "https://images.unsplash.com/photo-1611746872915-64382b5c76da", 
              desc: "Access all routes with detailed departure timings, depots, and real-time service counts updated daily." 
            },
            { 
              title: "One-Tap SOS Safety", 
              img: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8", 
              desc: "One tap SOS sends your precise GPS location to the authorities and emergency contacts via SMS." 
            }
          ].map((f, i) => (
            <div key={i} className="glass p-4 group hover:scale-[1.02] transition-all animate-fadeInUp shadow-2xl border-white/5" style={{ animationDelay: `${i*200}ms` }}>
               <div className="relative h-56 rounded-xl overflow-hidden mb-8 shadow-2xl">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[4s]" />
                  <div className="absolute inset-0 bg-[#0f0f1a]/20 group-hover:bg-transparent transition-colors"></div>
               </div>
               <h3 className="text-2xl font-black text-white mb-4 px-2 tracking-tight">{f.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed px-2 mb-4">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-white/2 overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 mb-16 flex items-end justify-between animate-fadeInUp">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">Popular Service Routes</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Calculated by daily service frequency</p>
          </div>
          <Link to="/schedule" className="text-brand font-black uppercase text-[10px] tracking-widest border-b-2 border-brand pb-1 hover:text-white hover:border-white transition-all">View All 549</Link>
        </div>

        <div className="flex space-x-8 px-6 overflow-x-auto pb-16 popular-routes-scroll cursor-grab snap-x">
          {popularRoutes.map((route, i) => (
            <div 
              key={route.route_no} 
              className="flex-shrink-0 w-80 snap-center animate-fadeInUp" 
              style={{ animationDelay: `${i*100}ms` }}
              onClick={() => navigate(`/map?route=${route.route_no}`)}
            >
              <RouteCard route={route} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a14] py-20 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-[#0f3460] rounded-xl flex items-center justify-center shadow-xl">
              <span className="text-2xl">🚌</span>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">BusNear</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 mb-12">
             {['Live Map', 'Schedule', 'Driver Mode', 'Login', 'Register'].map(l => (
                <Link key={l} to={l === 'Live Map' ? '/map' : l === 'Schedule' ? '/schedule' : l === 'Driver Mode' ? '/driver' : l === 'Login' ? '/login' : '/register'} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors">
                  {l}
                </Link>
             ))}
          </div>
          
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-600 mb-2">
             © 2026 BusNear · Advanced SETC Commute System
          </p>
          <p className="text-gray-700 text-[10px] font-bold">Built for Tamil Nadu Commuters with ❤️</p>
        </div>
      </footer>

      <WhatsAppChat />
    </div>
  );
}
