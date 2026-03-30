import { useSearchParams } from "react-router-dom";
import { loadReports } from "@/lib/academic-data";
import { GraduationCap, Clock, CheckCircle, AlertCircle } from "lucide-react";
import logo from "@/assets/logo-transfarmasul.jpeg";

export default function ReportViewer() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const reports = loadReports();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="dashboard-card max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold">Relatório não encontrado</h1>
          <p className="text-sm text-muted-foreground">O ID informado é inválido ou o relatório não existe.</p>
          <a href="/" className="inline-block text-sm text-accent hover:underline">Voltar ao painel</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="TransFarmaSul" className="w-14 h-14 rounded-xl object-contain shadow-md bg-white" />
            <div>
              <h1 className="text-lg font-bold">Relatório Acadêmico</h1>
              <p className="text-xs text-muted-foreground">Painel Administrativo - SWOT · TransFarmaSul</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={`dashboard-card flex items-center gap-3 ${report.status === "avaliado" ? "border-success/30" : "border-warning/30"}`}>
          {report.status === "avaliado" ? (
            <CheckCircle className="w-6 h-6 text-success shrink-0" />
          ) : (
            <Clock className="w-6 h-6 text-warning shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold">
              {report.status === "avaliado" ? "Relatório avaliado" : "Aguardando avaliação do professor"}
            </p>
            <p className="text-xs text-muted-foreground">
              {report.status === "avaliado" ? `Avaliado em ${report.evaluation?.evaluatedAt}` : "Volte em breve para conferir o resultado."}
            </p>
          </div>
        </div>

        {/* Student info */}
        <div className="dashboard-card space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-sm">Dados do aluno</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground text-xs">Nome:</span><p className="font-semibold">{report.studentName}</p></div>
            <div><span className="text-muted-foreground text-xs">Matrícula:</span><p className="font-semibold">{report.studentId}</p></div>
            <div><span className="text-muted-foreground text-xs">Visão:</span><p className="font-semibold capitalize">{report.vision}</p></div>
            <div><span className="text-muted-foreground text-xs">Data:</span><p className="font-semibold">{report.createdAt}</p></div>
          </div>
          {report.signature && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Assinatura:</p>
              <img src={report.signature} alt="Assinatura" className="border border-border rounded-xl max-w-[200px]" />
            </div>
          )}
        </div>

        {/* Pre-report */}
        <div className="dashboard-card space-y-3">
          <h2 className="font-semibold text-sm">Pré-relatório reflexivo</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-xs text-muted-foreground">Gargalo identificado:</span><p>{report.preReport.bottleneck}</p></div>
            <div><span className="text-xs text-muted-foreground">Ação proposta:</span><p>{report.preReport.proposedAction}</p></div>
            <div><span className="text-xs text-muted-foreground">Indicador KPI:</span><p>{report.preReport.kpiIndicator}</p></div>
            <div><span className="text-xs text-muted-foreground">Aprendizagem esperada:</span><p>{report.preReport.expectedLearning}</p></div>
          </div>
        </div>

        {/* Dashboard snapshot */}
        {report.dashboardSnapshot && (
          <div className="dashboard-card space-y-2">
            <h2 className="font-semibold text-sm">Snapshot do Dashboard</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "Veículos", value: report.dashboardSnapshot.vehicles },
                { label: "Fornecedores", value: report.dashboardSnapshot.suppliers },
                { label: "Rotas", value: report.dashboardSnapshot.routes },
                { label: "Combustível", value: `${report.dashboardSnapshot.totalFuel} L` },
                { label: "Pontualidade", value: `${report.dashboardSnapshot.avgSla}%` },
              ].map((item) => (
                <div key={item.label} className="bg-muted rounded-xl p-2 text-center">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation (if evaluated) */}
        {report.status === "avaliado" && report.evaluation && (
          <div className="dashboard-card space-y-3 border-success/20">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />Avaliação do Professor
            </h2>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-center">
                <span className="text-3xl font-bold" style={{ color: "#8D0000" }}>{report.evaluation.grade.toFixed(1)}</span>
                <p className="text-xs text-muted-foreground">Nota</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-success/5 rounded-xl p-3"><span className="text-xs font-semibold text-success">Pontos fortes:</span><p className="mt-1">{report.evaluation.strengths}</p></div>
              <div className="bg-warning/5 rounded-xl p-3"><span className="text-xs font-semibold text-warning">Pontos de melhoria:</span><p className="mt-1">{report.evaluation.improvements}</p></div>
              <div className="bg-accent/5 rounded-xl p-3"><span className="text-xs font-semibold text-accent">Sugestão de ação:</span><p className="mt-1">{report.evaluation.suggestion}</p></div>
              {report.evaluation.observation && (
                <div className="bg-muted rounded-xl p-3"><span className="text-xs font-semibold text-muted-foreground">Observação:</span><p className="mt-1">{report.evaluation.observation}</p></div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4 space-y-1">
          <p className="text-xs text-muted-foreground italic">*Análise desenvolvida pelos alunos da disciplina de Planejamento Estratégico</p>
          <p className="text-[10px] text-muted-foreground/60">TransFarmaSul · Dashboard Analítico</p>
        </div>
      </div>
    </div>
  );
}
