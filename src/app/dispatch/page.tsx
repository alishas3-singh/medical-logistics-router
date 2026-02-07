'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, Navigation, Truck, Package } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);

  // 10 WASHINGTON HOSPITALS
  const hospitals = [
    { id: 'H1', hub: 'Harborview Medical', pos: [47.6044, -122.3241], cargo: 'Heart Transplant' },
    { id: 'H2', hub: 'UW Medical Center', pos: [47.6501, -122.3066], cargo: 'Blood Supply' },
    { id: 'H3', hub: 'Seattle Children’s', pos: [47.6622, -122.2825], cargo: 'ECMO Unit' },
    { id: 'H4', hub: 'Swedish First Hill', pos: [47.6087, -122.3214], cargo: 'Plasma' },
    { id: 'H5', hub: 'Virginia Mason', pos: [47.6105, -122.3292], cargo: 'Vaccines' },
    { id: 'H6', hub: 'St. Joseph Medical', pos: [47.2435, -122.4443], cargo: 'Trauma Kit' }, // Tacoma
    { id: 'H7', hub: 'Overlake Medical', pos: [47.6201, -122.1885], cargo: 'O2 Tanks' }, // Bellevue
    { id: 'H8', hub: 'Providence Everett', pos: [47.9912, -122.2034], cargo: 'Antivenom' }, // Everett
    { id: 'H9', hub: 'MultiCare Auburn', pos: [47.3073, -122.2285], cargo: 'Dialysis' }, // Auburn
    { id: 'H10', hub: 'Sacred Heart', pos: [47.6483, -117.4128], cargo: 'Insulin' }, // Spokane
  ];

  // 10 ACTIVE VEHICLES (Live simulation logic)
  useEffect(() => {
    const initialVehicles = Array.from({ length: 10 }).map((_, i) => ({
      id: `V${i+1}`,
      callsign: `MED-DRAKE-${100 + i}`,
      pos: [47.6 + (Math.random() - 0.5) * 0.2, -122.3 + (Math.random() - 0.5) * 0.2] as [number, number],
      speed: Math.floor(Math.random() * 40) + 20,
      status: 'Active'
    }));
    setVehicles(initialVehicles);

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        pos: [v.pos[0] + (Math.random() - 0.5) * 0.002, v.pos[1] + (Math.random() - 0.5) * 0.002] as [number, number],
        speed: Math.floor(Math.random() * 10) + 25
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredMissions = hospitals.filter(h => 
    h.hub.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.cargo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Search Header */}
      <header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 gap-6 z-50">
        <div className="flex items-center gap-3">
          <Navigation className="w-5 h-5 text-[#00f5ff]" />
          <h1 className="font-bold uppercase tracking-widest text-sm">Fleet Commander</h1>
        </div>
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-xl text-sm outline-none focus:border-[#00f5ff] transition-all"
            placeholder="Search 10 Hubs & Active Assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-[#00f5ff] text-[10px] font-mono">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>SENSORS: 20 ACTIVE</span>
        </div>
      </header>

      {/* FIXED MAP (400px) */}
      <section className="h-[400px] w-full p-4 shrink-0">
        <Map missions={hospitals} vehicles={vehicles} searchQuery={searchQuery} />
      </section>

      {/* SCROLLABLE MISSION FEED */}
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Mission Matrix</h2>
            {filteredMissions.map((m) => (
              <div key={m.id} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between hover:bg-[#202020] cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-[#ff3131]/10 p-2 rounded-lg"><Package className="w-4 h-4 text-[#ff3131]" /></div>
                  <div>
                    <div className="font-bold text-sm">{m.cargo}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{m.hub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 font-mono">TRACKING_ID</div>
                  <div className="text-xs font-mono font-bold text-[#00f5ff]">{m.id}X</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
             <LifeCostCard time={32} weather={0.4} severity={8.5} />
             <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-5 rounded-xl">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4">Active Fleet</h3>
                <div className="space-y-3">
                  {vehicles.slice(0, 5).map(v => (
                    <div key={v.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><Truck className="w-3 h-3 text-[#00f5ff]" /> {v.callsign}</div>
                      <span className="text-[#00f5ff] font-mono">{v.speed} mph</span>
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