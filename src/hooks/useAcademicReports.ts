/**
 * Hook para gerenciar Relatórios Acadêmicos com localStorage
 */

import { useState, useCallback, useEffect } from "react";
import {
  AcademicReport,
  createNewReport,
  AnalysisVision,
} from "../lib/academic-reports";

const STORAGE_KEY = "transfarmasul_relatorios_v1";

export function useAcademicReports() {
  const [reports, setReports] = useState<AcademicReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega relatórios do localStorage ao inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    }
    setIsLoading(false);
  }, []);

  // Salva relatórios no localStorage sempre que mudam
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports, isLoading]);

  /**
   * Cria um novo relatório em branco
   */
  const createReport = useCallback(
    (nome: string, matricula: string, visao: AnalysisVision) => {
      const newReport = createNewReport(nome, matricula, visao);
      setReports((prev) => [...prev, newReport]);
      return newReport;
    },
    []
  );

  /**
   * Atualiza um relatório existente
   */
  const updateReport = useCallback((id: string, updates: Partial<AcademicReport>) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              ...updates,
              ultima_atualizacao: new Date().toISOString(),
            }
          : report
      )
    );
  }, []);

  /**
   * Deleta um relatório
   */
  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  }, []);

  /**
   * Busca um relatório por ID
   */
  const getReportById = useCallback(
    (id: string): AcademicReport | undefined => {
      return reports.find((report) => report.id === id);
    },
    [reports]
  );

  /**
   * Registra um acesso ao relatório (leitura)
   */
  const recordAccess = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              acessos: report.acessos + 1,
              ultima_atualizacao: new Date().toISOString(),
            }
          : report
      )
    );
  }, []);

  /**
   * Lista relatórios com status específico
   */
  const getReportsByStatus = useCallback(
    (status: string) => {
      return reports.filter((report) => report.status === status);
    },
    [reports]
  );

  /**
   * Adiciona avaliação do professor a um relatório
   */
  const addEvaluation = useCallback(
    (
      id: string,
      pontos_positivos: string,
      nota: number,
      sugestoes_melhoria: string
    ) => {
      updateReport(id, {
        status: "avaliado",
        avaliacao: {
          pontos_positivos,
          nota,
          sugestoes_melhoria,
        },
      });
    },
    [updateReport]
  );

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    getReportById,
    recordAccess,
    getReportsByStatus,
    addEvaluation,
  };
}
