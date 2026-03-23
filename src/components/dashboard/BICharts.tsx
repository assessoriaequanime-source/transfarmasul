import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { DashboardState } from "@/lib/dashboard-data";

interface Props {
  state: DashboardState;
}

const COLORS = ["#14384c", "#2f6995", "#5a9cc5", "#91c4de", "#c9dfe8"];

export default function BICharts({ state }: Props) {
  const deliveriesData = state.routes.map((r) => ({
    name: r.name.length > 18 ? r.name.slice(0, 18) + "…" : r.name,
    entregas: r.deliveries,
    combustível: r.fuelLiters,
  }));

  const supplierData = state.suppliers.map((s) => ({
    name: s.name,
    sla: s.sla,
    score: s.score * 10,
  }));

  const fleetByType: Record<string, number> = {};
  state.vehicles.forEach((v) => {
    fleetByType[v.type] = (fleetByType[v.type] || 0) + 1;
  });
  const pieData = Object.entries(fleetByType).map(([name, value]) => ({ name, value }));

  const costData = state.routes.map((r) => ({
    name: r.name.length > 15 ? r.name.slice(0, 15) + "…" : r.name,
    km: r.distanceKm,
    litros: r.fuelLiters,
  }));

  const emptyMsg = (text: string) => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">{text}</div>
  );

  return (
    <>
      <div className="dashboard-card">
        <h2 className="section-title">BI operacional</h2>
        <p className="section-desc mb-5">Painel analítico com hierarquia visual objetiva.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-72">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Entregas por rota</h3>
            {deliveriesData.length ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={deliveriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="entregas" fill="#14384c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre rotas para visualizar")}
          </div>
          <div className="h-72">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">SLA de fornecedores</h3>
            {supplierData.length ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={supplierData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="sla" fill="#2f6995" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre fornecedores para visualizar")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="dashboard-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Distribuição da frota</h3>
          <div className="h-64">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre veículos")}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Custo por rota (km × litros)</h3>
          <div className="h-64">
            {costData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="km" stroke="#14384c" strokeWidth={2} />
                  <Line type="monotone" dataKey="litros" stroke="#2f6995" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre rotas")}
          </div>
        </div>
      </div>
    </>
  );
}
