import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import type { Report, DashboardState } from "@/lib/dashboard-data";
import { uid, nowLabel } from "@/lib/dashboard-data";

interface Props {
  reports: Report[];
  state: DashboardState;
  onChange: (reports: Report[]) => void;
}

export default function ReportsSection({ reports, state, onChange }: Props) {
  const [form, setForm] = useState({ title: "", owner: "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalFuel = state.routes.reduce((s, r) => s + r.fuelLiters, 0);
    const avgSla = state.suppliers.length
      ? Math.round(state.suppliers.reduce((s, sup) => s + sup.sla, 0) / state.suppliers.length)
      : 0;

    const newReport: Report = {
      id: uid(),
      title: form.title,
      owner: form.owner,
      notes: form.notes,
      createdAt: nowLabel(),
      snapshot: {
        fleet: state.vehicles.length,
        suppliers: state.suppliers.length,
        routes: state.routes.length,
        fuelLiters: totalFuel.toFixed(1),
        onTime: avgSla,
      },
    };
    onChange([...reports, newReport]);
    setForm({ title: "", owner: "", notes: "" });
  };

  const remove = (id: string) => onChange(reports.filter((r) => r.id !== id));

  return (
    <div className="space-y-5">
      <div className="border border-border rounded-2xl p-4 form-field">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label>Título<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Relatório executivo semanal" required /></label>
            <label>Responsável<input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Gestão Operacional" required /></label>
          </div>
          <div className="mt-3">
            <label>Notas executivas<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Resumo das decisões, riscos e próximos passos" className="min-h-[80px] resize-y" /></label>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <Plus className="w-4 h-4" />Gerar relatório
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {reports.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">Nenhum relatório gerado.</div>
        )}
        {reports.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 border border-border rounded-2xl p-4 bg-muted/50">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <strong className="text-sm">{r.title}</strong>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{r.owner} · {r.createdAt}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Frota: {r.snapshot.fleet} | Fornecedores: {r.snapshot.suppliers} | Rotas: {r.snapshot.routes} | Combustível: {r.snapshot.fuelLiters} L | Pontualidade: {r.snapshot.onTime}%
              </div>
              {r.notes && <div className="text-xs mt-1 text-muted-foreground italic">{r.notes}</div>}
            </div>
            <button onClick={() => remove(r.id)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
