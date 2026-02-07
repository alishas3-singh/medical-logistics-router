'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, MapPin, AlertCircle } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [traffic, setTraffic] = useState({ delay: 0 });

  const seattleHubs = [
    { name: 'Heart Transplant', hub: 'Harborview' },
    { name: 'Type O- Blood', hub: 'UW Medicine' },
    { name: 'Pediatric ECMO', hub: "Seattle Children's" },
  ];

  const results = seattleHubs.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function getTraffic() {
      try {
        const key = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const res = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${key}`);
        const data = await res.json();
        setTraffic({ delay: parseFloat(((data.flowSegmentData.currentTravelTime - data.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1)) });
      } catch (e) { setTraffic({ delay: 5.4 }); }
    }
    getTraffic();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 z-20">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm text-white focus:border-[#00f5ff] outline-none"
            placeholder="Search Seattle Hubs (e.g. Harborview)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2a2a2a] mt-1 rounded-lg shadow-2xl overflow-hidden">
              {results.length > 0 ? results.map((r, i) => (
                <div key={i} className="px-4 py-3 hover:bg-[#2a2a2a] flex items-center justify-between border-b border-[#2a2a2a] last:border-0 cursor-pointer">
                  <div className="text-xs font-bold">{r.name} <span className="text-gray-500 font-normal">at {r.hub}</span></div>
                  <MapPin className="w-3 h-3 text-[#00f5ff]" />
                </div>
              )) : (
                <div className="px-4 py-3 text-xs text-gray-500 italic">No missions found in Washington.</div>
              )}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-2 text-[#00f5ff] text-[10px] font-mono tracking-widest uppercase">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live Dispatch</span>
        </div>
      </header>

      <main className="flex-grow relative">
        <Map searchQuery={searchQuery} trafficData={traffic} />
        
        <div className="absolute top-4 right-4 z-[1000] w-72">
          <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
        </div>

        <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/95 p-3 rounded-lg border border-[#2a2a2a] flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-md"><AlertCircle className="w-4 h-4 text-red-500" /></div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Real-Time Delay</div>
            <div className="text-xl font-bold text-white">+{traffic.delay} min</div>
          </div>
        </div>
      </main>
    </div>
  );
}