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

export interface MapOffice {
  /** Office / location name as shown in the marker popup. */
  name: string;
  /** Short locality line, e.g. "London, United Kingdom". */
  locality?: string;
  /** [latitude, longitude] */
  position: [number, number];
}

interface MapProps {
  /**
   * Offices to plot. Sourced from the `Location` CMS entity once
   * `/locations` ships; until then the map renders the global delivery view
   * with no markers rather than a placeholder office.
   */
  offices?: MapOffice[];
}

/** Global view framing TeamBees' six regions when no offices are supplied. */
const GLOBAL_VIEW = { center: [30, 5] as [number, number], zoom: 2 };
const OFFICE_VIEW_ZOOM = 11;

export default function Map({ offices = [] }: MapProps) {
  const [first] = offices;
  const center = first ? first.position : GLOBAL_VIEW.center;
  const zoom = first ? (offices.length > 1 ? 3 : OFFICE_VIEW_ZOOM) : GLOBAL_VIEW.zoom;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-full min-h-[400px] z-0"
      style={{ borderRadius: "2rem", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {offices.map((office) => (
        <Marker key={office.name} position={office.position} icon={icon}>
          <Popup>
            <div className="font-sans">
              <b className="text-black text-sm">{office.name}</b>
              {office.locality && (
                <>
                  <br />
                  <span className="text-gray-600 text-xs">{office.locality}</span>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
