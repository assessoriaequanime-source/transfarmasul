import { Truck, Users, MapPin, Fuel, Clock } from "lucide-react";
import type { DashboardState } from "@/lib/dashboard-data";

interface Props {
  state: DashboardState;
}

export default function KPICards({ state }: Props) {
  const totalFuel = state.routes.reduce((s, r) => s + r.fuelLiters, 0);
  const avgSla = state.suppliers.length
    ? Math.round(state.suppliers.reduce((s, sup) => s + sup.sla, 0) / state.suppliers.length)
    : 0;

  const kpis = [
    { icon: Truck, label: "Frota cadastrada", value: state.vehicles.length, sub: "veículos na base" },
    { icon: Users, label: "Fornecedores", value: state.suppliers.length, sub: "ativos e avaliados" },
    { icon: MapPin, label: "Rotas planejadas", value: state.routes.length, sub: "cadastros consolidados" },
    { icon: Fuel, label: "Consumo estimado", value: `${totalFuel.toFixed(1)} L`, sub: "com base nas rotas" },
    { icon: Clock, label: "Pontualidade simulada", value: `${avgSla}%`, sub: "proxy para gestão diária" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="dashboard-card">
          <div className="flex items-center gap-2 kpi-label">
            <k.icon className="w-4 h-4" />
            {k.label}
          </div>
          <div className="kpi-value mt-2">{k.value}</div>
          <div className="kpi-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
