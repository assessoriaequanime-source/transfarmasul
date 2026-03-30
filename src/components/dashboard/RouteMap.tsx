import { Map } from "lucide-react";
import type { Route } from "@/lib/dashboard-data";

interface Props {
  routes: Route[];
}

// Coordinates for SC cities
const CITY_COORDS: Record<string, [number, number]> = {
  "criciúma": [-28.6775, -49.3697],
  "joinville": [-26.3045, -48.8487],
  "florianópolis": [-27.5954, -48.5480],
  "blumenau": [-26.9194, -49.0661],
  "palhoça": [-27.6453, -48.6684],
  "tubarão": [-28.4668, -49.0070],
  "lages": [-27.8159, -50.3264],
  "chapecó": [-27.1006, -52.6158],
  "itajaí": [-26.9078, -48.6616],
  "jaraguá do sul": [-26.4851, -49.0685],
};

function getCityName(location: string): string {
  return location.split(",")[0].trim().toLowerCase();
}

function getMapUrl(routes: Route[]): string {
  // Center on SC
  let centerLat = -27.5954;
  let centerLon = -49.3;
  let zoom = 7;

  const markers: string[] = [];
  const uniqueCities = new Set<string>();

  routes.forEach((r) => {
    const originCity = getCityName(r.origin);
    const destCity = getCityName(r.destination);
    
    if (CITY_COORDS[originCity] && !uniqueCities.has(originCity)) {
      uniqueCities.add(originCity);
      const [lat, lon] = CITY_COORDS[originCity];
      markers.push(`${lat},${lon}`);
    }
    if (CITY_COORDS[destCity] && !uniqueCities.has(destCity)) {
      uniqueCities.add(destCity);
      const [lat, lon] = CITY_COORDS[destCity];
      markers.push(`${lat},${lon}`);
    }
  });

  if (markers.length > 0) {
    const allCoords = markers.map(m => m.split(",").map(Number));
    centerLat = allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length;
    centerLon = allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length;
  }

  // Use OpenStreetMap embed
  const bbox = `${centerLon - 2.5},${centerLat - 2},${centerLon + 2.5},${centerLat + 2}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
}

export default function RouteMap({ routes }: Props) {
  const mapUrl = getMapUrl(routes);

  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-2 mb-1">
        <Map className="w-5 h-5 text-accent" />
        <h2 className="section-title">Mapa de operações</h2>
      </div>
      <p className="section-desc mb-4">Visualização geográfica da área de atuação em Santa Catarina.</p>

      <div className="rounded-2xl overflow-hidden border border-border relative" style={{ height: 400 }}>
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de rotas TransFarmaSul"
        />
      </div>

      {routes.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {routes.map((r) => (
            <div key={r.id} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border">
              <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{r.origin} → {r.destination}</p>
                <p className="text-xs text-muted-foreground">{r.distanceKm} km · {r.fuelLiters.toFixed(1)} L</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {routes.length === 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground py-4">
          Cadastre rotas para visualizar os pontos no mapa.
        </div>
      )}
    </div>
  );
}
