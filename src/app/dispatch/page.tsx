'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, Navigation, Package, Truck, Zap } from 'lucide-react';

// Dynamically import the map to avoid SSR issues
const Map = dynamic(() => import('@/components/MapView'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#111] animate-pulse rounded-2xl flex items-center justify-center text-gray-500">Initializing Washington Grid...</div> 
});

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);

  // 10 PERMANENT WASHINGTON HOSPITALS
  const hospitals = [
    { id: 'H1', hub: 'Harborview Medical', pos: [47.6044, -122.3241], cargo: 'Heart Transplant' },
    { id: 'H2', hub: 'UW Medical Center', pos: [47.6501, -122.3066], cargo: 'Blood Supply' },
    { id: 'H3', hub: 'Seattle Children’s', pos: [47.6622, -122.2825], cargo: 'ECMO Unit' },
    { id: 'H4', hub: 'Swedish First Hill', pos: [47.6087, -122.3214], cargo: 'Plasma' },
    { id: 'H5', hub: 'Virginia Mason', pos: [47.6105, -122.3292], cargo: 'Vaccines' },
    { id: 'H6', hub: 'St. Joseph Medical', pos: [47.2435, -122.4443], cargo: 'Trauma Kit' },
    { id: 'H7', hub: 'Overlake Medical', pos: [47.6201, -122.1885], cargo: 'O2 Tanks' },
    { id: 'H8', hub: 'Providence Everett', pos: [47.9912, -122.2034], cargo: 'Antivenom' },
    { id: 'H9', hub: 'MultiCare Auburn', pos: [47.3073, -122.2285], cargo: 'Dialysis' },
    { id: 'H10', hub: 'Sacred Heart', pos: [47.6483, -117.4128], cargo: 'Insulin' },
  ];

  // Initialize 10 VEHICLES with slow movement simulation
  useEffect(() => {
    const initialVehicles = Array.from({ length: 10 }).map((_, i) => ({
      id: `V${i+1}`,
      callsign: `DRONE-${101 + i}`,
      pos: [47.6 + (Math.random() - 0.5) * 0.15, -122.3 + (Math.random() - 0.5) * 0.15] as [number, number],
      speed: Math.floor(Math.random() * 30) + 25,
    }));
    setVehicles(initialVehicles);

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        pos: [v.pos[0] + (Math.random() - 0.5) * 0.001, v.pos[1] + (Math.random() - 0.5) * 0.001] as [number, number],
        speed: Math.floor(Math.random() * 5) + 28
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredMissions = hospitals.filter(h => 
    h.hub.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.cargo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* THE ONLY SEARCH BAR - TOP HEADER */}
      <header className="h-20 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-8 gap-8 z-50 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <Navigation className="w-6 h-6 text-[#00f5ff]" />
          <div className="leading-none">
            <h1 className="font-black text-lg tracking-tighter uppercase italic">EMLR</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Dispatch</p>
          </div>
        </div>

        <div className="relative flex-1 max-w-3xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#333] py-3.5 pl-12 pr-6 rounded-2xl text-sm text-white focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]/20 outline-none transition-all placeholder:text-gray-600"
            placeholder="Search 10 Hospitals or Cargo Assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden lg:flex items-center gap-4 text-[#00f5ff] text-[10px] font-mono font-bold tracking-[0.3em]">
          <Activity className="w-4 h-4 animate-pulse" />
          SYSTEM_LIVE
        </div>
      </header>

      {/* MAP TELEMETRY SECTION (Fixed Height) */}
      <section className="h-[400px] w-full p-6 pb-2 shrink-0">
        <Map missions={filteredMissions} vehicles={vehicles} />
      </section>

      {/* DATA DASHBOARD SECTION (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-6 pt-2">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Mission Matrix (3/4 width) */}
          <div className="xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4" /> Active Routing Matrix
              </h2>
              <span className="text-[10px] text-gray-500 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">
                Showing {filteredMissions.length} Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMissions.map((m) => (
                <div key={m.id} className="bg-[#141414] border border-[#222] p-5 rounded-2xl flex items-center justify-between hover:bg-[#1a1a1a] hover:border-[#333] transition-all group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
                      <Package className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-white">{m.cargo}</div>
                      <div className="text-[11px] text-gray-500 uppercase tracking-tight">{m.hub}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-[#222]" />
                  <div className="text-right">
                    <div className="text-[10px] text-gray-600 font-mono">STATUS</div>
                    <div className="text-xs font-bold text-green-500 tracking-tighter uppercase">Monitored</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Sidebar (1/4 width) */}
          <div className="space-y-4">
             <LifeCostCard time={32} weather={0.4} severity={8.5} />
             <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl">
                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-5 tracking-widest">Fleet Telemetry</h3>
                <div className="space-y-4">
                  {vehicles.slice(0, 6).map(v => (
                    <div key={v.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-[#00f5ff] opacity-60" />
                        <span className="text-xs font-bold text-gray-300">{v.callsign}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00f5ff] bg-[#00f5ff]/5 px-2 py-0.5 rounded border border-[#00f5ff]/10">
                        {v.speed} MPH
                      </span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}