import { Layers, ArrowDown, AlertTriangle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/dashboard-data";

export default function StrategicPlanningSection() {
  const levels = [
    {
      title: "Planejamento Estratégico",
      desc: "Objetivos de longo prazo da empresa",
      items: COMPANY_INFO.planejamento.estrategico,
      gradient: "from-primary to-primary/80",
    },
    {
      title: "Planejamento Tático",
      desc: "Ações por setor para atingir os objetivos",
      items: COMPANY_INFO.planejamento.tatico,
      gradient: "from-accent to-accent/80",
    },
    {
      title: "Planejamento Operacional",
      desc: "Execução das tarefas do dia a dia",
      items: COMPANY_INFO.planejamento.operacional,
      gradient: "from-emerald-600 to-emerald-500",
    },
  ];

  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-5 h-5 text-accent" />
        <h2 className="section-title">Planejamento estratégico organizacional</h2>
      </div>
      <p className="section-desc mb-5">Três níveis de planejamento: estratégico, tático e operacional — 5W2H aplicado.</p>

      <div className="space-y-3">
        {levels.map((level, i) => (
          <div key={level.title}>
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className={`bg-gradient-to-r ${level.gradient} px-5 py-3`}>
                <h3 className="text-white font-bold text-sm">{level.title}</h3>
                <p className="text-white/80 text-xs">{level.desc}</p>
              </div>
              <div className="p-4 bg-card">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {level.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {i < levels.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ações de crise */}
      <div className="mt-5 rounded-2xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-white font-bold text-sm">Plano de contingência (5W2H)</h3>
            <p className="text-white/80 text-xs">Ações para crises como greves e aumento de combustível</p>
          </div>
        </div>
        <div className="p-4 bg-card">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMPANY_INFO.acoesCrise.map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SWOT resumido */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border p-4">
          <h4 className="text-xs font-bold text-foreground mb-2">Pontos Fortes</h4>
          <ul className="space-y-1">
            {COMPANY_INFO.pontosFortes.map((p) => (
              <li key={p} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <h4 className="text-xs font-bold text-foreground mb-2">Pontos Fracos</h4>
          <ul className="space-y-1">
            {COMPANY_INFO.pontosFracos.map((p) => (
              <li key={p} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
