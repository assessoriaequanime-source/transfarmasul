/**
 * Gerador de dados aleatórios para Teste Analítico
 * Simula cenários realistas de logística
 */

import { getRandomRouteFromTo, calculateDistance } from "./ddd-047-cities";

export interface TestVehicle {
  placa: string;
  modelo: string;
  capacidade: number;
  status: "disponível" | "manutenção" | "em_rota";
}

export interface TestSupplier {
  nome: string;
  contato: string;
  tempo_entrega: number; // em dias
  confiabilidade: number; // 0-100%
}

export interface TestRoute {
  id: string;
  origem: string;
  destino: string;
  distancia: number; // em km
  custo_km: number; // em R$
  atraso_previsto: number; // em %
  status: "planejada" | "em_execução" | "concluída";
}

export interface TestAnalyticData {
  timestamp: string;
  veiculos: TestVehicle[];
  fornecedores: TestSupplier[];
  rotas: TestRoute[];
  kpi: {
    ocupacao_media: number;
    atraso_medio: number;
    custo_total: number;
    entregas_no_prazo: number;
  };
}

/**
 * Gera uma placa de veículo realista
 */
function generatePlaca(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let placa = "";
  for (let i = 0; i < 3; i++) {
    placa += letters[Math.floor(Math.random() * letters.length)];
  }
  placa += "-";
  for (let i = 0; i < 4; i++) {
    placa += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return placa;
}

/**
 * Gera veículos aleatórios (3-8)
 */
function generateVehicles(count: number): TestVehicle[] {
  const modelos = [
    "Volvo FH 540",
    "Scania R 450",
    "Mercedes Actros",
    "Iveco Stralis",
    "DAF XF 510",
  ];
  
  const statuses: ("disponível" | "manutenção" | "em_rota")[] = [
    "disponível",
    "manutenção",
    "em_rota",
  ];

  return Array.from({ length: count }, () => ({
    placa: generatePlaca(),
    modelo: modelos[Math.floor(Math.random() * modelos.length)],
    capacidade: 5000 + Math.random() * 25000, // 5-30 toneladas
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
}

/**
 * Gera fornecedores aleatórios (3-7)
 */
function generateSuppliers(count: number): TestSupplier[] {
  const empresas = [
    "Distribuidora Vale",
    "Logística Brasil",
    "Transportes Sul",
    "Cargas Catarinense",
    "Express Delivery",
    "Logint Soluções",
    "Transportadora Nacional",
  ];

  return Array.from({ length: count }, () => ({
    nome: empresas[Math.floor(Math.random() * empresas.length)],
    contato: Math.random().toString().slice(2, 11),
    tempo_entrega: Math.floor(Math.random() * 7) + 1, // 1-7 dias
    confiabilidade: 70 + Math.random() * 30, // 70-100%
  }));
}

/**
 * Gera rotas aleatórias (5 rotas com cidades DDD 047)
 */
function generateRoutes(count: number): TestRoute[] {
  return Array.from({ length: count }, (_, i) => {
    const { from, to } = getRandomRouteFromTo();
    const distancia = calculateDistance(from, to);
    
    return {
      id: `rota_${Date.now()}_${i}`,
      origem: from.name,
      destino: to.name,
      distancia: Math.round(distancia),
      custo_km: 2.5 + Math.random() * 2.5, // R$ 2.5-5.0 por km
      atraso_previsto: Math.random() * 35, // 0-35%
      status: ["planejada", "em_execução", "concluída"][
        Math.floor(Math.random() * 3)
      ] as "planejada" | "em_execução" | "concluída",
    };
  });
}

/**
 * Calcula KPIs do cenário aleatório
 */
function calculateKPIs(
  vehicles: TestVehicle[],
  routes: TestRoute[]
): TestAnalyticData["kpi"] {
  const occupied = vehicles.filter((v) => v.status === "em_rota").length;
  const ocupacao_media = (occupied / vehicles.length) * 100;
  
  const atraso_medio = routes.reduce((acc, r) => acc + r.atraso_previsto, 0) / routes.length;
  
  const custo_total = routes.reduce(
    (acc, r) => acc + r.distancia * r.custo_km,
    0
  );
  
  const entregas_no_prazo = routes.filter((r) => r.atraso_previsto < 10)
    .length;

  return {
    ocupacao_media: Math.round(ocupacao_media * 100) / 100,
    atraso_medio: Math.round(atraso_medio * 100) / 100,
    custo_total: Math.round(custo_total * 100) / 100,
    entregas_no_prazo,
  };
}

/**
 * Gera um cenário completo de Teste Analítico
 */
export function generateTestAnalyticData(): TestAnalyticData {
  const vehicleCount = 3 + Math.floor(Math.random() * 6); // 3-8
  const supplierCount = 3 + Math.floor(Math.random() * 5); // 3-7
  const routeCount = 5; // sempre 5 rotas

  const veiculos = generateVehicles(vehicleCount);
  const fornecedores = generateSuppliers(supplierCount);
  const rotas = generateRoutes(routeCount);

  return {
    timestamp: new Date().toISOString(),
    veiculos,
    fornecedores,
    rotas,
    kpi: calculateKPIs(veiculos, rotas),
  };
}

/**
 * Converte dados do Teste Analítico para formato de dashboard
 */
export function convertTestDataToDashboardFormat(testData: TestAnalyticData) {
  return {
    veiculos: testData.veiculos.map((v) => ({
      placa: v.placa,
      modelo: v.modelo,
      capacidade: Math.round(v.capacidade),
      manutencao: v.status === "manutenção",
    })),
    fornecedores: testData.fornecedores.map((f) => ({
      nome: f.nome,
      contato: f.contato,
      dias_entrega: f.tempo_entrega,
      confiabilidade: Math.round(f.confiabilidade),
    })),
    rotas: testData.rotas.map((r) => ({
      id: r.id,
      origem: r.origem,
      destino: r.destino,
      distancia: r.distancia,
      custo_km: Math.round(r.custo_km * 100) / 100,
      atraso_previsto: Math.round(r.atraso_previsto),
      status: r.status,
    })),
    indicadores: {
      ocupacao_media: testData.kpi.ocupacao_media,
      atraso_medio: testData.kpi.atraso_medio,
      custo_total: testData.kpi.custo_total,
      entregas_no_prazo: testData.kpi.entregas_no_prazo,
    },
  };
}
