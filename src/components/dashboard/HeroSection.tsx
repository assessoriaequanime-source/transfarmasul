import { useState } from "react";
import { Database, Printer, FileJson, FileSpreadsheet, Trash2, Target, Eye, Shield, FlaskConical, GraduationCap } from "lucide-react";
import type { DashboardState } from "@/lib/dashboard-data";
import { COMPANY_INFO } from "@/lib/dashboard-data";
import { generateRandomData } from "@/lib/academic-data";
import { loadTests } from "@/lib/academic-data";
import logo from "@/assets/logo-transfarmasul.jpeg";
import AcademicReportModal from "./AcademicReportModal";

interface Props {
  onSeedDemo: () => void;
  onClearAll: () => void;
  onExportJson: () => void;
  onSetState: (data: any) => void;
  state: DashboardState;
}

export default function HeroSection({ onSeedDemo, onClearAll, onExportJson, onSetState, state }: Props) {
  const [reportModal, setReportModal] = useState(false);

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

  const handleRandomTest = () => {
    const randomData = generateRandomData();
    onSetState(randomData);
  };

  // Active tests from professor
  const activeTests = loadTests().filter((t) => t.active);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 dashboard-card relative overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(204 38% 45%), transparent 70%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-4 mb-3">
              <img src={logo} alt="TransFarmaSul" className="w-16 h-16 rounded-2xl object-contain shadow-lg bg-white p-1" />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8D0000" }}>Painel Administrativo - SWOT</span>
                <p className="text-xs text-muted-foreground">Acadêmicos do curso de Administração</p>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-2">
              Dashboard logístico profissional para frota, fornecedores, rotas e BI executivo.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {COMPANY_INFO.missao}
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
            <button onClick={handleRandomTest} title="Gerar cenário aleatório" className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform text-white" style={{ background: "#3C2D26" }}>
              <FlaskConical className="w-4 h-4" />Teste Analítico
            </button>
            <button onClick={() => setReportModal(true)} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform text-white" style={{ background: "#8D0000" }}>
              <GraduationCap className="w-4 h-4" />Relatório Acadêmico
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

      {/* Active tests banner */}
      {activeTests.length > 0 && (
        <div className="rounded-2xl border-2 p-4 space-y-2" style={{ borderColor: "#8D0000", background: "hsla(0, 100%, 28%, 0.04)" }}>
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#8D0000" }}>
            <FlaskConical className="w-4 h-4" />Testes disponíveis
          </h3>
          {activeTests.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.description} · Prazo: {t.deadline || "Sem prazo"}</p>
              </div>
              <button onClick={handleRandomTest} className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white" style={{ background: "#3C2D26" }}>Gerar cenário</button>
            </div>
          ))}
        </div>
      )}

      {/* Missão, Visão, Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm">Missão</h3>
            <span title="Seção acadêmica"><GraduationCap className="w-4 h-4 text-muted-foreground/50" /></span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{COMPANY_INFO.missao}</p>
          <p className="text-[10px] text-muted-foreground/50 italic mt-3">*Análise desenvolvida pelos alunos da disciplina de Planejamento Estratégico*</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm">Visão</h3>
            <span title="Seção acadêmica"><GraduationCap className="w-4 h-4 text-muted-foreground/50" /></span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{COMPANY_INFO.visao}</p>
          <p className="text-[10px] text-muted-foreground/50 italic mt-3">*Análise desenvolvida pelos alunos da disciplina de Planejamento Estratégico*</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm">Valores</h3>
            <span title="Seção acadêmica"><GraduationCap className="w-4 h-4 text-muted-foreground/50" /></span>
          </div>
          <ul className="space-y-1">
            {COMPANY_INFO.valores.map((v) => (
              <li key={v} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                {v}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground/50 italic mt-3">*Análise desenvolvida pelos alunos da disciplina de Planejamento Estratégico*</p>
        </div>
      </div>

      <AcademicReportModal open={reportModal} onClose={() => setReportModal(false)} state={state} />
    </div>
  );
}
