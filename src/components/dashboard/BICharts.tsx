import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { BarChart3 } from "lucide-react";
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

  // Radar data for supplier evaluation
  const radarData = state.suppliers.map((s) => ({
    subject: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
    SLA: s.sla,
    Score: s.score * 10,
  }));

  // Fleet status breakdown
  const statusCounts: Record<string, number> = {};
  state.vehicles.forEach((v) => {
    statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS: Record<string, string> = { ativo: "#1a9a5c", "manutenção": "#c93545", reserva: "#b08215" };

  const emptyMsg = (text: string) => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">{text}</div>
  );

  return (
    <>
      <div className="dashboard-card">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h2 className="section-title">BI operacional</h2>
        </div>
        <p className="section-desc mb-5">Painel analítico com hierarquia visual objetiva.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-72">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Entregas e combustível por rota</h3>
            {deliveriesData.length ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={deliveriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(207,25%,88%)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="entregas" fill="#14384c" radius={[6, 6, 0, 0]} name="Entregas" />
                  <Bar dataKey="combustível" fill="#5a9cc5" radius={[6, 6, 0, 0]} name="Combustível (L)" />
                </BarChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre rotas para visualizar")}
          </div>
          <div className="h-72">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">SLA vs Score de fornecedores</h3>
            {supplierData.length ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={supplierData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(207,25%,88%)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="sla" fill="#2f6995" radius={[0, 6, 6, 0]} name="SLA (%)" />
                  <Bar dataKey="score" fill="#91c4de" radius={[0, 6, 6, 0]} name="Score (×10)" />
                </BarChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre fornecedores para visualizar")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="dashboard-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Distribuição da frota</h3>
          <div className="h-64">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={{ fontSize: 11 }}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre veículos")}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Status da frota</h3>
          <div className="h-64">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={{ fontSize: 11 }}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#999"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre veículos")}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Avaliação de fornecedores</h3>
          <div className="h-64">
            {radarData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(207,25%,88%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <Radar name="SLA" dataKey="SLA" stroke="#14384c" fill="#14384c" fillOpacity={0.3} />
                  <Radar name="Score" dataKey="Score" stroke="#5a9cc5" fill="#5a9cc5" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : emptyMsg("Cadastre fornecedores")}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Custo operacional por rota (km × litros)</h3>
        <div className="h-72">
          {costData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14384c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14384c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLitros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a9cc5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5a9cc5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(207,25%,88%)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="km" stroke="#14384c" strokeWidth={2} fill="url(#colorKm)" name="Distância (km)" />
                <Area type="monotone" dataKey="litros" stroke="#5a9cc5" strokeWidth={2} fill="url(#colorLitros)" name="Combustível (L)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : emptyMsg("Cadastre rotas")}
        </div>
      </div>
    </>
  );
}
