import { NextResponse } from 'next/server';

type OverpassElement = {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type GymResult = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  distanceKm: number;
  osmUrl: string;
};

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

function toNumber(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildAddress(tags: Record<string, string> | undefined): string {
  if (!tags) return 'Address not available';

  const street = tags['addr:street'] || '';
  const city = tags['addr:city'] || tags['addr:town'] || tags['addr:village'] || '';
  const postcode = tags['addr:postcode'] || '';

  const line = [street, city, postcode].filter(Boolean).join(', ');
  return line || 'Address not available';
}

async function fetchFromOverpassWithFallback(query: string): Promise<{ elements?: OverpassElement[] }> {
  let lastError: unknown = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Accept': 'application/json',
          'User-Agent': '1fit-gym-app/1.0',
        },
        body: query,
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        lastError = new Error(`Overpass ${endpoint} responded ${response.status}`);
        continue;
      }

      const data = (await response.json()) as { elements?: OverpassElement[] };
      return data;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All Overpass endpoints failed');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = toNumber(searchParams.get('lat'));
  const lon = toNumber(searchParams.get('lon'));
  const radiusParam = toNumber(searchParams.get('radius'));
  const radius = radiusParam && radiusParam > 0 ? Math.min(radiusParam, 10000) : 5000;

  if (lat === null || lon === null || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const overpassQuery = `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lon})[leisure=fitness_centre];
  node(around:${radius},${lat},${lon})[amenity=gym];
  node(around:${radius},${lat},${lon})[club=sport][sport=fitness];
  way(around:${radius},${lat},${lon})[leisure=fitness_centre];
  way(around:${radius},${lat},${lon})[amenity=gym];
  relation(around:${radius},${lat},${lon})[leisure=fitness_centre];
  relation(around:${radius},${lat},${lon})[amenity=gym];
);
out center tags;
`;

  try {
    const data = await fetchFromOverpassWithFallback(overpassQuery);
    const elements = data.elements ?? [];

    const gyms = elements
      .map((el) => {
        const latValue = el.lat ?? el.center?.lat;
        const lonValue = el.lon ?? el.center?.lon;

        if (latValue === undefined || lonValue === undefined) return null;

        const distanceKm = haversineKm(lat, lon, latValue, lonValue);
        const name = el.tags?.name || 'Gym';

        return {
          id: `${el.type}-${el.id}`,
          name,
          lat: latValue,
          lon: lonValue,
          address: buildAddress(el.tags),
          distanceKm: Number(distanceKm.toFixed(2)),
          osmUrl: `https://www.openstreetmap.org/?mlat=${latValue}&mlon=${lonValue}#map=16/${latValue}/${lonValue}`,
        } satisfies GymResult;
      })
      .filter((gym): gym is GymResult => Boolean(gym))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 12);

    return NextResponse.json({ gyms, source: 'overpass' });
  } catch {
    // Keep UX responsive even if upstream map providers are down.
    return NextResponse.json({ gyms: [], warning: 'Nearby gym providers are temporarily unavailable' });
  }
}
