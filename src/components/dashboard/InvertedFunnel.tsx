import type { DashboardState } from "@/lib/dashboard-data";

interface Props {
  state: DashboardState;
}

export default function InvertedFunnel({ state }: Props) {
  const activeFleet = state.vehicles.filter((v) => v.status === "ativo").length;
  const avgSla = state.suppliers.length
    ? Math.round(state.suppliers.reduce((s, sup) => s + sup.sla, 0) / state.suppliers.length)
    : 0;

  const layers = [
    { label: "Entregas no prazo", value: `${avgSla}%`, width: "62%" },
    { label: "Rotas com planejamento", value: state.routes.length, width: "74%" },
    { label: "Fornecedores monitorados", value: state.suppliers.length, width: "86%" },
    { label: "Capacidade ativa da frota", value: activeFleet, width: "100%" },
  ];

  return (
    <div className="dashboard-card">
      <h2 className="section-title">Topo de funil invertido</h2>
      <p className="section-desc mb-5">Da camada estratégica para a camada operacional acionável.</p>
      <div className="flex flex-col gap-2.5">
        {layers.map((l) => (
          <div
            key={l.label}
            className="funnel-layer"
            style={{ width: l.width }}
          >
            <span className="text-sm">{l.label}</span>
            <span className="text-xl font-bold tracking-tight">{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
