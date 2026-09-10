"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default function Map() {
  // Using Gurugram coordinates based on Digital Bees' standard office address
  const position: [number, number] = [28.4111, 77.0425]; // Sector 48, Gurugram

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      className="w-full h-full min-h-[400px] z-0"
      style={{ borderRadius: "2rem", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          <div className="font-sans">
            <b className="text-black text-sm">The Digital Bees</b>
            <br />
            <span className="text-gray-600 text-xs">Sector 48, Gurugram, Haryana</span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
