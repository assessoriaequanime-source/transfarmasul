/**
 * Botão para Teste Analítico
 * Gera dados aleatórios com base em cidades DDD 047 SC
 */

import { Zap } from "lucide-react";
import { Button } from "../ui/button";
import { generateTestAnalyticData, convertTestDataToDashboardFormat } from "../../lib/random-test-data";
import { DashboardState } from "../../lib/dashboard-data";

interface TestAnalyticButtonProps {
  onDataGenerated: (data: Partial<DashboardState>) => void;
  disabled?: boolean;
}

export function TestAnalyticButton({ onDataGenerated, disabled }: TestAnalyticButtonProps) {
  const handleClick = () => {
    // Gera dados aleatórios
    const testData = generateTestAnalyticData();
    const formatted = convertTestDataToDashboardFormat(testData);

    // Converte para formato do dashboard
    const dashboardData: Partial<DashboardState> = {
      vehicles: formatted.veiculos.map((v) => ({
        placa: v.placa,
        modelo: v.modelo,
        capacidade: v.capacidade,
        manutencao: v.manutencao,
      })),
      suppliers: formatted.fornecedores.map((f) => ({
        nome: f.nome,
        contato: f.contato,
        dias_entrega: f.dias_entrega,
        confiabilidade: f.confiabilidade,
        sla: f.confiabilidade,
      })),
      routes: formatted.rotas.map((r) => ({
        id: r.id,
        origem: r.origem,
        destino: r.destino,
        distancia: r.distancia,
        custo_km: r.custo_km,
        salario_motorista: r.custo_km * r.distancia * 0.15, // 15% do custo para salário
        pedagio: r.distancia * 0.5, // R$ 0.5 por km em pedágios
        combustivel: r.distancia * 0.1, // R$ 0.1 por km
        fuelLiters: Math.round(r.distancia / 5), // ~5km/litro
        status: r.status as "planejada" | "em_execução" | "concluída",
      })),
      kpiMetrics: {
        ocupacao_media: formatted.indicadores.ocupacao_media,
        atraso_medio: formatted.indicadores.atraso_medio,
        custo_total: formatted.indicadores.custo_total,
        entregas_no_prazo: formatted.indicadores.entregas_no_prazo,
      },
    };

    // Chama callback com os dados
    onDataGenerated(dashboardData);

    // Salva no localStorage
    localStorage.setItem(
      "transfarmasul_dashboard_v1",
      JSON.stringify(dashboardData)
    );

    // Feedback ao usuário
    alert(`✅ Teste Analítico Gerado!\n\n${testData.veiculos.length} veículos\n${testData.fornecedores.length} fornecedores\n${testData.rotas.length} rotas\n\nDados carregados no dashboard.`);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
    >
      <Zap size={16} />
      Teste Analítico
    </Button>
  );
}
