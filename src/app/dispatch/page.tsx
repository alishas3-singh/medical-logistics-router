'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, Package, Zap } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#111] animate-pulse rounded-2xl" /> 
});

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const hospitals = [
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
  ];

  const filtered = hospitals.filter(h => 
    h.hub.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.cargo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pt-20">
      {/* THE ONLY SEARCH BAR */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          className="w-full bg-[#111] border border-[#222] py-4 pl-12 pr-6 rounded-2xl text-sm outline-none focus:border-[#00f5ff] transition-all"
          placeholder="Search 10 Hubs or Cargo Types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className="h-[400px] w-full">
        <Map missions={filtered} vehicles={[]} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-[#111] border border-[#1a1a1a] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-bold text-sm">{m.cargo} Payload</div>
                <div className="text-[10px] text-gray-500 uppercase">{m.hub} Hub</div>
              </div>
            </div>
            <Zap className="w-4 h-4 text-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
}