'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ weatherData, trafficData }: any) {
  const [mounted, setMounted] = useState(false);

  // Seattle-Specific Medical Missions
  const cargoLocations = [
    { 
      position: [47.6044, -122.3241] as [number, number], 
      name: 'Mission #702: Heart Transplant', 
      location: 'Harborview Medical Center',
      priority: 'CRITICAL' 
    },
    { 
      position: [47.6501, -122.3066] as [number, number], 
      name: 'Mission #401: Type O- Blood', 
      location: 'UW Medical Center',
      priority: 'HIGH' 
    },
    { 
      position: [47.6622, -122.2825] as [number, number], 
      name: 'Mission #109: Pediatric ECMO', 
      location: 'Seattle Children’s',
      priority: 'CRITICAL' 
    }
  ];

  // Automated Day/Night Logic
  const mapTileUrl = useMemo(() => {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }, []);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={[47.6062, -122.3321]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer attribution='&copy; CARTO' url={mapTileUrl} />
        
        {cargoLocations.map((cargo, i) => (
          <Marker key={i} position={cargo.position}>
            <Popup>
              <div className="text-black p-1 min-w-[150px]">
                <div className="font-bold border-b pb-1 mb-1">{cargo.name}</div>
                <div className="text-xs text-gray-600">{cargo.location}</div>
                <div className={`text-xs font-bold mt-2 ${cargo.priority === 'CRITICAL' ? 'text-red-600' : 'text-blue-600'}`}>
                  PRIORITY: {cargo.priority}
                </div>
                {trafficData?.delay > 0 && (
                  <div className="text-[10px] text-red-500 mt-1 animate-pulse">
                    ⚠️ SEATTLE TRAFFIC DELAY: +{trafficData.delay} min
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}