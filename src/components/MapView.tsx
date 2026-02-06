'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. STABLE ICON LOGIC (CSS Based - won't break)
const hospitalIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #ff3131; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [12, 12],
});

const vehicleIcon = L.divIcon({
  className: 'vehicle-icon',
  html: `<div style="background-color: #00f5ff; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #00f5ff;"></div>`,
  iconSize: [14, 14],
});

export default function MapView({ trafficData, searchQuery }: any) {
  const [mounted, setMounted] = useState(false);
  const [vehiclePos, setVehiclePos] = useState<[number, number]>([47.6000, -122.3300]);

  const missions = [
    { id: '702', pos: [47.6044, -122.3241], name: 'Heart Transplant', hub: 'Harborview' },
    { id: '401', pos: [47.6501, -122.3066], name: 'Type O- Blood', hub: 'UW Medicine' },
  ];

  // Filter missions based on the search bar input
  const filteredMissions = missions.filter(m => 
    m.name.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    m.hub.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePos(prev => [prev[0] + 0.00005, prev[1] + 0.00005]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const mapTileUrl = useMemo(() => {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }, []);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="w-full h-full relative">
      <MapContainer center={[47.6100, -122.3300]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; CARTO' url={mapTileUrl} />
        
        {/* LIVE VEHICLE */}
        <Marker position={vehiclePos} icon={vehicleIcon}>
          <Popup>MED-V1: Active Route</Popup>
        </Marker>

        {/* SEARCH-FILTERED MISSIONS */}
        {filteredMissions.map((m) => (
          <Marker key={m.id} position={m.pos as [number, number]} icon={hospitalIcon}>
            <Popup>
              <div className="text-black font-sans">
                <strong>{m.name}</strong><br/>
                <span className="text-xs">{m.hub}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {filteredMissions.length > 0 && (
          <Polyline positions={[vehiclePos, filteredMissions[0].pos as [number, number]]} color="#00f5ff" weight={2} dashArray="5, 10" opacity={0.6} />
        )}
      </MapContainer>
    </div>
  );
}