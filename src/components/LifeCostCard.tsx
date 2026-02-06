'use client';

import { AlertTriangle, Clock, Cloud, Activity } from 'lucide-react';

interface LifeCostCardProps {
  time: number; // in minutes
  weather: number; // weather severity factor (0-1)
  severity: number; // medical severity (0-10)
}

export default function LifeCostCard({ time, weather, severity }: LifeCostCardProps) {
  // Life-Cost Index: LC = (Time × Weather) + Severity
  const lifeCost = (time * weather) + severity;
  
  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-[#ff3131]';
    if (severity >= 5) return 'text-yellow-500';
    return 'text-[#00f5ff]';
  };

  const getLifeCostColor = (lc: number) => {
    if (lc >= 50) return 'text-[#ff3131]';
    if (lc >= 30) return 'text-yellow-500';
    return 'text-[#00f5ff]';
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#00f5ff]" />
          <span>Active Cargo</span>
        </h3>
        <div className={`text-2xl font-bold ${getLifeCostColor(lifeCost)}`}>
          ${lifeCost.toFixed(1)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Time</span>
          </div>
          <span className="text-white font-medium">{time} min</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <Cloud className="w-4 h-4" />
            <span className="text-sm">Weather Factor</span>
          </div>
          <span className="text-white font-medium">{(weather * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Severity</span>
          </div>
          <span className={`font-medium ${getSeverityColor(severity)}`}>
            {severity.toFixed(1)}/10
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
        <div className="text-xs text-gray-500">
          <div className="font-mono text-[#00f5ff]">
            LC = (Time × Weather) + Severity
          </div>
          <div className="mt-1 text-gray-400">
            = ({time} × {weather.toFixed(2)}) + {severity.toFixed(1)} = ${lifeCost.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
