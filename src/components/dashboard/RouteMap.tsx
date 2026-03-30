import { useState, useEffect, useRef } from "react";
import { Map, Focus } from "lucide-react";
import type { Route } from "@/lib/dashboard-data";
import "leaflet/dist/leaflet.css";

interface Props {
  routes: Route[];
}

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
  "são josé": [-27.6136, -48.6366],
  "brusque": [-27.0979, -48.9174],
  "são bento do sul": [-26.2504, -49.3787],
  "canoinhas": [-26.1773, -50.3908],
  "mafra": [-26.1115, -49.8057],
  "rio do sul": [-27.2141, -49.6432],
  "caçador": [-26.7753, -51.0122],
  "concórdia": [-27.2342, -52.0277],
  "xanxerê": [-26.8748, -52.4036],
  "araranguá": [-28.9353, -49.4862],
  "içara": [-28.7133, -49.3009],
};

function getCityName(location: string): string {
  return location.split(",")[0].trim().toLowerCase();
}

function getCoords(location: string): [number, number] | null {
  return CITY_COORDS[getCityName(location)] || null;
}

const ROUTE_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

export default function RouteMap({ routes }: Props) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  const focusRoute = (id: string) => {
    setFocusedId((prev) => (prev === id ? null : id));
  };

  // Initialize Leaflet map
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || leafletMapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [-27.5954, -49.3],
        zoom: 7,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map);

      leafletMapRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    }

    init();
    return () => {
      cancelled = true;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Draw ALL routes, highlight focused
  useEffect(() => {
    async function update() {
      const L = (await import("leaflet")).default;
      const map = leafletMapRef.current;
      if (!map) return;

      layersRef.current.forEach((layer) => map.removeLayer(layer));
      layersRef.current = [];

      const allPoints: [number, number][] = [];

      routes.forEach((r, i) => {
        const origin = getCoords(r.origin);
        const dest = getCoords(r.destination);
        const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
        const isFocused = focusedId === r.id;
        const opacity = focusedId ? (isFocused ? 1 : 0.25) : 0.85;
        const weight = isFocused ? 5 : 3;

        if (origin) {
          const marker = L.circleMarker([origin[0], origin[1]], {
            radius: isFocused ? 10 : 7,
            fillColor: color,
            color: "#fff",
            weight: 2,
            fillOpacity: opacity,
          }).addTo(map).bindPopup(`<b>Origem:</b> ${r.origin}`);
          layersRef.current.push(marker);
          allPoints.push(origin);
        }

        if (dest) {
          const marker = L.circleMarker([dest[0], dest[1]], {
            radius: isFocused ? 10 : 7,
            fillColor: color,
            color: "#fff",
            weight: 2,
            fillOpacity: opacity,
          }).addTo(map).bindPopup(`<b>Destino:</b> ${r.destination}`);
          layersRef.current.push(marker);
          allPoints.push(dest);
        }

        if (origin && dest) {
          const line = L.polyline(
            [[origin[0], origin[1]], [dest[0], dest[1]]],
            { color, weight, dashArray: "8, 6", opacity }
          ).addTo(map);
          line.bindPopup(`<b>${r.origin} → ${r.destination}</b><br/>${r.distanceKm} km`);
          layersRef.current.push(line);
        }
      });

      // Focus on specific route or fit all
      if (focusedId) {
        const focused = routes.find((r) => r.id === focusedId);
        if (focused) {
          const pts: [number, number][] = [];
          const o = getCoords(focused.origin);
          const d = getCoords(focused.destination);
          if (o) pts.push(o);
          if (d) pts.push(d);
          if (pts.length > 0) {
            map.fitBounds(pts, { padding: [60, 60], maxZoom: 10 });
          }
        }
      } else if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [40, 40], maxZoom: 10 });
      }
    }

    update();
  }, [focusedId, routes]);

  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-2 mb-1">
        <Map className="w-5 h-5 text-accent" />
        <h2 className="section-title">Mapa de operações</h2>
      </div>
      <p className="section-desc mb-4">
        Todas as rotas são exibidas. Clique em uma para dar foco e centralizar no mapa.
      </p>

      <div ref={mapRef} className="rounded-2xl overflow-hidden border border-border relative z-0" style={{ height: 420 }} />

      {routes.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {routes.map((r, i) => {
            const focused = focusedId === r.id;
            const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
            return (
              <button
                key={r.id}
                onClick={() => focusRoute(r.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-left transition-all ${
                  focused
                    ? "ring-2 ring-accent bg-accent/10 border-accent shadow-sm"
                    : "bg-muted border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: color, borderColor: color }}
                  />
                  {focused && <Focus className="w-3.5 h-3.5 text-accent" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">
                    {r.origin} → {r.destination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.distanceKm} km · {r.fuelLiters.toFixed(1)} L
                  </p>
                </div>
              </button>
            );
          })}
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
