import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllRoutes } from '../services/api'
import { setcRoutes } from '../data/setcRoutes'
import ScheduleTable from '../components/ScheduleTable'

export default function SchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allRoutes, setAllRoutes]     = useState([])
  const [loading, setLoading]         = useState(true)
  
  const queryParam = searchParams.get('q') || ''
  const [query, setQuery]             = useState(queryParam)
  const [typeFilter, setTypeFilter]   = useState('')
  const [depotFilter, setDepotFilter] = useState('')

  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  useEffect(() => {
    // Try to fetch from backend, fallback to static data if backend is empty or fails
    fetchAllRoutes().then(data => {
      if (data && data.routes && data.routes.length > 0) {
        setAllRoutes(data.routes)
      } else {
        setAllRoutes(setcRoutes)
      }
      setLoading(false)
    }).catch(() => {
      setAllRoutes(setcRoutes)
      setLoading(false)
    })
  }, [])

  const displayed = useMemo(() => {
    let filtered = [...allRoutes]
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(r =>
        r.from?.toLowerCase().includes(q) ||
        r.to?.toLowerCase().includes(q) ||
        r.route_no?.toLowerCase().includes(q) ||
        r.depot?.toLowerCase().includes(q)
      )
    }
    if (typeFilter) filtered = filtered.filter(r => r.type?.trim() === typeFilter)
    if (depotFilter) filtered = filtered.filter(r => r.depot?.trim() === depotFilter)
    return filtered
  }, [query, typeFilter, depotFilter, allRoutes])

  const clear = () => {
    setQuery(''); setTypeFilter(''); setDepotFilter('');
    setSearchParams({});
  }

  const depots = useMemo(() => {
    const dSet = new Set(allRoutes.map(r => r.depot).filter(Boolean));
    return Array.from(dSet).sort();
  }, [allRoutes]);

  const inpClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all text-sm";

  return (
    <div className="bg-[#0f0f1a] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            SETC <span className="text-brand">Schedules</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            {loading ? 'Synchronizing with SETC Database...' : `Found ${displayed.length} routes across Tamil Nadu`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="md:col-span-2 relative">
             <input
                className={`${inpClass} w-full pl-10`}
                placeholder="Search by city, route number or depot..."
                value={query} 
                onChange={e => {
                  setQuery(e.target.value);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          
          <select 
            className={inpClass}
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="ULTRA">ULTRA</option>
            <option value="A/C">A/C</option>
            <option value="AC UD">AC UD</option>
          </select>

          <select 
            className={inpClass}
            value={depotFilter} 
            onChange={e => setDepotFilter(e.target.value)}
          >
            <option value="">All Depots</option>
            {depots.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="text-4xl animate-bounce">🚌</div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Route Data...</p>
          </div>
        ) : (
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
             <ScheduleTable routes={displayed} />
          </div>
        )}
        
        {!loading && displayed.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-600 mb-6 font-bold">No routes found matching your search.</p>
             <button onClick={clear} className="text-brand font-black uppercase text-xs tracking-widest border-2 border-brand/20 px-8 py-3 rounded-xl hover:bg-brand/10 transition-all">
                Reset Filters
             </button>
          </div>
        )}
      </div>
    </div>
  )
}
