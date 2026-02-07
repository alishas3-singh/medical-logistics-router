'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, MapPin, Activity, Package } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const missions = [
    { name: 'Heart Transplant #702', hub: 'Harborview', status: 'In Transit' },
    { name: 'Type O- Blood (Urgent)', hub: 'UW Medicine', status: 'Priority' },
    { name: 'Pediatric ECMO Kit', hub: "Seattle Children's", status: 'Preparing' },
  ];

  const filtered = missions.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Search Header */}
      <header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 gap-4 z-50">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm text-white focus:border-[#00f5ff] outline-none"
            placeholder="Search missions or hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2 text-[#00f5ff] text-[10px] font-mono tracking-widest">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>WASHINGTON GRID LIVE</span>
        </div>
      </header>

      {/* FIXED MAP VIEW (Not full page) */}
      <section className="h-[400px] w-full p-4 shrink-0">
        <Map searchQuery={searchQuery} />
      </section>

      {/* DATA DASHBOARD (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* List of Missions (Populated by default) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2 mb-2">
              <Package className="w-4 h-4" /> Active Mission Log
            </h3>
            {filtered.map((m, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{m.hub} Center</div>
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
            ))}
          </div>

          {/* Life Cost Overlay */}
          <div className="space-y-4">
            <LifeCostCard time={34} weather={0.4} severity={7.5} />
          </div>

        </div>
      </main>
    </div>
  );
}