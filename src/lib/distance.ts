// Haversine distance in kilometers
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const TIERS = [
  { id: "economy", name: "AeroLite", tagline: "Smart & efficient", pricePerKm: 45, speed: "180 km/h", eta: 8 },
  { id: "premium", name: "AeroPlus", tagline: "Comfort & speed", pricePerKm: 85, speed: "240 km/h", eta: 5 },
  { id: "luxury", name: "AeroJet", tagline: "Ultimate experience", pricePerKm: 150, speed: "320 km/h", eta: 3 },
] as const;

export type TierId = typeof TIERS[number]["id"];
