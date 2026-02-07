'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, Wind, MapPin, Package, AlertCircle } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState({ temp: 12, wind: 8 });
  const [traffic, setTraffic] = useState({ delay: 0 });

  const seattleHubs = [
    { name: 'Human Heart #702', hub: 'Harborview', priority: 'CRITICAL' },
    { name: 'Type O- Blood', hub: 'UW Medicine', priority: 'URGENT' },
    { name: 'ECMO Unit', hub: "Seattle Children's", priority: 'HIGH' },
  ];

  const results = seattleHubs.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const key = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const trafficRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${key}`);
        const tData = await trafficRes.json();
        setTraffic({ delay: Math.max(0, parseFloat(((tData.flowSegmentData.currentTravelTime - tData.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1))) });
      } catch (e) { setTraffic({ delay: 4.8 }); }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* 1. Header (64px) */}
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 shrink-0">
        <div className="text-[#00f5ff] font-bold text-lg tracking-tight mr-10 uppercase italic">WA-Grid Dispatch</div>
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm text-white focus:border-[#00f5ff] outline-none"
            placeholder="Search active missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* 2. Map Section (Occupies 45% of height) */}
      <section className="h-[45vh] w-full p-4 shrink-0 bg-[#0a0a0a]">
        <Map searchQuery={searchQuery} trafficData={traffic} />
      </section>

      {/* 3. Dashboard Section (Scrollable Footer/Stats) */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a] border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Missions List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4" /> Live Search Results
            </h3>
            {results.length > 0 ? results.map((m, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between hover:border-[#00f5ff]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-10 rounded ${m.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-mono tracking-tighter">{m.hub} Hub</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">ETA Delay</div>
                  <div className="text-[#ff3131] font-mono font-bold">+{traffic.delay}m</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 border-2 border-dashed border-[#2a2a2a] rounded-xl text-gray-600 italic">No missions found matching query.</div>
            )}
          </div>

          {/* Life Cost Overlay Sidebar */}
          <div className="space-y-4">
            <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase">System Health</span>
                <Activity className="w-3 h-3 text-[#00f5ff] animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-400">Temp</span><span>{weather.temp}°C</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Wind</span><span>{weather.wind}km/h</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Region</span><span className="text-[#00f5ff]">WA-NW</span></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}