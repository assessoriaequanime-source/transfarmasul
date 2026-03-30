import { useState } from "react";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import type { Vehicle } from "@/lib/dashboard-data";
import { uid, getStatusClass } from "@/lib/dashboard-data";

interface Props {
  vehicles: Vehicle[];
  onChange: (vehicles: Vehicle[]) => void;
}

const EMPTY: Omit<Vehicle, "id"> = {
  plate: "", model: "", type: "Toco", capacity: 0, efficiency: 0, status: "ativo",
};

export default function VehicleSection({ vehicles, onChange }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onChange(vehicles.map((v) => (v.id === editingId ? { ...form, id: editingId } : v)));
      setEditingId(null);
    } else {
      onChange([...vehicles, { ...form, id: uid() }]);
    }
    setForm(EMPTY);
  };

  const edit = (v: Vehicle) => {
    setEditingId(v.id);
    setForm({ plate: v.plate, model: v.model, type: v.type, capacity: v.capacity, efficiency: v.efficiency, status: v.status });
  };

  const remove = (id: string) => onChange(vehicles.filter((v) => v.id !== id));

  const pillClass = (status: string) => {
    const c = getStatusClass(status);
    return c === "ok" ? "pill-ok" : c === "danger" ? "pill-danger" : "pill-warn";
  };

  return (
    <div className="space-y-5">
      <div className="form-field border border-border rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-3">Cadastrar veículo</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label>Placa<input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="ABC1D23" required /></label>
            <label>Modelo<input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Mercedes Atego 1719" required /></label>
            <label>Tipo
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Toco</option><option>Truck</option><option>VUC</option><option>3/4</option>
              </select>
            </label>
            <label>Capacidade (kg)<input type="number" value={form.capacity || ""} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} placeholder="12000" required /></label>
            <label>Consumo (km/l)<input type="number" step="0.1" value={form.efficiency || ""} onChange={(e) => setForm({ ...form, efficiency: +e.target.value })} placeholder="3.2" required /></label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ativo">Ativo</option><option value="manutenção">Manutenção</option><option value="reserva">Reserva</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <Plus className="w-4 h-4" />{editingId ? "Atualizar" : "Salvar veículo"}
            </button>
            <button type="button" onClick={() => { setForm(EMPTY); setEditingId(null); }} className="inline-flex items-center gap-2 bg-card border border-input text-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <RotateCcw className="w-4 h-4" />Novo
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden border border-border rounded-2xl">
        <div className="p-4 pb-0">
          <h3 className="text-sm font-semibold">Base de veículos</h3>
          <p className="text-xs text-muted-foreground mb-3">Leitura operacional da frota cadastrada.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Placa</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Modelo</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Consumo</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Nenhum veículo cadastrado.</td></tr>
              )}
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-border">
                  <td className="px-4 py-3 font-semibold">{v.plate}</td>
                  <td className="px-4 py-3">
                    {v.model}
                    <div className="text-muted-foreground text-xs">{v.type} · {v.capacity.toLocaleString("pt-BR")} kg</div>
                  </td>
                  <td className="px-4 py-3"><span className={pillClass(v.status)}>{v.status}</span></td>
                  <td className="px-4 py-3">{v.efficiency.toFixed(1)} km/l</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => edit(v)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(v.id)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
