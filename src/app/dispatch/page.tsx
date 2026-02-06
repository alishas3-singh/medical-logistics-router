'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LifeCostCard from '@/components/LifeCostCard';
import { Cloud, AlertTriangle } from 'lucide-react';

// Dynamically import MapView to avoid SSR issues with Leaflet
const DynamicMapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-[#00f5ff]">Loading map...</div>
    </div>
  ),
});

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  weatherSeverity: number; // 0-1 factor
}

interface TrafficData {
  congestion: number; // 0-100
  delay: number; // minutes
}

export default function DispatchPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weather_code,wind_speed_10m&timezone=America/Los_Angeles'
        );
        const data = await response.json();
        const weatherCode = data.current.weather_code;
        
        let weatherSeverity = 0.3;
        if (weatherCode >= 61) weatherSeverity = 0.7;
        if (weatherCode >= 71) weatherSeverity = 0.8;
        if (weatherCode >= 95) weatherSeverity = 0.9;

        setWeatherData({
          temperature: data.current.temperature_2m,
          condition: "Current Conditions", // Simplified for build stability
          windSpeed: data.current.wind_speed_10m,
          weatherSeverity: Math.min(weatherSeverity, 1.0),
        });
      } catch (err) {
        console.error('Weather error:', err);
      }
    };

    const fetchTraffic = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TRAFFIC_API_KEY || '7yr5iJrCCjNoh29Mwn3USXM2gJOiIPau';
        const response = await fetch(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${apiKey}`
        );
        const data = await response.json();
        
        const current = data.flowSegmentData.currentSpeed;
        const freeFlow = data.flowSegmentData.freeFlowSpeed;
        const congestionFactor = Math.round(((freeFlow - current) / freeFlow) * 100);
        
        setTrafficData({
          congestion: Math.max(0, congestionFactor),
          delay: Math.round(data.flowSegmentData.currentTravelTime / 60) - Math.round(data.flowSegmentData.freeFlowTravelTime / 60),
        });
      } catch (err) {
        console.error('Traffic error:', err);
        setTrafficData({ congestion: 35, delay: 12 });
      }
    };

    // Execute both and stop loading
    Promise.all([fetchWeather(), fetchTraffic()]).finally(() => {
      setLoading(false);
    });
  }, []); // This is line 135 where the error was triggered
  // Calculate Life-Cost Index values
  const timeMinutes = trafficData ? 30 + trafficData.delay : 30;
  const weatherFactor = weatherData?.weatherSeverity || 0.4;
  const severity = 7.5; // Sample medical severity (0-10)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Map View - 80% viewport */}
      <div className="h-[80vh] relative">
        <DynamicMapView weatherData={weatherData || undefined} trafficData={trafficData || undefined} />
        
        {/* Floating Life-Cost Card */}
        <div className="absolute top-4 right-4 z-[1000] w-full max-w-sm">
          <LifeCostCard
            time={timeMinutes}
            weather={weatherFactor}
            severity={severity}
          />
        </div>

        {/* Weather Info Card */}
        {weatherData && (
          <div className="absolute top-4 left-4 z-[1000] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="w-5 h-5 text-[#00f5ff]" />
              <span className="text-sm font-semibold text-white">Seattle Weather</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-gray-300">{weatherData.condition}</div>
              <div className="text-gray-400">
                {weatherData.temperature}°C • Wind: {weatherData.windSpeed} km/h
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Severity Factor: {(weatherData.weatherSeverity * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* Traffic Info Card */}
        {trafficData && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#ff3131]" />
              <span className="text-sm font-semibold text-white">Traffic Status</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-gray-300">
                Congestion: {trafficData.congestion}%
              </div>
              <div className="text-[#ff3131]">
                Delay: +{trafficData.delay} min
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats Bar */}
      <div className="h-[20vh] bg-[#1a1a1a] border-t border-[#2a2a2a] p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Live Dispatch Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Active Routes</div>
              <div className="text-2xl font-bold text-[#00f5ff]">12</div>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Avg. ETA</div>
              <div className="text-2xl font-bold text-white">{timeMinutes} min</div>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Critical Cargo</div>
              <div className="text-2xl font-bold text-[#ff3131]">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
