// Minimal Chicagoland zip -> (lat, lon).
// Add more zips over time as you expand coverage.
const ZIP_TO_LATLON: Record<string, { lat: number; lon: number }> = {
  "60610": { lat: 41.9046, lon: -87.6337 }, // Near North
  "60614": { lat: 41.9227, lon: -87.6533 }, // Lincoln Park-ish
  "60657": { lat: 41.9398, lon: -87.6566 }, // Lakeview-ish
  "60640": { lat: 41.9710, lon: -87.6625 }, // Uptown-ish
  "60611": { lat: 41.8949, lon: -87.6206 }, // Streeterville-ish
  "60601": { lat: 41.8853, lon: -87.6229 }, // Loop-ish
  "60201": { lat: 42.0565, lon: -87.6886 }, // Evanston
};

// Haversine distance in miles
function haversineMiles(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 3958.8; // Earth radius in miles
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export function milesBetweenZips(zipA: string, zipB: string): number | null {
  const a = ZIP_TO_LATLON[zipA];
  const b = ZIP_TO_LATLON[zipB];
  if (!a || !b) return null;
  return haversineMiles(a, b);
}

export function hasZipGeo(zip: string) {
  return Boolean(ZIP_TO_LATLON[zip]);
}
