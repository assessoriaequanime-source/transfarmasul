// Academic report and professor test management
import { uid } from "./dashboard-data";

export interface AcademicReport {
  id: string;
  studentName: string;
  studentId: string;
  signature: string; // base64 data URL
  createdAt: string;
  vision: "operacional" | "aprendizagem";
  testId?: string; // associated test
  preReport: {
    bottleneck: string;
    proposedAction: string;
    kpiIndicator: string;
    expectedLearning: string;
  };
  dashboardSnapshot: any;
  swotSnapshot: any;
  status: "pendente" | "avaliado";
  evaluation?: {
    strengths: string;
    improvements: string;
    grade: number;
    suggestion: string;
    observation: string;
    evaluatedAt: string;
  };
}

export interface ProfessorTest {
  id: string;
  title: string;
  description: string;
  deadline: string;
  scenarioType: "aleatorio" | "fixo";
  createdAt: string;
  active: boolean;
}

const REPORTS_KEY = "relatorios";
const TESTS_KEY = "testes";

export function loadReports(): AcademicReport[] {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch { return []; }
}

export function saveReports(reports: AcademicReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function loadTests(): ProfessorTest[] {
  try {
    return JSON.parse(localStorage.getItem(TESTS_KEY) || "[]");
  } catch { return []; }
}

export function saveTests(tests: ProfessorTest[]) {
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
}

export function generateReportId(): string {
  return `rel_${uid()}${uid()}`;
}

// Random data generation for "Teste Analítico"
const MODELS = [
  "Mercedes Atego 1719", "VW Delivery 11.180", "Iveco Tector 9-190",
  "Mercedes Accelo 1016", "Ford Cargo 816", "Scania P250", "Volvo VM 270",
  "DAF CF 85", "MAN TGX 29.480", "Hyundai HR"
];
const TYPES = ["Toco", "Truck", "VUC", "3/4", "Bi-Truck"];
const STATUSES = ["ativo", "ativo", "ativo", "manutenção", "reserva"];
const SUPPLIER_NAMES = [
  "Laboratório Alfa", "BioMed Sul", "Farma Distribuidora", "Drogaria Central",
  "Químicos Catarinense", "MedSupply SC", "PharmaLog Sul", "HealthCare SC",
  "BioTech Joinville", "MedTransp Blumenau"
];
const CATEGORIES = ["Farmacêutico", "Embalagem", "Manutenção", "Combustível"];
const CITIES_SC = [
  "Blumenau, SC",
  "Brusque, SC",
  "Camboriú, SC",
  "Ilhota, SC",
  "Itajaí, SC",
  "Luiz Alves, SC",
  "Navegantes, SC",
  "Penha, SC",
  "Piçarras, SC",
  "Tijucas, SC"
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randF(min: number, max: number, dec = 1) {
  return +(min + Math.random() * (max - min)).toFixed(dec);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomPlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l = () => letters[rand(0, 25)];
  const n = () => String(rand(0, 9));
  return `${l()}${l()}${l()}${n()}${l()}${n()}${n()}`;
}

export function generateRandomData() {
  const numVehicles = rand(3, 8);
  const vehicles = Array.from({ length: numVehicles }, () => ({
    id: uid(),
    plate: randomPlate(),
    model: pick(MODELS),
    type: pick(TYPES),
    capacity: rand(4000, 16000),
    efficiency: randF(2.5, 5.0),
    status: pick(STATUSES),
  }));

  const numSuppliers = rand(3, 7);
  const usedNames = new Set<string>();
  const suppliers = Array.from({ length: numSuppliers }, () => {
    let name = pick(SUPPLIER_NAMES);
    while (usedNames.has(name)) name = pick(SUPPLIER_NAMES);
    usedNames.add(name);
    return {
      id: uid(),
      name,
      category: pick(CATEGORIES),
      city: pick(CITIES_SC).split(",")[0],
      sla: rand(70, 99),
      score: randF(5.0, 10.0),
      status: pick(["ativo", "ativo", "em avaliação", "crítico"]),
    };
  });

  const numRoutes = 5;
  const routes = Array.from({ length: numRoutes }, () => {
    const origin = pick(CITIES_SC);
    let destination = pick(CITIES_SC);
    while (destination === origin) destination = pick(CITIES_SC);
    const distanceKm = rand(50, 450);
    const vehicle = pick(vehicles);
    const fuelLiters = +(distanceKm / vehicle.efficiency).toFixed(1);
    const durationH = +(distanceKm / rand(55, 75)).toFixed(1);
    return {
      id: uid(),
      name: `${origin.split(",")[0]} → ${destination.split(",")[0]}`,
      vehicleId: vehicle.id,
      vehicleLabel: `${vehicle.plate} · ${vehicle.model}`,
      origin,
      destination,
      priority: pick(["alta", "média", "baixa"]),
      deadline: pick(["Hoje", "Amanhã", "48h", "72h"]),
      deliveries: rand(1, 8),
      notes: pick(["Carga farmacêutica", "Entrega urgente", "Reabastecimento", "Insumos diversos", ""]),
      distanceKm,
      durationH,
      fuelLiters,
      createdAt: new Date().toLocaleString("pt-BR"),
    };
  });

  return { vehicles, suppliers, routes, reports: [] };
}
