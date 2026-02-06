'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, ShieldAlert } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0a0a0a]" />
});

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [traffic, setTraffic] = useState({ delay: 0, congestion: 0 });

  useEffect(() => {
    async function getTraffic() {
      try {
        const key = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const res = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${key}`);
        const data = await res.json();
        setTraffic({
          delay: parseFloat(((data.flowSegmentData.currentTravelTime - data.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1)),
          congestion: 20 // Default fallback
        });
      } catch (e) { setTraffic({ delay: 4.2, congestion: 15 }); }
    }
    getTraffic();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Header (64px) */}
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 justify-between z-20">
        <div className="flex items-center flex-1 max-w-xl relative">
          <Search className="absolute left-3 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm focus:border-[#00f5ff] outline-none"
            placeholder="Search Mission Hubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 ml-4">
          <div className="flex items-center space-x-2 text-[#00f5ff] text-[10px] font-mono tracking-tighter uppercase">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Telemetry Link Active</span>
          </div>
        </div>
      </header>

      {/* Main Map Viewport */}
      <main className="flex-grow relative w-full bg-[#0a0a0a]">
        <Map searchQuery={searchQuery} trafficData={traffic} />
        
        {/* Overlay Cards */}
        <div className="absolute top-4 right-4 z-[1000] w-72">
          <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
        </div>

        <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/90 p-3 rounded-lg border border-[#2a2a2a]">
          <div className="flex items-center space-x-2 text-[#ff3131] text-xs font-bold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>TRAFFIC FLOW</span>
          </div>
          <div className="text-xl font-bold">+{traffic.delay} min</div>
        </div>
      </main>
    </div>
  );
}