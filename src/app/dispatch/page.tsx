'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Cloud, AlertTriangle, Search, Activity } from 'lucide-react';

const DynamicMapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-[#00f5ff] animate-pulse">Initializing Map...</div>
    </div>
  ),
});

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  weatherSeverity: number;
}

interface TrafficData {
  congestion: number;
  delay: number;
}

export default function DispatchPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weather_code,wind_speed_10m&timezone=America/Los_Angeles'
        );
        const data = await response.json();
        setWeatherData({
          temperature: data.current.temperature_2m,
          condition: "Seattle Area",
          windSpeed: data.current.wind_speed_10m,
          weatherSeverity: data.current.weather_code > 60 ? 0.8 : 0.4,
        });
      } catch (err) { console.error(err); }
    };

    const fetchTraffic = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const response = await fetch(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${apiKey}`
        );
        const data = await response.json();
        const current = data.flowSegmentData.currentTravelTime;
        const freeFlow = data.flowSegmentData.freeFlowTravelTime;
        setTrafficData({
          congestion: Math.round(((freeFlow - current) / freeFlow) * -100),
          delay: parseFloat(((current - freeFlow) / 60).toFixed(1)),
        });
      } catch (err) { setTrafficData({ congestion: 30, delay: 5.2 }); }
    };

    Promise.all([fetchWeather(), fetchTraffic()]).finally(() => setLoading(false));
  }, []);

  const timeMinutes = 30 + (trafficData?.delay || 0);
  const weatherFactor = weatherData?.weatherSeverity || 0.4;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Search Header */}
      <div className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 space-x-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search missions (e.g. Heart, UW, Children's)..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00f5ff] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-[#00f5ff]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest">System Live</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* The Map */}
        <DynamicMapView trafficData={trafficData || undefined} searchQuery={searchQuery} />
        
        {/* Floating Telemetry Overlays */}
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <LifeCostCard time={timeMinutes} weather={weatherFactor} severity={7.5} />
        </div>

        {weatherData && (
          <div className="absolute top-4 left-4 z-[1000] bg-[#1a1a1a]/90 backdrop-blur border border-[#2a2a2a] rounded-lg p-3 shadow-xl">
            <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
              <Cloud className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Seattle Weather</span>
            </div>
            <div className="text-xl font-bold">{weatherData.temperature}°C</div>
            <div className="text-[10px] text-gray-400">Wind: {weatherData.windSpeed}km/h</div>
          </div>
        )}

        {trafficData && (
          <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/90 backdrop-blur border border-[#2a2a2a] rounded-lg p-3 shadow-xl">
            <div className="flex items-center space-x-2 text-[#ff3131] mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Traffic Flow</span>
            </div>
            <div className="text-xl font-bold text-[#ff3131]">+{trafficData.delay} min</div>
            <div className="text-[10px] text-gray-400">Congestion: {trafficData.congestion}%</div>
          </div>
        )}
      </div>
    </div>
  );
}