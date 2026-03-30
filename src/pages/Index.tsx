import { useState, useEffect, useCallback } from "react";
import { loadState, saveState, DEMO_DATA, type DashboardState } from "@/lib/dashboard-data";
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

      <div className="dashboard-card">
        <h2 className="section-title mb-1">Resumo executivo</h2>
        <p className="section-desc mb-5">Leitura rápida da operação com KPIs e funil estratégico.</p>
        <KPICards state={state} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <InvertedFunnel state={state} />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <BICharts state={state} />
        </div>
      </div>

      {/* Mapa de operações */}
      <RouteMap routes={state.routes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <VehicleSection vehicles={state.vehicles} onChange={(vehicles) => update({ vehicles })} />
        </div>
        <div className="space-y-5">
          <SupplierSection suppliers={state.suppliers} onChange={(suppliers) => update({ suppliers })} />
        </div>
      </div>

      <RouteSection routes={state.routes} vehicles={state.vehicles} onChange={(routes) => update({ routes })} />

      {/* Planejamento estratégico do documento */}
      <StrategicPlanningSection />

      <ReportsSection reports={state.reports} state={state} onChange={(reports) => update({ reports })} />

      <div className="text-center text-xs text-muted-foreground py-4">
        TransFarmaSul · Dashboard MVP · Criciúma, SC · Dados salvos localmente no navegador
      </div>
    </div>
  );
}
