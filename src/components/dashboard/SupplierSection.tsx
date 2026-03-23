import { useState } from "react";
import { Pencil, Trash2, Users, Plus, RotateCcw } from "lucide-react";
import type { Supplier } from "@/lib/dashboard-data";
import { uid, getStatusClass } from "@/lib/dashboard-data";

interface Props {
  suppliers: Supplier[];
  onChange: (suppliers: Supplier[]) => void;
}

const EMPTY: Omit<Supplier, "id"> = {
  name: "", category: "Farmacêutico", city: "", sla: 0, score: 0, status: "ativo",
};

export default function SupplierSection({ suppliers, onChange }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onChange(suppliers.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)));
      setEditingId(null);
    } else {
      onChange([...suppliers, { ...form, id: uid() }]);
    }
    setForm(EMPTY);
  };

  const edit = (s: Supplier) => {
    setEditingId(s.id);
    setForm({ name: s.name, category: s.category, city: s.city, sla: s.sla, score: s.score, status: s.status });
  };

  const remove = (id: string) => onChange(suppliers.filter((s) => s.id !== id));

  const pillClass = (status: string) => {
    const c = getStatusClass(status);
    return c === "ok" ? "pill-ok" : c === "danger" ? "pill-danger" : "pill-warn";
  };

  return (
    <>
      <div className="dashboard-card form-field">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="section-title">Cadastro de fornecedores</h2>
        </div>
        <p className="section-desc mb-4">Rede operacional, qualidade e SLA.</p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label>Fornecedor<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Laboratório Alfa" required /></label>
            <label>Categoria
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Farmacêutico</option><option>Embalagem</option><option>Manutenção</option><option>Combustível</option>
              </select>
            </label>
            <label>Cidade<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Criciúma" required /></label>
            <label>SLA (%)<input type="number" min="0" max="100" value={form.sla || ""} onChange={(e) => setForm({ ...form, sla: +e.target.value })} placeholder="97" required /></label>
            <label>Score<input type="number" min="0" max="10" step="0.1" value={form.score || ""} onChange={(e) => setForm({ ...form, score: +e.target.value })} placeholder="8.7" required /></label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ativo">Ativo</option><option value="em avaliação">Em avaliação</option><option value="crítico">Crítico</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <Plus className="w-4 h-4" />{editingId ? "Atualizar" : "Salvar fornecedor"}
            </button>
            <button type="button" onClick={() => { setForm(EMPTY); setEditingId(null); }} className="inline-flex items-center gap-2 bg-card border border-input text-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <RotateCcw className="w-4 h-4" />Novo
            </button>
          </div>
        </form>
      </div>

      <div className="dashboard-card p-0 overflow-hidden">
        <div className="p-5 pb-0">
          <h2 className="section-title">Base de fornecedores</h2>
          <p className="section-desc mb-3">SLA e score para priorização gerencial.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Fornecedor</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Cidade</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">SLA</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Nenhum fornecedor cadastrado.</td></tr>
              )}
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <strong>{s.name}</strong>
                    <div className="text-muted-foreground text-xs">{s.category}</div>
                  </td>
                  <td className="px-4 py-3">{s.city}</td>
                  <td className="px-4 py-3">{s.sla}% · score {s.score.toFixed(1)}</td>
                  <td className="px-4 py-3"><span className={pillClass(s.status)}>{s.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => edit(s)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(s.id)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors">
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
    </>
  );
}
