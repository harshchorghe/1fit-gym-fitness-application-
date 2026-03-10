'use client';

import { useMemo, useState } from 'react';

type Gym = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  distanceKm: number;
  osmUrl: string;
};

function buildBbox(lat: number, lon: number): string {
  const latDelta = 0.045;
  const lonDelta = 0.06;
  const left = (lon - lonDelta).toFixed(6);
  const bottom = (lat - latDelta).toFixed(6);
  const right = (lon + lonDelta).toFixed(6);
  const top = (lat + latDelta).toFixed(6);
  return `${left},${bottom},${right},${top}`;
}

export default function NearbyGymsMap() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const mapEmbedUrl = useMemo(() => {
    if (!coords) return null;

    const bbox = buildBbox(coords.lat, coords.lon);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`;
  }, [coords]);

  const loadNearbyGyms = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported in this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });

          const response = await fetch(`/api/nearby-gyms?lat=${lat}&lon=${lon}&radius=10000`);
          if (!response.ok) {
            throw new Error('Nearby gyms could not be loaded right now.');
          }

          const data = (await response.json()) as { gyms?: Gym[] };
          setGyms(Array.isArray(data.gyms) ? data.gyms : []);
        } catch {
          setError('Could not load nearby gyms. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location permission denied. Enable location to see nearby gyms.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 animate-slide-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            NEARBY <span className="text-red-500">GYMS</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Powered by OpenStreetMap (free). Your location is used only for this search and is not stored.
          </p>
        </div>

        <button
          onClick={loadNearbyGyms}
          disabled={loading}
          className={`px-5 py-3 rounded-xl font-semibold transition-colors ${
            loading
              ? 'bg-gray-700 cursor-wait'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? 'Finding gyms...' : 'Use My Location'}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      {mapEmbedUrl && (
        <div className="mt-6 space-y-5">
          <div className="overflow-hidden rounded-xl border border-gray-800 h-[300px] md:h-[360px]">
            <iframe
              title="Nearby gyms map"
              src={mapEmbedUrl}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {gyms.length === 0 ? (
            <p className="text-gray-400 text-sm">No gyms found within 10 km from your location.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gyms.map((gym) => (
                <article key={gym.id} className="bg-black/50 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{gym.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{gym.address}</p>
                    </div>
                    <span className="text-red-400 font-semibold text-sm whitespace-nowrap">
                      {gym.distanceKm} km
                    </span>
                  </div>
                  <a
                    href={gym.osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-red-400 hover:text-red-300"
                  >
                    Open in map
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
