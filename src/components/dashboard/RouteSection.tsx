import { useState } from "react";
import { MapPin, Trash2, Plus, RotateCcw } from "lucide-react";
import type { Route, Vehicle } from "@/lib/dashboard-data";
import { uid, nowLabel } from "@/lib/dashboard-data";

interface Props {
  routes: Route[];
  vehicles: Vehicle[];
  onChange: (routes: Route[]) => void;
}

const EMPTY = {
  name: "", vehicleId: "", origin: "", destination: "", priority: "alta", deadline: "Hoje", deliveries: 1, notes: "",
};

export default function RouteSection({ routes, vehicles, onChange }: Props) {
  const [form, setForm] = useState(EMPTY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = vehicles.find((v) => v.id === form.vehicleId);
    const distanceKm = Math.round(100 + Math.random() * 400);
    const efficiency = vehicle?.efficiency || 3.5;
    const fuelLiters = +(distanceKm / efficiency).toFixed(1);
    const durationH = +(distanceKm / 65).toFixed(1);

    const newRoute: Route = {
      id: uid(),
      name: form.name,
      vehicleId: form.vehicleId,
      vehicleLabel: vehicle ? `${vehicle.plate} · ${vehicle.model}` : "N/A",
      origin: form.origin,
      destination: form.destination,
      priority: form.priority,
      deadline: form.deadline,
      deliveries: form.deliveries,
      notes: form.notes,
      distanceKm,
      durationH,
      fuelLiters,
      createdAt: nowLabel(),
    };
    onChange([...routes, newRoute]);
    setForm(EMPTY);
  };

  const remove = (id: string) => onChange(routes.filter((r) => r.id !== id));

  const totalDistance = routes.reduce((s, r) => s + r.distanceKm, 0);
  const totalFuel = routes.reduce((s, r) => s + r.fuelLiters, 0);
  const totalDuration = routes.reduce((s, r) => s + r.durationH, 0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 dashboard-card">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-accent" />
            <h2 className="section-title">Planejamento de rotas</h2>
          </div>
          <p className="section-desc mb-4">Origem, destino, prioridade e veículo alocado.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-muted rounded-[14px] p-3 border border-border">
              <span className="text-xs text-muted-foreground">Distância total</span>
              <strong className="block text-xl">{totalDistance.toFixed(0)} km</strong>
            </div>
            <div className="bg-muted rounded-[14px] p-3 border border-border">
              <span className="text-xs text-muted-foreground">Combustível total</span>
              <strong className="block text-xl">{totalFuel.toFixed(1)} L</strong>
            </div>
            <div className="bg-muted rounded-[14px] p-3 border border-border">
              <span className="text-xs text-muted-foreground">Tempo total</span>
              <strong className="block text-xl">{totalDuration.toFixed(1)} h</strong>
            </div>
            <div className="bg-muted rounded-[14px] p-3 border border-border">
              <span className="text-xs text-muted-foreground">Total de rotas</span>
              <strong className="block text-xl">{routes.length}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 dashboard-card form-field">
          <h2 className="section-title">Nova rota</h2>
          <p className="section-desc mb-4">Planejamento com cálculo automatizado.</p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label>Nome<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Criciúma → Joinville" required /></label>
              <label>Veículo
                <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} required>
                  <option value="">Selecione</option>
                  {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate} · {v.model}</option>)}
                </select>
              </label>
              <label>Origem<input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Criciúma, SC" required /></label>
              <label>Destino<input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Joinville, SC" required /></label>
              <label>Prioridade
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="alta">Alta</option><option value="média">Média</option><option value="baixa">Baixa</option>
                </select>
              </label>
              <label>Prazo
                <select value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}>
                  <option>Hoje</option><option>Amanhã</option><option>48h</option><option>72h</option>
                </select>
              </label>
              <label>Entregas<input type="number" min="1" value={form.deliveries} onChange={(e) => setForm({ ...form, deliveries: +e.target.value })} required /></label>
              <label>Observações<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas operacionais" className="min-h-[60px] resize-y" /></label>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
                <Plus className="w-4 h-4" />Calcular e salvar
              </button>
              <button type="button" onClick={() => setForm(EMPTY)} className="inline-flex items-center gap-2 bg-card border border-input text-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
                <RotateCcw className="w-4 h-4" />Limpar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="dashboard-card p-0 overflow-hidden">
        <div className="p-5 pb-0">
          <h2 className="section-title">Rotas planejadas</h2>
          <p className="section-desc mb-3">Base consolidada para leitura e revisão.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[720px]">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Rota</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Veículo</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Trecho</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Prazo</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">KM</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Combustível</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">Nenhuma rota cadastrada.</td></tr>
              )}
              {routes.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <strong>{r.name}</strong>
                    <div className="text-muted-foreground text-xs">{r.priority.toUpperCase()} · {r.deliveries} entregas</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{r.vehicleLabel}</td>
                  <td className="px-4 py-3 text-xs">{r.origin} → {r.destination}</td>
                  <td className="px-4 py-3">{r.deadline}</td>
                  <td className="px-4 py-3">{r.distanceKm.toFixed(0)}</td>
                  <td className="px-4 py-3">{r.fuelLiters.toFixed(1)} L</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(r.id)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
