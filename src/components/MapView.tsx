'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const hospitalIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-hospital-icon',
  html: `<div style="background-color: #ff3131; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(255,49,49,0.6);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
}) : null;

const vehicleIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-vehicle-icon',
  html: `<div style="background-color: #00f5ff; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px #00f5ff; animation: pulse 2s infinite;"></div>
         <style>
           @keyframes pulse {
             0% { transform: scale(1); opacity: 1; }
             50% { transform: scale(1.2); opacity: 0.7; }
             100% { transform: scale(1); opacity: 1; }
           }
         </style>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
}) : null;

export default function MapView({ trafficData, searchQuery = '' }: any) {
  const [mounted, setMounted] = useState(false);
  const [vehiclePos, setVehiclePos] = useState<[number, number]>([47.6000, -122.3300]);

  const missions = useMemo(() => [
    { id: '702', pos: [47.6044, -122.3241] as [number, number], name: 'Heart Transplant', hub: 'Harborview' },
    { id: '401', pos: [47.6501, -122.3066] as [number, number], name: 'Type O- Blood', hub: 'UW Medicine' },
    { id: '109', pos: [47.6622, -122.2825] as [number, number], name: 'Pediatric ECMO', hub: "Seattle Children's" },
  ], []);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.hub.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, missions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePos(prev => [prev[0] + 0.00004, prev[1] + 0.00004]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mapTileUrl = useMemo(() => {
    if (typeof window === 'undefined') return "";
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }, []);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !hospitalIcon || !vehicleIcon) return null;

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[47.6150, -122.3300]} 
        zoom={12.5} 
        style={{ height: '100%', width: '100%' }}
        // SMOOTH SCROLLING SETTINGS
        scrollWheelZoom={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={120}
      >
        <TileLayer attribution='&copy; CARTO' url={mapTileUrl} />
        
        <Marker position={vehiclePos} icon={vehicleIcon}>
          <Popup><strong>MED-V1</strong><br/>Status: Active Dispatch</Popup>
        </Marker>

        {filteredMissions.map((m) => (
          <Marker key={m.id} position={m.pos} icon={hospitalIcon}>
            <Popup>
              <div className="text-black leading-tight">
                <div className="font-bold">{m.name}</div>
                <div className="text-xs text-gray-600">{m.hub}</div>
                <div className="text-[10px] text-red-500 font-bold mt-1">
                  Delay Impact: +{trafficData?.delay || 0}m
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {filteredMissions.length > 0 && (
          <Polyline 
            positions={[vehiclePos, filteredMissions[0].pos]} 
            color="#00f5ff" 
            weight={2} 
            dashArray="8, 12" 
            opacity={0.5} 
          />
        )}
      </MapContainer>
    </div>
  );
}