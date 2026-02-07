'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Package, Activity, Truck, Zap } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#111] rounded-2xl animate-pulse" /> 
});

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);

  const hospitals = useMemo(() => [
    { id: 'H1', hub: 'Harborview', pos: [47.6044, -122.3241], cargo: 'Heart' },
    { id: 'H2', hub: 'UW Medicine', pos: [47.6501, -122.3066], cargo: 'Blood' },
    { id: 'H3', hub: 'Children’s', pos: [47.6622, -122.2825], cargo: 'ECMO' },
    { id: 'H4', hub: 'Swedish', pos: [47.6087, -122.3214], cargo: 'Plasma' },
    { id: 'H5', hub: 'Virginia Mason', pos: [47.6105, -122.3292], cargo: 'Vaccines' },
    { id: 'H6', hub: 'St. Joseph', pos: [47.2435, -122.4443], cargo: 'Trauma' },
    { id: 'H7', hub: 'Overlake', pos: [47.6201, -122.1885], cargo: 'O2' },
    { id: 'H8', hub: 'Providence', pos: [47.9912, -122.2034], cargo: 'Antivenom' },
    { id: 'H9', hub: 'MultiCare', pos: [47.3073, -122.2285], cargo: 'Dialysis' },
    { id: 'H10', hub: 'Sacred Heart', pos: [47.6483, -117.4128], cargo: 'Insulin' },
  ], []);

  useEffect(() => {
    const initialVehicles = Array.from({ length: 10 }).map((_, i) => ({
      id: `V${i+1}`,
      callsign: `DRONE-${101 + i}`,
      pos: [47.6 + (Math.random() - 0.5) * 0.4, -122.3 + (Math.random() - 0.5) * 0.4] as [number, number],
      speed: Math.floor(Math.random() * 20) + 35
    }));
    setVehicles(initialVehicles);
  }, []);

  const filtered = hospitals.filter(h => h.hub.toLowerCase().includes(searchQuery.toLowerCase()) || h.cargo.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 pt-24">
      <div className="relative w-full max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          className="w-full bg-[#111] border border-[#222] py-4 pl-12 pr-6 rounded-2xl text-sm outline-none focus:border-[#00f5ff] transition-all shadow-xl"
          placeholder="Search 10 Hubs or Cargo Types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className="h-[400px] w-full rounded-3xl overflow-hidden border border-[#1a1a1a]">
        <Map missions={filtered} vehicles={vehicles} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-[#111] border border-[#1a1a1a] p-4 rounded-xl flex items-center justify-between hover:border-[#333] transition-colors">
              <div className="flex items-center gap-4">
                <Package className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-bold text-sm text-white">{m.cargo} Payload</div>
                  <div className="text-[10px] text-gray-500 uppercase font-mono">{m.hub} Hub</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <LifeCostCard time={32} weather={0.4} severity={8.5} />
          <div className="bg-[#111] border border-[#1a1a1a] p-5 rounded-xl">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-[#00f5ff]" /> Fleet Status</h3>
             {vehicles.slice(0, 5).map(v => (
               <div key={v.id} className="flex justify-between text-xs py-2 border-b border-[#1a1a1a] last:border-0 font-mono">
                 <span className="text-gray-400 flex items-center gap-2"><Truck className="w-3 h-3" /> {v.callsign}</span>
                 <span className="text-[#00f5ff]">{v.speed} MPH</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}