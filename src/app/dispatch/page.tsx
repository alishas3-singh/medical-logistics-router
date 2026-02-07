'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, Zap, MapPin } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [traffic, setTraffic] = useState({ delay: 0 });

  // DEFAULT WASHINGTON ROUTES
  const activeMissions = [
    { id: '1', name: 'Heart Transplant #702', hub: 'Harborview', pos: [47.6044, -122.3241] },
    { id: '2', name: 'Blood Type O- (Urgent)', hub: 'UW Medicine', pos: [47.6501, -122.3066] },
    { id: '3', name: 'Pediatric ECMO Kit', hub: "Seattle Children's", pos: [47.6622, -122.2825] },
  ];

  const filtered = activeMissions.filter(m => 
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
      } catch (e) { setTraffic({ delay: 4.8 }); }
    }
    getTraffic();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 z-20">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm outline-none focus:border-[#00f5ff]"
            placeholder="Filter Seattle Routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="bg-[#00f5ff]/10 border border-[#00f5ff]/20 px-3 py-1 rounded flex items-center space-x-2 text-[#00f5ff]">
            <Zap className="w-3 h-3 fill-[#00f5ff]" />
            <span className="text-[10px] font-bold uppercase">3 Routes Optimized</span>
          </div>
        </div>
      </header>

      <main className="flex-grow relative">
        <Map missions={filtered} trafficData={traffic} />
        
        {/* LIFE-COST CALCULATION OVERLAY */}
        <div className="absolute top-4 right-4 z-[1000] w-80 space-y-4">
          <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
          
          <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a] p-4 rounded-xl shadow-2xl backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Active Routing Queue</h3>
            {filtered.map(m => (
              <div key={m.id} className="flex items-center justify-between mb-2 last:mb-0 border-l-2 border-[#00f5ff] pl-3 py-1">
                <div className="text-[11px]">
                  <div className="font-bold">{m.hub}</div>
                  <div className="text-gray-400">{m.name}</div>
                </div>
                <div className="text-[10px] font-mono text-[#00f5ff]">+{traffic.delay}m</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}