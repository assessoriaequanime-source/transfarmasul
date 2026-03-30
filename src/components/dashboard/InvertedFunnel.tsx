import { TrendingUp, Truck, Users, MapPin, Clock } from "lucide-react";
import type { DashboardState } from "@/lib/dashboard-data";

interface Props {
  state: DashboardState;
}

export default function InvertedFunnel({ state }: Props) {
  const activeFleet = state.vehicles.filter((v) => v.status === "ativo").length;
  const totalFleet = state.vehicles.length;
  const avgSla = state.suppliers.length
    ? Math.round(state.suppliers.reduce((s, sup) => s + sup.sla, 0) / state.suppliers.length)
    : 0;
  const totalDeliveries = state.routes.reduce((s, r) => s + r.deliveries, 0);
  const totalKm = state.routes.reduce((s, r) => s + r.distanceKm, 0);

  const layers = [
    {
      icon: Clock,
      label: "Entregas no prazo",
      value: `${avgSla}%`,
      detail: "SLA médio dos fornecedores",
      pct: avgSla,
      color: "from-emerald-600 to-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      icon: MapPin,
      label: "Rotas planejadas",
      value: state.routes.length,
      detail: `${totalKm.toLocaleString("pt-BR")} km · ${totalDeliveries} entregas`,
      pct: Math.min(100, state.routes.length * 25),
      color: "from-blue-600 to-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      icon: Users,
      label: "Fornecedores monitorados",
      value: state.suppliers.length,
      detail: `Score médio: ${state.suppliers.length ? (state.suppliers.reduce((s, sup) => s + sup.score, 0) / state.suppliers.length).toFixed(1) : "0"}`,
      pct: Math.min(100, state.suppliers.length * 20),
      color: "from-violet-600 to-violet-500",
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
    {
      icon: Truck,
      label: "Capacidade ativa da frota",
      value: `${activeFleet}/${totalFleet}`,
      detail: `${totalFleet > 0 ? Math.round((activeFleet / totalFleet) * 100) : 0}% operacional`,
      pct: totalFleet > 0 ? Math.round((activeFleet / totalFleet) * 100) : 0,
      color: "from-primary to-accent",
      bg: "bg-secondary",
      text: "text-primary",
    },
  ];

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="section-title">Funil estratégico</h2>
      </div>
      <p className="section-desc mb-5">Da camada estratégica para a camada operacional acionável.</p>

      <div className="space-y-3">
        {layers.map((l, i) => (
          <div key={l.label} className="group">
            <div className={`rounded-2xl ${l.bg} border border-border p-4 transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${l.color} flex items-center justify-center`}>
                    <l.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className={`text-sm font-semibold ${l.text}`}>{l.label}</span>
                    <p className="text-xs text-muted-foreground">{l.detail}</p>
                  </div>
                </div>
                <span className={`text-2xl font-bold tracking-tight ${l.text}`}>{l.value}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${l.color} transition-all duration-700`}
                  style={{ width: `${l.pct}%` }}
                />
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-3 bg-border rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
