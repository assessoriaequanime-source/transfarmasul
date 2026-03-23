import { Database, Printer, FileJson, FileSpreadsheet, Trash2 } from "lucide-react";
import type { DashboardState } from "@/lib/dashboard-data";
import logo from "@/assets/logo-transfarmasul.jpeg";

interface Props {
  onSeedDemo: () => void;
  onClearAll: () => void;
  onExportJson: () => void;
  state: DashboardState;
}

export default function HeroSection({ onSeedDemo, onClearAll, onExportJson, state }: Props) {
  const handlePrint = () => window.print();

  const exportCsv = () => {
    const rows = [["Placa", "Modelo", "Tipo", "Capacidade", "Consumo", "Status"]];
    state.vehicles.forEach((v) => rows.push([v.plate, v.model, v.type, String(v.capacity), String(v.efficiency), v.status]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transfarmasul_vehicles.csv";
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 dashboard-card relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(204 38% 45%), transparent 70%)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-3">
            <img src={logo} alt="TransFarmaSul" className="w-10 h-10 rounded-lg object-contain" />
            TransFarmaSul · cockpit operacional
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-2">
            Dashboard logístico profissional para frota, fornecedores, rotas e BI executivo.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Estrutura funcional com padrão visual limpo, foco operacional, painel analítico e gestão de relatórios.
            Base inicial para operação farmacêutica com 5 caminhões e necessidade de reduzir custo de combustível e atrasos.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 dashboard-card flex flex-col justify-between gap-4">
        <div>
          <h3 className="section-title">Ações executivas</h3>
          <p className="section-desc mb-3">Exportação, snapshot e gestão da base.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onSeedDemo} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            <Database className="w-4 h-4" />Popular demo
          </button>
          <button onClick={onClearAll} className="inline-flex items-center justify-center gap-2 bg-card border border-input text-foreground px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            <Trash2 className="w-4 h-4" />Limpar base
          </button>
          <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 bg-card border border-input text-foreground px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            <Printer className="w-4 h-4" />Imprimir / PDF
          </button>
          <button onClick={onExportJson} className="inline-flex items-center justify-center gap-2 bg-card border border-input text-foreground px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            <FileJson className="w-4 h-4" />Exportar JSON
          </button>
          <button onClick={exportCsv} className="col-span-2 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            <FileSpreadsheet className="w-4 h-4" />Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}
