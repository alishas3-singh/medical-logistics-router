'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Vehicle Icon (Ambulance/Drone)
const vehicleIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Location pin or ambulance icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

export default function MapView({ trafficData }: any) {
  const [mounted, setMounted] = useState(false);
  const [vehiclePos, setVehiclePos] = useState<[number, number]>([47.6062, -122.3321]);

  // 1. Mission Data (The "Cargo")
  const missions = [
    { id: '702', pos: [47.6044, -122.3241], name: 'Heart Transplant', hub: 'Harborview' },
    { id: '401', pos: [47.6501, -122.3066], name: 'Type O- Blood', hub: 'UW Medicine' },
  ];

  // 2. Simulate Vehicle Movement (The "Live" part)
  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePos(prev => [prev[0] + 0.0001, prev[1] + 0.0001]); // Slow movement NE
    }, 3000);
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
      <MapContainer center={[47.6062, -122.3321]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; CARTO' url={mapTileUrl} />
        
        {/* LIVE VEHICLE MARKER */}
        <Marker position={vehiclePos} icon={vehicleIcon}>
          <Popup>
            <div className="font-bold text-blue-600">MED-V1 (In Transit)</div>
            <div className="text-[10px]">Speed: 24mph | Alt: 120ft</div>
          </Popup>
        </Marker>

        {/* CARGO DESTINATIONS */}
        {missions.map((m) => (
          <Marker key={m.id} position={m.pos as [number, number]}>
            <Popup>
              <div className="text-black">
                <div className="font-bold">Mission #{m.id}</div>
                <div className="text-xs">{m.name}</div>
                <div className="text-[10px] text-red-500 font-bold mt-1">
                   Delay: +{trafficData?.delay || 0} min
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* PROPOSED ROUTE LINE */}
        <Polyline positions={[vehiclePos, [47.6044, -122.3241]]} color="#00f5ff" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
}