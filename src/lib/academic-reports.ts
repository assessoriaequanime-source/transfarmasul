/**
 * Tipos e utilitários para Relatórios Acadêmicos
 * Sistema de avaliação com modelo sanduíche e links privados
 */

/**
 * Visão de análise do aluno
 */
export type AnalysisVision = "SWOT" | "Porter" | "Value Chain";

/**
 * Status do relatório
 */
export type ReportStatus = "pendente" | "em_revisão" | "avaliado" | "revisado";

/**
 * Dados pré-relatório (reflexão do aluno)
 */
export interface PreReport {
  gargalo: string; // Qual era o gargalo principal?
  acao: string; // Qual ação você recomenda?
  kpi: string; // Qual KPI deveria ser melhorado?
  expectativa_aprendizado: string; // O que você aprendeu com esse cenário?
}

/**
 * Avaliação do professor (modelo sanduíche)
 */
export interface ProfessorEvaluation {
  pontos_positivos: string; // Ponto forte do relatório
  nota: number; // 0-10
  sugestoes_melhoria: string; // Sugestão para próxima vez
}

/**
 * Estrutura completa do Relatório Acadêmico
 */
export interface AcademicReport {
  id: string; // rel_abc123def
  timestamp: string; // ISO string
  aluno: {
    nome: string;
    matricula: string;
  };
  assinatura: string; // Base64 da canvas
  data_relatorio: string; // DD/MM/YYYY
  visao: AnalysisVision;
  pre_relatorio: PreReport;
  status: ReportStatus;
  avaliacao?: ProfessorEvaluation;
  teste_associado?: string; // ID do teste (se houver)
  acessos: number; // Quantas vezes foi visualizado
  ultima_atualizacao: string;
}

/**
 * Gera um ID único para relatório
 * Formato: rel_ABC123DEF (8 caracteres aleatórios)
 */
export function generateReportId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "rel_";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id.toLowerCase();
}

/**
 * Cria um novo relatório vazio
 */
export function createNewReport(
  nome: string,
  matricula: string,
  visao: AnalysisVision
): AcademicReport {
  return {
    id: generateReportId(),
    timestamp: new Date().toISOString(),
    aluno: { nome, matricula },
    assinatura: "",
    data_relatorio: new Date().toLocaleDateString("pt-BR"),
    visao,
    pre_relatorio: {
      gargalo: "",
      acao: "",
      kpi: "",
      expectativa_aprendizado: "",
    },
    status: "pendente",
    acessos: 0,
    ultima_atualizacao: new Date().toISOString(),
  };
}

/**
 * Valida se um relatório pode ser enviado
 */
export function isReportValid(report: AcademicReport): boolean {
  const preReport = report.pre_relatorio;
  return (
    report.aluno.nome.trim().length > 0 &&
    report.aluno.matricula.trim().length > 0 &&
    report.assinatura.length > 100 && // Canvas mínimo
    preReport.gargalo.trim().length > 0 &&
    preReport.acao.trim().length > 0 &&
    preReport.kpi.trim().length > 0 &&
    preReport.expectativa_aprendizado.trim().length > 0
  );
}

/**
 * Formata uma avaliação para exibição
 */
export function formatEvaluation(
  evaluation: ProfessorEvaluation
): string {
  return `
NOTA: ${evaluation.nota}/10

PONTOS POSITIVOS:
${evaluation.pontos_positivos}

SUGESTÕES PARA MELHORIA:
${evaluation.sugestoes_melhoria}
  `.trim();
}
