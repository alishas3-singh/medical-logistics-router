'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Cloud, AlertTriangle, Search, Activity, MapPin, WifiOff } from 'lucide-react';

const DynamicMapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0a0a0a]" />,
});

export default function DispatchPage() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

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
    async function initDashboard() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        
        // Traffic Fetch with Error Handling
        const trafficRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${apiKey}`);
        if (!trafficRes.ok) throw new Error(`Traffic API: ${trafficRes.statusText}`);
        const tData = await trafficRes.json();
        
        setTrafficData({
          congestion: Math.round(((tData.flowSegmentData.freeFlowTravelTime - tData.flowSegmentData.currentTravelTime) / tData.flowSegmentData.freeFlowTravelTime) * -100) || 0,
          delay: parseFloat(((tData.flowSegmentData.currentTravelTime - tData.flowSegmentData.freeFlowTravelTime) / 60).toFixed(1)) || 0,
        });

      } catch (err: any) {
        console.error("FETCH_ERROR: Falling back to simulation mode", err);
        setApiError(err.message);
        // Fallback for demo stability
        setTrafficData({ congestion: 15, delay: 2.4 });
        setWeatherData({ temperature: 14, weatherSeverity: 0.4 });
      }
    }
    initDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Header with Search and Error Warning */}
      <div className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 space-x-4 relative z-[2000]">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search missions..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00f5ff]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2a2a2a] mt-1 rounded-lg shadow-2xl overflow-hidden">
              {results.map((r, i) => (
                <div key={i} className="px-4 py-2 hover:bg-[#2a2a2a] flex items-center justify-between border-b border-[#2a2a2a] last:border-0">
                  <span className="text-sm font-bold">{r.name}</span>
                  <MapPin className="w-3 h-3 text-[#00f5ff]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {apiError && (
          <div className="flex items-center space-x-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <WifiOff className="w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-tighter">Offline Mode</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-[#00f5ff]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">System Live</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <DynamicMapView trafficData={trafficData} searchQuery={searchQuery} />
        
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <LifeCostCard time={30 + (trafficData?.delay || 0)} weather={0.4} severity={7.5} />
        </div>

        {trafficData && (
          <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/95 border border-[#2a2a2a] rounded-lg p-3 shadow-2xl">
            <div className="flex items-center space-x-2 text-[#ff3131] mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter font-mono">Real-Time Telemetry</span>
            </div>
            <div className="text-xl font-bold">+{trafficData.delay}m Delay</div>
            <div className="text-[10px] text-gray-500 uppercase">Congestion: {trafficData.congestion}%</div>
          </div>
        )}
      </div>
    </div>
  );
}