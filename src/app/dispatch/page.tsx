'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, MapPin, Package, AlertCircle } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0a0a0a]" />
});

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [traffic, setTraffic] = useState({ delay: 0 });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Default Washington Cargo & Hospitals
  const defaultMissions = [
    { id: '1', name: 'Human Heart #702', hub: 'Harborview Medical Center', type: 'Organ' },
    { id: '2', name: 'Type O- Blood (10 Units)', hub: 'UW Medical Center', type: 'Blood' },
    { id: '3', name: 'Pediatric ECMO Kit', hub: "Seattle Children's Hospital", type: 'Equipment' },
  ];

  const filtered = defaultMissions.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function getTraffic() {
      try {
        const key = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const res = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${key}`);
        const data = await res.json();
        setTraffic({ delay: parseFloat(((data.flowSegmentData.currentTravelTime - data.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1)) });
      } catch (e) { setTraffic({ delay: 4.5 }); }
    }
    getTraffic();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 z-50">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm text-white focus:border-[#00f5ff] outline-none transition-all"
            placeholder="Search Seattle Hubs or Cargo..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200) /* delay to allow clicks */}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* SEARCH DROPDOWN: Populates with default values */}
          {(isSearchFocused || searchQuery) && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2a2a2a] mt-2 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#2a2a2a]">Active Washington Missions</div>
              {filtered.length > 0 ? filtered.map((m) => (
                <div key={m.id} className="px-4 py-3 hover:bg-[#2a2a2a] flex items-center space-x-3 cursor-pointer group">
                  <Package className="w-4 h-4 text-[#00f5ff] group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-gray-400">{m.hub}</div>
                  </div>
                  <MapPin className="ml-auto w-3 h-3 text-gray-600" />
                </div>
              )) : (
                <div className="px-4 py-4 text-xs text-gray-500 italic">No matching cargo found.</div>
              )}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-[#00f5ff] text-[10px] font-mono tracking-widest uppercase">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </header>

      {/* MAP VIEWPORT: Grows to fill available space */}
      <main className="flex-1 relative overflow-hidden bg-[#111]">
        <Map searchQuery={searchQuery} trafficData={traffic} />
        
        {/* OVERLAYS */}
        <div className="absolute top-4 right-4 z-[1000] w-72">
          <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
        </div>
      </main>

      {/* FOOTER: Fixed at bottom */}
      <footer className="h-14 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center px-6 justify-between z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">Fleet Ready</span>
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase">Region: <span className="text-white">US-West-SEA</span></div>
        </div>
        <div className="flex items-center space-x-3 text-[#ff3131]">
          <AlertCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Real-Time Delay: +{traffic.delay} min</span>
        </div>
      </footer>
    </div>
  );
}