import { useState, useEffect } from "react";
import { Lock, GraduationCap, Plus, Trash2, Pencil, Eye, CheckCircle, Clock, BarChart3, X, FileText, Users } from "lucide-react";
import { loadReports, saveReports, loadTests, saveTests, type AcademicReport, type ProfessorTest } from "@/lib/academic-data";
import { uid } from "@/lib/dashboard-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logo from "@/assets/logo-transfarmasul.jpeg";

const PROFESSOR_PASSWORD = "professor123";

export default function Professor() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [reports, setReports] = useState<AcademicReport[]>([]);
  const [tests, setTests] = useState<ProfessorTest[]>([]);
  const [tab, setTab] = useState<"overview" | "tests" | "reports" | "metrics">("overview");
  const [evalModal, setEvalModal] = useState<AcademicReport | null>(null);
  const [testModal, setTestModal] = useState(false);
  const [viewReport, setViewReport] = useState<AcademicReport | null>(null);

  // Test form
  const [testForm, setTestForm] = useState({ title: "", description: "", deadline: "", scenarioType: "aleatorio" as "aleatorio" | "fixo" });
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Eval form
  const [evalForm, setEvalForm] = useState({ strengths: "", improvements: "", grade: 0, suggestion: "", observation: "" });

  useEffect(() => {
    if (authenticated) {
      setReports(loadReports());
      setTests(loadTests());
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PROFESSOR_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Test CRUD
  const saveTest = () => {
    if (!testForm.title) return;
    let updated: ProfessorTest[];
    if (editingTestId) {
      updated = tests.map((t) => t.id === editingTestId ? { ...t, ...testForm } : t);
    } else {
      updated = [...tests, { id: uid(), ...testForm, createdAt: new Date().toLocaleString("pt-BR"), active: true }];
    }
    setTests(updated);
    saveTests(updated);
    setTestModal(false);
    setTestForm({ title: "", description: "", deadline: "", scenarioType: "aleatorio" });
    setEditingTestId(null);
  };

  const deleteTest = (id: string) => {
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated);
    saveTests(updated);
  };

  const editTest = (t: ProfessorTest) => {
    setEditingTestId(t.id);
    setTestForm({ title: t.title, description: t.description, deadline: t.deadline, scenarioType: t.scenarioType });
    setTestModal(true);
  };

  // Evaluate
  const submitEval = () => {
    if (!evalModal) return;
    const updated = reports.map((r) =>
      r.id === evalModal.id
        ? { ...r, status: "avaliado" as const, evaluation: { ...evalForm, evaluatedAt: new Date().toLocaleString("pt-BR") } }
        : r
    );
    setReports(updated);
    saveReports(updated);
    setEvalModal(null);
    setEvalForm({ strengths: "", improvements: "", grade: 0, suggestion: "", observation: "" });
  };

  // Metrics
  const pendingCount = reports.filter((r) => r.status === "pendente").length;
  const evaluatedCount = reports.filter((r) => r.status === "avaliado").length;
  const avgGrade = evaluatedCount > 0
    ? (reports.filter((r) => r.status === "avaliado").reduce((s, r) => s + (r.evaluation?.grade || 0), 0) / evaluatedCount).toFixed(1)
    : "—";
  const opCount = reports.filter((r) => r.vision === "operacional").length;
  const learnCount = reports.filter((r) => r.vision === "aprendizagem").length;

  const gradeEvolution = reports
    .filter((r) => r.status === "avaliado" && r.evaluation)
    .map((r) => ({ name: r.studentName.split(" ")[0], nota: r.evaluation!.grade, date: r.evaluation!.evaluatedAt }));

  // Bottleneck word count
  const wordCounts: Record<string, number> = {};
  reports.forEach((r) => {
    r.preReport.bottleneck.toLowerCase().split(/\s+/).filter((w) => w.length > 3).forEach((w) => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
  });
  const topWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="dashboard-card max-w-sm w-full space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <img src={logo} alt="TransFarmaSul" className="w-12 h-12 rounded-xl object-contain shadow-md bg-white" />
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-lg font-bold text-center">Acesso Professor</h1>
          <form onSubmit={handleLogin} className="space-y-3 form-field">
            <label>Senha
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha" />
            </label>
            {error && <p className="text-xs text-destructive">Senha incorreta.</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm">Entrar</button>
          </form>
          <a href="/" className="block text-center text-xs text-muted-foreground hover:underline">Voltar ao painel</a>
        </div>
      </div>
    );
  }

  const getTestTitle = (testId?: string) => {
    if (!testId) return "—";
    return tests.find((t) => t.id === testId)?.title || "Teste removido";
  };

  const reportsForTest = (testId: string) => reports.filter((r) => r.testId === testId).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TransFarmaSul" className="w-10 h-10 rounded-xl object-contain shadow bg-white" />
            <div>
              <h1 className="font-bold text-sm">Dashboard do Professor</h1>
              <p className="text-xs text-muted-foreground">Painel Administrativo - SWOT</p>
            </div>
          </div>
          <a href="/" className="text-xs text-accent hover:underline">Voltar ao painel</a>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5">
          {(["overview", "tests", "reports", "metrics"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "overview" ? "Visão Geral" : t === "tests" ? "Testes" : t === "reports" ? "Relatórios" : "Métricas"}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-card text-center">
              <FileText className="w-6 h-6 text-accent mx-auto mb-1" />
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Total relatórios</p>
            </div>
            <div className="dashboard-card text-center">
              <Clock className="w-6 h-6 text-warning mx-auto mb-1" />
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <div className="dashboard-card text-center">
              <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
              <p className="text-2xl font-bold">{evaluatedCount}</p>
              <p className="text-xs text-muted-foreground">Avaliados</p>
            </div>
            <div className="dashboard-card text-center">
              <BarChart3 className="w-6 h-6 text-accent mx-auto mb-1" />
              <p className="text-2xl font-bold">{avgGrade}</p>
              <p className="text-xs text-muted-foreground">Média notas</p>
            </div>
            <div className="dashboard-card col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Visão Operacional</p>
              <p className="text-xl font-bold">{reports.length > 0 ? Math.round((opCount / reports.length) * 100) : 0}%</p>
            </div>
            <div className="dashboard-card col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Visão Aprendizagem</p>
              <p className="text-xl font-bold">{reports.length > 0 ? Math.round((learnCount / reports.length) * 100) : 0}%</p>
            </div>
          </div>
        )}

        {/* TESTS */}
        {tab === "tests" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm">Gerenciamento de Testes</h2>
              <button onClick={() => { setTestModal(true); setEditingTestId(null); setTestForm({ title: "", description: "", deadline: "", scenarioType: "aleatorio" }); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4" />Criar novo teste
              </button>
            </div>
            {tests.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum teste criado.</p>}
            {tests.map((t) => (
              <div key={t.id} className="dashboard-card flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>Prazo: {t.deadline || "—"}</span>
                    <span>Cenário: {t.scenarioType}</span>
                    <span>Relatórios: {reportsForTest(t.id)}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => editTest(t)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteTest(t.id)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm">Relatórios dos Alunos</h2>
            {reports.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum relatório recebido.</p>}
            <div className="overflow-x-auto border border-border rounded-2xl">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Aluno</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Matrícula</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Data</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Teste</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-accent font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="px-4 py-3 font-semibold">{r.studentName}</td>
                      <td className="px-4 py-3">{r.studentId}</td>
                      <td className="px-4 py-3 text-xs">{r.createdAt}</td>
                      <td className="px-4 py-3 text-xs">{getTestTitle(r.testId)}</td>
                      <td className="px-4 py-3">
                        <span className={r.status === "avaliado" ? "pill-ok" : "pill-warn"}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewReport(r)} className="p-2 rounded-lg border border-input bg-card hover:bg-muted"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => { setEvalModal(r); setEvalForm(r.evaluation ? { strengths: r.evaluation.strengths, improvements: r.evaluation.improvements, grade: r.evaluation.grade, suggestion: r.evaluation.suggestion, observation: r.evaluation.observation } : { strengths: "", improvements: "", grade: 0, suggestion: "", observation: "" }); }} className="p-2 rounded-lg border border-input bg-card hover:bg-muted">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* METRICS */}
        {tab === "metrics" && (
          <div className="space-y-5">
            <div className="dashboard-card">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Evolução das Notas</h3>
              <div className="h-52">
                {gradeEvolution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gradeEvolution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(207,25%,90%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={30} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                      <Line type="monotone" dataKey="nota" stroke="#8D0000" strokeWidth={2} dot={{ r: 4 }} name="Nota" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Sem avaliações</div>}
              </div>
            </div>
            <div className="dashboard-card">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Principais Gargalos (palavras mais citadas)</h3>
              {topWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topWords.map(([word, count]) => (
                    <span key={word} className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-semibold" style={{ fontSize: `${Math.min(16, 10 + count * 2)}px` }}>
                      {word} ({count})
                    </span>
                  ))}
                </div>
              ) : <p className="text-xs text-muted-foreground">Sem dados suficientes.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Test Modal */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setTestModal(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm">{editingTestId ? "Editar Teste" : "Criar Novo Teste"}</h2>
              <button onClick={() => setTestModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="form-field space-y-3">
              <label>Título<input value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} placeholder="Título do teste" required /></label>
              <label>Descrição<textarea value={testForm.description} onChange={(e) => setTestForm({ ...testForm, description: e.target.value })} placeholder="Instruções do teste" className="min-h-[60px] resize-y" /></label>
              <label>Prazo<input type="date" value={testForm.deadline} onChange={(e) => setTestForm({ ...testForm, deadline: e.target.value })} /></label>
              <label>Cenário
                <select value={testForm.scenarioType} onChange={(e) => setTestForm({ ...testForm, scenarioType: e.target.value as "aleatorio" | "fixo" })}>
                  <option value="aleatorio">Aleatório</option>
                  <option value="fixo">Fixo</option>
                </select>
              </label>
            </div>
            <button onClick={saveTest} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm">{editingTestId ? "Atualizar" : "Criar teste"}</button>
          </div>
        </div>
      )}

      {/* Eval Modal */}
      {evalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEvalModal(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm">Avaliar Relatório - {evalModal.studentName}</h2>
              <button onClick={() => setEvalModal(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            {/* Summary */}
            <div className="bg-muted rounded-xl p-3 space-y-1 text-xs">
              <p><strong>Gargalo:</strong> {evalModal.preReport.bottleneck}</p>
              <p><strong>Ação:</strong> {evalModal.preReport.proposedAction}</p>
              <p><strong>KPI:</strong> {evalModal.preReport.kpiIndicator}</p>
              <p><strong>Aprendizagem:</strong> {evalModal.preReport.expectedLearning}</p>
            </div>
            <div className="form-field space-y-3">
              <label>Pontos fortes<textarea value={evalForm.strengths} onChange={(e) => setEvalForm({ ...evalForm, strengths: e.target.value })} className="min-h-[60px] resize-y" required /></label>
              <label>Pontos de melhoria<textarea value={evalForm.improvements} onChange={(e) => setEvalForm({ ...evalForm, improvements: e.target.value })} className="min-h-[60px] resize-y" required /></label>
              <label>Nota (0-10)<input type="number" min="0" max="10" step="0.5" value={evalForm.grade || ""} onChange={(e) => setEvalForm({ ...evalForm, grade: +e.target.value })} required /></label>
              <label>Sugestão de ação concreta<textarea value={evalForm.suggestion} onChange={(e) => setEvalForm({ ...evalForm, suggestion: e.target.value })} className="min-h-[60px] resize-y" required /></label>
              <label>Observação livre<textarea value={evalForm.observation} onChange={(e) => setEvalForm({ ...evalForm, observation: e.target.value })} className="min-h-[40px] resize-y" /></label>
            </div>
            <button onClick={submitEval} className="w-full py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: "#8D0000" }}>Enviar avaliação</button>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewReport(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm">Relatório - {viewReport.studentName}</h2>
              <button onClick={() => setViewReport(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="text-sm space-y-2">
              <p><strong>Matrícula:</strong> {viewReport.studentId}</p>
              <p><strong>Visão:</strong> {viewReport.vision}</p>
              <p><strong>Data:</strong> {viewReport.createdAt}</p>
              {viewReport.signature && <img src={viewReport.signature} alt="Assinatura" className="border border-border rounded-xl max-w-[150px]" />}
            </div>
            <div className="bg-muted rounded-xl p-3 space-y-1 text-xs">
              <p><strong>Gargalo:</strong> {viewReport.preReport.bottleneck}</p>
              <p><strong>Ação:</strong> {viewReport.preReport.proposedAction}</p>
              <p><strong>KPI:</strong> {viewReport.preReport.kpiIndicator}</p>
              <p><strong>Aprendizagem:</strong> {viewReport.preReport.expectedLearning}</p>
            </div>
            {viewReport.dashboardSnapshot && (
              <div className="text-xs text-muted-foreground">
                <p>Veículos: {viewReport.dashboardSnapshot.vehicles} | Fornecedores: {viewReport.dashboardSnapshot.suppliers} | Rotas: {viewReport.dashboardSnapshot.routes}</p>
              </div>
            )}
            {viewReport.status === "avaliado" && viewReport.evaluation && (
              <div className="border border-success/20 rounded-xl p-3 space-y-1 text-xs">
                <p className="font-bold text-success">Avaliado — Nota: {viewReport.evaluation.grade}</p>
                <p><strong>Fortes:</strong> {viewReport.evaluation.strengths}</p>
                <p><strong>Melhorias:</strong> {viewReport.evaluation.improvements}</p>
                <p><strong>Sugestão:</strong> {viewReport.evaluation.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 space-y-1">
        <p className="text-xs text-muted-foreground">TransFarmaSul · Dashboard Analítico de estudos·</p>
        <p className="text-[10px] text-muted-foreground/60">BY DEV - Ana Cristina Alves Ferreira</p>
      </div>
    </div>
  );
}
