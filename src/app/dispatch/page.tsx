'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Search, Activity, MapPin, Wind, AlertTriangle } from 'lucide-react';

const Map = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState({ temp: 0, wind: 0 });
  const [traffic, setTraffic] = useState({ delay: 0 });

  useEffect(() => {
    async function fetchWashingtonData() {
      try {
        const key = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        
        // 1. Fetch Real Weather for Seattle Hub
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,wind_speed_10m');
        const wData = await weatherRes.json();
        setWeather({ temp: wData.current.temperature_2m, wind: wData.current.wind_speed_10m });

        // 2. Fetch Real Traffic for Washington I-5 Corridor
        const trafficRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${key}`);
        const tData = await trafficRes.json();
        const delay = (tData.flowSegmentData.currentTravelTime - tData.flowSegmentData.freeFlowTravelTime) / 60;
        setTraffic({ delay: Math.max(0, parseFloat(delay.toFixed(1))) });
      } catch (e) {
        console.warn("Using Fallback Washington Data");
        setWeather({ temp: 12, wind: 8 });
        setTraffic({ delay: 3.2 });
      }
    }
    fetchWashingtonData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center px-6 z-50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] py-2 pl-10 pr-4 rounded-lg text-sm text-white focus:border-[#00f5ff] outline-none"
            placeholder="Search Washington Hubs (Seattle, Spokane...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Seattle Weather</span>
            <div className="flex items-center space-x-2 text-[#00f5ff]">
              <Wind className="w-3 h-3" />
              <span className="text-xs font-mono">{weather.temp}°C | {weather.wind}km/h</span>
            </div>
          </div>
          <div className="h-8 w-px bg-[#2a2a2a]" />
          <div className="flex items-center space-x-2 text-[#00f5ff] text-[10px] font-mono tracking-widest uppercase">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>WA-Grid Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <Map searchQuery={searchQuery} trafficData={traffic} />
        
        <div className="absolute top-4 right-4 z-[1000] w-72">
          <LifeCostCard time={30 + traffic.delay} weather={0.4} severity={7.5} />
        </div>

        <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/95 p-3 rounded-lg border border-[#2a2a2a] flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[#ff3131]">
            <AlertTriangle className="w-4 h-4" />
            <div className="leading-none">
              <div className="text-[10px] uppercase font-bold text-gray-400">TomTom Live Delay</div>
              <div className="text-lg font-bold">+{traffic.delay} min</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}