export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  capacity: number;
  efficiency: number;
  status: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  city: string;
  sla: number;
  score: number;
  status: string;
}

export interface Route {
  id: string;
  name: string;
  vehicleId: string;
  vehicleLabel: string;
  origin: string;
  destination: string;
  priority: string;
  deadline: string;
  deliveries: number;
  notes: string;
  distanceKm: number;
  durationH: number;
  fuelLiters: number;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  owner: string;
  notes: string;
  createdAt: string;
  snapshot: {
    fleet: number;
    suppliers: number;
    routes: number;
    fuelLiters: string;
    onTime: number;
  };
}

export interface DashboardState {
  vehicles: Vehicle[];
  suppliers: Supplier[];
  routes: Route[];
  reports: Report[];
}

const STORAGE_KEY = 'transfarmasul_dashboard_v1';

export const uid = () => Math.random().toString(36).slice(2, 10);
export const nowLabel = () => new Date().toLocaleString('pt-BR');

export function loadState(): DashboardState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { vehicles: [], suppliers: [], routes: [], reports: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      vehicles: parsed.vehicles || [],
      suppliers: parsed.suppliers || [],
      routes: parsed.routes || [],
      reports: parsed.reports || [],
    };
  } catch {
    return { vehicles: [], suppliers: [], routes: [], reports: [] };
  }
}

export function saveState(state: DashboardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getStatusClass(status: string): 'ok' | 'warn' | 'danger' {
  const norm = status.toLowerCase();
  if (/ativo|ok/.test(norm)) return 'ok';
  if (/manuten|crítico|atras/.test(norm)) return 'danger';
  return 'warn';
}

export const DEMO_DATA: DashboardState = {
  vehicles: [
    { id: uid(), plate: "RXT3F21", model: "Mercedes Atego 1719", type: "Truck", capacity: 14000, efficiency: 3.1, status: "ativo" },
    { id: uid(), plate: "QHY8B44", model: "VW Delivery 11.180", type: "Toco", capacity: 11000, efficiency: 3.5, status: "ativo" },
    { id: uid(), plate: "RLR7A09", model: "Iveco Tector 9-190", type: "Toco", capacity: 9000, efficiency: 3.8, status: "ativo" },
    { id: uid(), plate: "QJA4C88", model: "Mercedes Accelo 1016", type: "3/4", capacity: 6000, efficiency: 4.2, status: "manutenção" },
    { id: uid(), plate: "RNU1D55", model: "Ford Cargo 816", type: "VUC", capacity: 4500, efficiency: 4.6, status: "reserva" },
  ],
  suppliers: [
    { id: uid(), name: "Laboratório Alfa", category: "Farmacêutico", city: "Criciúma", sla: 97, score: 9.1, status: "ativo" },
    { id: uid(), name: "BioMed Sul", category: "Farmacêutico", city: "Joinville", sla: 94, score: 8.5, status: "ativo" },
    { id: uid(), name: "Posto Catarinense", category: "Combustível", city: "Palhoça", sla: 92, score: 8.0, status: "em avaliação" },
    { id: uid(), name: "Tech RFID SC", category: "Embalagem", city: "Blumenau", sla: 89, score: 7.6, status: "crítico" },
  ],
  routes: [
    { id: uid(), name: "Criciúma → Joinville", vehicleId: "", vehicleLabel: "RXT3F21 · Mercedes Atego 1719", origin: "Criciúma, SC", destination: "Joinville, SC", priority: "alta", deadline: "Hoje", deliveries: 4, notes: "Cluster farmacêutico", distanceKm: 390, durationH: 6.4, fuelLiters: 125.8, createdAt: nowLabel() },
    { id: uid(), name: "Criciúma → Florianópolis", vehicleId: "", vehicleLabel: "QHY8B44 · VW Delivery 11.180", origin: "Criciúma, SC", destination: "Florianópolis, SC", priority: "média", deadline: "Amanhã", deliveries: 3, notes: "Reabastecimento regional", distanceKm: 210, durationH: 3.2, fuelLiters: 60, createdAt: nowLabel() },
  ],
  reports: [],
};
