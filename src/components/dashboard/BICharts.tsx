import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import type { DashboardState } from "@/lib/dashboard-data";

interface Props {
  state: DashboardState;
}

const COLORS = ["#14384c", "#2f6995", "#5a9cc5", "#91c4de", "#c9dfe8"];
const STATUS_COLORS: Record<string, string> = { ativo: "#1a9a5c", "manutenção": "#c93545", reserva: "#b08215" };

export default function BICharts({ state }: Props) {
  const deliveriesData = state.routes.map((r) => ({
    name: r.name.length > 12 ? r.name.slice(0, 12) + "…" : r.name,
    entregas: r.deliveries,
    combustível: r.fuelLiters,
  }));

  const supplierData = state.suppliers.map((s) => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    sla: s.sla,
    score: s.score * 10,
  }));

  const fleetByType: Record<string, number> = {};
  state.vehicles.forEach((v) => { fleetByType[v.type] = (fleetByType[v.type] || 0) + 1; });
  const pieData = Object.entries(fleetByType).map(([name, value]) => ({ name, value }));

  const statusCounts: Record<string, number> = {};
  state.vehicles.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const costData = state.routes.map((r) => ({
    name: r.name.length > 10 ? r.name.slice(0, 10) + "…" : r.name,
    km: r.distanceKm,
    litros: r.fuelLiters,
  }));

  const radarData = state.suppliers.map((s) => ({
    subject: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    SLA: s.sla,
    Score: s.score * 10,
  }));

  const empty = (t: string) => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">{t}</div>
  );

  const tooltipStyle = { borderRadius: 10, border: "1px solid hsl(207,25%,88%)", fontSize: 10, padding: "6px 10px" };

  return (
    <div className="space-y-4">
      {/* Row 1: 2 main charts compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Entregas × Combustível</h3>
          <div className="h-44">
            {deliveriesData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveriesData} barGap={1} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="entregas" fill="#14384c" radius={[4, 4, 0, 0]} name="Entregas" />
                  <Bar dataKey="combustível" fill="#5a9cc5" radius={[4, 4, 0, 0]} name="Combustível" />
                </BarChart>
              </ResponsiveContainer>
            ) : empty("Cadastre rotas")}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Custo Operacional (km × L)</h3>
          <div className="h-44">
            {costData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costData}>
                  <defs>
                    <linearGradient id="gKm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14384c" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#14384c" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5a9cc5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#5a9cc5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="km" stroke="#14384c" strokeWidth={2} fill="url(#gKm)" name="km" />
                  <Area type="monotone" dataKey="litros" stroke="#5a9cc5" strokeWidth={2} fill="url(#gL)" name="Litros" />
                </AreaChart>
              </ResponsiveContainer>
            ) : empty("Cadastre rotas")}
          </div>
        </div>
      </div>

      {/* Row 2: 4 small charts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-3">
          <h3 className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Frota por tipo</h3>
          <div className="h-36">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} innerRadius={24} label={{ fontSize: 9 }}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ ...tooltipStyle, fontSize: 9 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : empty("Sem dados")}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3">
          <h3 className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Status da frota</h3>
          <div className="h-36">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} innerRadius={24} label={{ fontSize: 9 }}>
                    {statusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "#999"} />)}
                  </Pie>
                  <Tooltip contentStyle={{ ...tooltipStyle, fontSize: 9 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : empty("Sem dados")}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3">
          <h3 className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Radar Fornecedores</h3>
          <div className="h-36">
            {radarData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(207,25%,88%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8 }} />
                  <PolarRadiusAxis tick={{ fontSize: 7 }} domain={[0, 100]} />
                  <Radar name="SLA" dataKey="SLA" stroke="#14384c" fill="#14384c" fillOpacity={0.25} />
                  <Radar name="Score" dataKey="Score" stroke="#5a9cc5" fill="#5a9cc5" fillOpacity={0.15} />
                  <Tooltip contentStyle={{ ...tooltipStyle, fontSize: 9 }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : empty("Sem dados")}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3">
          <h3 className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">SLA vs Score</h3>
          <div className="h-36">
            {supplierData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData} layout="vertical" barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,90%)" />
                  <XAxis type="number" tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={60} />
                  <Tooltip contentStyle={{ ...tooltipStyle, fontSize: 9 }} />
                  <Bar dataKey="sla" fill="#2f6995" radius={[0, 4, 4, 0]} name="SLA" />
                  <Bar dataKey="score" fill="#91c4de" radius={[0, 4, 4, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : empty("Sem dados")}
          </div>
        </div>
      </div>
    </div>
  );
}
