'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  weatherData?: {
    temperature: number;
    condition: string;
    windSpeed: number;
  };
  trafficData?: {
    congestion: number;
    delay: number;
  };
}

function MapUpdater({ weatherData, trafficData }: MapViewProps) {
  const map = useMap();
  
  useEffect(() => {
    if (weatherData || trafficData) {
      map.invalidateSize();
    }
  }, [map, weatherData, trafficData]);

  return null;
}

export default function MapView({ weatherData, trafficData }: MapViewProps) {
  const [mounted, setMounted] = useState(false);
  
  // Seattle coordinates
  const seattleCenter: LatLngExpression = [47.6062, -122.3321];
  
  // Sample cargo locations
  const cargoLocations = [
    { position: [47.6062, -122.3321] as LatLngExpression, name: 'Cargo #001', status: 'In Transit' },
    { position: [47.6097, -122.3331] as LatLngExpression, name: 'Cargo #002', status: 'Delayed' },
    { position: [47.6025, -122.3291] as LatLngExpression, name: 'Cargo #003', status: 'On Route' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00f5ff]">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={seattleCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="dark-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater weatherData={weatherData} trafficData={trafficData} />
        
        {cargoLocations.map((cargo, index) => (
          <Marker key={index} position={cargo.position}>
            <Popup>
              <div className="text-black">
                <div className="font-semibold">{cargo.name}</div>
                <div className="text-sm text-gray-600">{cargo.status}</div>
                {weatherData && (
                  <div className="text-xs mt-1 text-gray-500">
                    Temp: {weatherData.temperature}°C
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
