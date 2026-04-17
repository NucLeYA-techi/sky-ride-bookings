import { useEffect, useRef } from "react";
import L from "leaflet";

// Fix default marker icons (leaflet's default uses webpack-style URLs)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error - patching default icon options
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const startIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:oklch(0.85 0.2 195);border:3px solid white;box-shadow:0 0 16px oklch(0.85 0.2 195 / 0.9);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:oklch(0.72 0.22 305);border:3px solid white;box-shadow:0 0 16px oklch(0.72 0.22 305 / 0.9);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export interface LatLng {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  start: LatLng | null;
  end: LatLng | null;
  onPick: (point: LatLng) => void;
}

const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

export function MapPicker({ start, end, onPick }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: BENGALURU_CENTER,
      zoom: 12,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      onPickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers + line
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (start) {
      startMarkerRef.current = L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map);
    }

    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
    if (end) {
      endMarkerRef.current = L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map);
    }

    if (lineRef.current) {
      map.removeLayer(lineRef.current);
      lineRef.current = null;
    }
    if (start && end) {
      lineRef.current = L.polyline(
        [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ],
        { color: "#22d3ee", weight: 4, opacity: 0.9, dashArray: "10 10" }
      ).addTo(map);
      const bounds = L.latLngBounds([
        [start.lat, start.lng],
        [end.lat, end.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [start, end]);

  return <div ref={containerRef} className="h-full w-full rounded-xl overflow-hidden" />;
}
