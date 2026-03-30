import { useState, useEffect } from 'react'
import { fetchAllRoutes } from '../services/api'
import { setcRoutes } from '../data/setcRoutes'
import RouteCard from './RouteCard'

export default function RoutePanel({ onRouteSelect, selectedRoute }) {
  const [allRoutes, setAllRoutes] = useState([])
  const [displayed, setDisplayed] = useState([])
  const [query, setQuery]         = useState('')
  const [type, setType]           = useState('All')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetchAllRoutes().then(data => {
      if (data && data.routes && data.routes.length > 0) {
        setAllRoutes(data.routes)
        setDisplayed(data.routes)
      } else {
        setAllRoutes(setcRoutes)
        setDisplayed(setcRoutes)
      }
      setLoading(false)
    }).catch(() => {
      setAllRoutes(setcRoutes)
      setDisplayed(setcRoutes)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let filtered = [...allRoutes]
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(r =>
        r.from?.toLowerCase().includes(q) ||
        r.to?.toLowerCase().includes(q) ||
        r.route_no?.toLowerCase().includes(q) ||
        r.depot?.toLowerCase().includes(q)
      )
    }
    if (type !== 'All') {
      filtered = filtered.filter(r => r.type?.trim() === type)
    }
    setDisplayed(filtered.slice(0, 100)) // Limit for sidebar performance
  }, [query, type, allRoutes])

  return (
    <div className="w-[340px] h-full flex flex-col bg-[#1a1a2e] border-r border-white/5 shadow-2xl relative z-10">
      <div className="p-6 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-white font-black uppercase text-xs tracking-widest">SETC Services</h2>
            <span className="text-brand font-black text-[10px] bg-brand/10 px-2 py-0.5 rounded border border-brand/20 animate-pulse">LIVE</span>
        </div>
        
        <div className="relative">
            <input
              placeholder="Filter by city, route..."
              value={query} 
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand/40 transition-all placeholder-gray-600"
            />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All','ULTRA','A/C','AC UD'].map(t => (
            <button 
              key={t} 
              onClick={() => setType(t)} 
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                type === t 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 opacity-40">
             <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white">Searching Routes...</p>
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-20 font-bold uppercase tracking-widest">No matching routes</p>
        ) : (
          displayed.map((route, i) => (
            <RouteCard
              key={`${route.route_no}-${i}`}
              route={route}
              isSelected={selectedRoute === route.route_no}
              onClick={() => onRouteSelect(route)}
            />
          ))
        )}
      </div>

      <div className="p-4 bg-[#0f0f1a]/60 border-t border-white/5 text-center">
         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Showing {displayed.length} of {allRoutes.length} Results</p>
      </div>
    </div>
  )
}
