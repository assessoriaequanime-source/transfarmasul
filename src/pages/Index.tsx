import { useState, useEffect, useCallback } from "react";
import { loadState, saveState, DEMO_DATA, type DashboardState } from "@/lib/dashboard-data";
import { BarChart3, Truck, Users, MapPin, ClipboardList, Layers } from "lucide-react";
import HeroSection from "@/components/dashboard/HeroSection";
import KPICards from "@/components/dashboard/KPICards";
import InvertedFunnel from "@/components/dashboard/InvertedFunnel";
import BICharts from "@/components/dashboard/BICharts";
import VehicleSection from "@/components/dashboard/VehicleSection";
import SupplierSection from "@/components/dashboard/SupplierSection";
import RouteSection from "@/components/dashboard/RouteSection";
import RouteMap from "@/components/dashboard/RouteMap";
import ReportsSection from "@/components/dashboard/ReportsSection";
import StrategicPlanningSection from "@/components/dashboard/StrategicPlanningSection";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import HelpBubble from "@/components/dashboard/HelpBubble";
import UtilityPanel from "@/components/dashboard/UtilityPanel";

export default function Index() {
  const [state, setState] = useState<DashboardState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((partial: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const seedDemo = () => setState(DEMO_DATA);
  const clearAll = () => setState({ vehicles: [], suppliers: [], routes: [], reports: [] });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transfarmasul_dashboard.json";
    a.click();
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 py-6 space-y-5">
      <HeroSection onSeedDemo={seedDemo} onClearAll={clearAll} onExportJson={exportJson} state={state} />

      {/* KPIs + Funil - always visible */}
      <div className="dashboard-card">
        <h2 className="section-title mb-1">Resumo executivo</h2>
        <p className="section-desc mb-5">Leitura rápida da operação com KPIs e funil estratégico.</p>
        <KPICards state={state} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <InvertedFunnel state={state} />
        </div>
        <div className="lg:col-span-7">
          <CollapsibleSection icon={BarChart3} title="BI operacional" description="Painel analítico com hierarquia visual objetiva." defaultOpen>
            <BICharts state={state} />
          </CollapsibleSection>
        </div>
      </div>

      {/* Mapa */}
      <RouteMap routes={state.routes} />

      {/* Collapsible sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CollapsibleSection icon={Truck} title="Gestão de veículos" description="Cadastro, edição e consulta da frota.">
          <VehicleSection vehicles={state.vehicles} onChange={(vehicles) => update({ vehicles })} />
        </CollapsibleSection>
        <CollapsibleSection icon={Users} title="Gestão de fornecedores" description="Rede operacional, SLA e score.">
          <SupplierSection suppliers={state.suppliers} onChange={(suppliers) => update({ suppliers })} />
        </CollapsibleSection>
      </div>

      <CollapsibleSection icon={MapPin} title="Planejamento de rotas" description="Origem, destino, prioridade e cálculo automático.">
        <RouteSection routes={state.routes} vehicles={state.vehicles} onChange={(routes) => update({ routes })} />
      </CollapsibleSection>

      <CollapsibleSection icon={Layers} title="Planejamento estratégico organizacional" description="Três níveis: estratégico, tático e operacional — 5W2H e SWOT.">
        <StrategicPlanningSection />
      </CollapsibleSection>

      <CollapsibleSection icon={ClipboardList} title="Gestão de relatórios" description="Snapshots gerenciais com histórico e observações.">
        <ReportsSection reports={state.reports} state={state} onChange={(reports) => update({ reports })} />
      </CollapsibleSection>

      <div className="text-center py-6 space-y-1">
        <p className="text-xs text-muted-foreground">TransFarmaSul · Dashboard Analítico de estudos·</p>
        <p className="text-[10px] text-muted-foreground/60">BY DEV - Ana Cristina Alves Ferreira</p>
      </div>

      {/* Floating widgets */}
      <HelpBubble />
      <UtilityPanel />
    </div>
  );
}
