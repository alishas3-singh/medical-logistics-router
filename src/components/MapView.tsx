'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard Marker Fix
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ weatherData }: any) {
  const [mounted, setMounted] = useState(false);

  // 1. Automated Day/Night Logic (No manual intervention)
  const mapTileUrl = useMemo(() => {
    const hour = new Date().getHours();
    const isDaylight = hour >= 6 && hour < 18; // 6 AM to 6 PM
    
    // Voyager is the "Google Maps" light style. Dark Matter is the night style.
    return isDaylight 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[47.6062, -122.3321]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={mapTileUrl}
        />
        
        {/* Seattle Markers */}
        <Marker position={[47.6044, -122.3241]}>
          <Popup>Harborview Medical Center (Critical Hub)</Popup>
        </Marker>
        <Marker position={[47.6501, -122.3066]}>
          <Popup>UW Medical Center</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}