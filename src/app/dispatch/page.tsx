'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Cloud, AlertTriangle, Search, Activity, MapPin } from 'lucide-react';

const DynamicMapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0a0a0a]" />,
});

export default function DispatchPage() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample data for search feedback
  const missions = [
    { name: 'Heart Transplant', hub: 'Harborview' },
    { name: 'Type O- Blood', hub: 'UW Medicine' },
    { name: 'Pediatric ECMO', hub: "Seattle Children's" },
  ];

  const results = missions.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const response = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${apiKey}`);
        const data = await response.json();
        setTrafficData({
          congestion: Math.round(((data.flowSegmentData.freeFlowTravelTime - data.flowSegmentData.currentTravelTime) / data.flowSegmentData.freeFlowTravelTime) * -100),
          delay: parseFloat(((data.flowSegmentData.currentTravelTime - data.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1)),
        });
      } catch (err) { setTrafficData({ congestion: 30, delay: 4.5 }); }
    };
    fetchTraffic();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Search Header with Instant Feedback */}
      <div className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 space-x-4 relative z-[2000]">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search active missions..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00f5ff]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* SEARCH RESULTS DROPDOWN */}
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2a2a2a] mt-1 rounded-lg shadow-2xl overflow-hidden">
              {results.length > 0 ? results.map((r, i) => (
                <div key={i} className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center justify-between border-b border-[#2a2a2a] last:border-0">
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase">{r.hub}</div>
                  </div>
                  <MapPin className="w-3 h-3 text-[#00f5ff]" />
                </div>
              )) : (
                <div className="px-4 py-3 text-xs text-gray-500">No missions found.</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-[#00f5ff]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">System Operational</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <DynamicMapView trafficData={trafficData} searchQuery={searchQuery} />
        
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <LifeCostCard time={30 + (trafficData?.delay || 0)} weather={0.4} severity={7.5} />
        </div>

        {trafficData && (
          <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/90 backdrop-blur border border-[#2a2a2a] rounded-lg p-3 shadow-xl">
            <div className="flex items-center space-x-2 text-[#ff3131] mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Traffic Alert</span>
            </div>
            <div className="text-xl font-bold text-[#ff3131]">+{trafficData.delay}m</div>
            <div className="text-[10px] text-gray-400">Congestion: {trafficData.congestion}%</div>
          </div>
        )}
      </div>
    </div>
  );
}