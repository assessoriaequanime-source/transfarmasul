import { useState } from "react";
import { X, GraduationCap, Copy, Send, MessageCircle, Mail } from "lucide-react";
import SignatureCanvas from "./SignatureCanvas";
import { generateReportId, loadReports, saveReports, loadTests, type AcademicReport } from "@/lib/academic-data";
import { COMPANY_INFO, type DashboardState } from "@/lib/dashboard-data";

interface Props {
  open: boolean;
  onClose: () => void;
  state: DashboardState;
}

export default function AcademicReportModal({ open, onClose, state }: Props) {
  const [step, setStep] = useState<"form" | "link">("form");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [signature, setSignature] = useState("");
  const [sigConfirmed, setSigConfirmed] = useState(false);
  const [vision, setVision] = useState<"operacional" | "aprendizagem">("operacional");
  const [testId, setTestId] = useState("");
  const [bottleneck, setBottleneck] = useState("");
  const [proposedAction, setProposedAction] = useState("");
  const [kpiIndicator, setKpiIndicator] = useState("");
  const [expectedLearning, setExpectedLearning] = useState("");
  const [includeDashboard, setIncludeDashboard] = useState(true);
  const [includeSwot, setIncludeSwot] = useState(true);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const tests = loadTests().filter((t) => t.active);

  const handleSubmit = () => {
    if (!name || !studentId || !sigConfirmed || !bottleneck || !proposedAction || !kpiIndicator || !expectedLearning) return;

    const id = generateReportId();
    const report: AcademicReport = {
      id,
      studentName: name,
      studentId,
      signature,
      createdAt: new Date().toLocaleString("pt-BR"),
      vision,
      testId: testId || undefined,
      preReport: { bottleneck, proposedAction, kpiIndicator, expectedLearning },
      dashboardSnapshot: includeDashboard ? {
        vehicles: state.vehicles.length,
        suppliers: state.suppliers.length,
        routes: state.routes.length,
        totalFuel: state.routes.reduce((s, r) => s + r.fuelLiters, 0).toFixed(1),
        avgSla: state.suppliers.length ? Math.round(state.suppliers.reduce((s, sup) => s + sup.sla, 0) / state.suppliers.length) : 0,
      } : null,
      swotSnapshot: includeSwot ? {
        pontosFortes: COMPANY_INFO.pontosFortes,
        pontosFracos: COMPANY_INFO.pontosFracos,
        planejamento: COMPANY_INFO.planejamento,
      } : null,
      status: "pendente",
    };

    const reports = loadReports();
    reports.push(report);
    saveReports(reports);

    const link = `${window.location.origin}/relatorio?id=${id}`;
    setGeneratedLink(link);
    setStep("link");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Meu relatório acadêmico TransFarmaSul: ${generatedLink}`)}`, "_blank");
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent("Relatório Acadêmico TransFarmaSul")}&body=${encodeURIComponent(`Acesse meu relatório: ${generatedLink}`)}`, "_blank");
  };

  const resetAndClose = () => {
    setStep("form");
    setName(""); setStudentId(""); setSignature(""); setSigConfirmed(false);
    setVision("operacional"); setTestId(""); setBottleneck(""); setProposedAction("");
    setKpiIndicator(""); setExpectedLearning(""); setGeneratedLink(""); setCopied(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={resetAndClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-sm">Relatório Acadêmico</h2>
          </div>
          <button onClick={resetAndClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
        </div>

        {step === "form" && (
          <div className="p-5 space-y-5">
            {/* Student info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dados do aluno</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 form-field">
                <label>Nome completo<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do aluno" required /></label>
                <label>Matrícula<input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="2024001234" required /></label>
              </div>
              <SignatureCanvas onConfirm={(d) => { setSignature(d); setSigConfirmed(true); }} confirmed={sigConfirmed} />
              <div className="form-field">
                <label>Visão
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="radio" name="vision" checked={vision === "operacional"} onChange={() => setVision("operacional")} className="accent-accent" />
                      Operacional
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="radio" name="vision" checked={vision === "aprendizagem"} onChange={() => setVision("aprendizagem")} className="accent-accent" />
                      Aprendizagem
                    </label>
                  </div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Data: {new Date().toLocaleString("pt-BR")}</p>
              {tests.length > 0 && (
                <div className="form-field">
                  <label>Teste associado (opcional)
                    <select value={testId} onChange={(e) => setTestId(e.target.value)}>
                      <option value="">Nenhum</option>
                      {tests.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Pre-report */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pré-relatório reflexivo</h3>
              <div className="form-field space-y-3">
                <label>Principal gargalo identificado<textarea value={bottleneck} onChange={(e) => setBottleneck(e.target.value)} placeholder="Descreva o principal gargalo..." className="min-h-[60px] resize-y" required /></label>
                <label>Ação proposta<textarea value={proposedAction} onChange={(e) => setProposedAction(e.target.value)} placeholder="Qual ação você propõe?" className="min-h-[60px] resize-y" required /></label>
                <label>Indicador de sucesso (KPI)<input value={kpiIndicator} onChange={(e) => setKpiIndicator(e.target.value)} placeholder="Ex: redução de 15% no tempo de entrega" required /></label>
                <label>Aprendizagem esperada<textarea value={expectedLearning} onChange={(e) => setExpectedLearning(e.target.value)} placeholder="O que você espera aprender?" className="min-h-[60px] resize-y" required /></label>
              </div>
            </div>

            {/* Content checkboxes */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Conteúdo do relatório</h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={includeDashboard} onChange={(e) => setIncludeDashboard(e.target.checked)} className="accent-accent" />
                Incluir dashboard atual
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={includeSwot} onChange={(e) => setIncludeSwot(e.target.checked)} className="accent-accent" />
                Incluir análises SWOT/planejamento
              </label>
            </div>

            <button onClick={handleSubmit} disabled={!name || !studentId || !sigConfirmed || !bottleneck || !proposedAction || !kpiIndicator || !expectedLearning} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: "#8D0000" }}>
              <Send className="w-4 h-4" />Enviar e gerar link privado
            </button>
          </div>
        )}

        {step === "link" && (
          <div className="p-5 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold">Relatório enviado com sucesso!</h3>
            <p className="text-sm text-muted-foreground">Guarde este link para consultar o resultado depois.</p>
            <div className="bg-muted border border-border rounded-xl p-3 text-xs break-all text-left font-mono">
              {generatedLink}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={copyLink} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                <Copy className="w-4 h-4" />{copied ? "Link copiado!" : "Copiar link"}
              </button>
              <div className="flex gap-2">
                <button onClick={shareWhatsApp} className="flex-1 inline-flex items-center justify-center gap-2 bg-muted border border-border py-2 rounded-xl text-xs font-semibold hover:bg-accent/10 transition-colors">
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </button>
                <button onClick={shareEmail} className="flex-1 inline-flex items-center justify-center gap-2 bg-muted border border-border py-2 rounded-xl text-xs font-semibold hover:bg-accent/10 transition-colors">
                  <Mail className="w-4 h-4" />E-mail
                </button>
              </div>
            </div>
            <button onClick={resetAndClose} className="text-sm text-muted-foreground hover:text-foreground underline">Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
}
