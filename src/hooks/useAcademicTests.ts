/**
 * Hook para gerenciar Testes Acadêmicos com localStorage
 */

import { useState, useCallback, useEffect } from "react";

export interface AcademicTest {
  id: string;
  titulo: string;
  descricao: string;
  cenario: string;
  data_criacao: string;
  data_limite?: string;
  respostas_recebidas: number;
  status: "ativo" | "encerrado" | "rascunho";
}

const STORAGE_KEY = "transfarmasul_testes_v1";

export function useAcademicTests() {
  const [tests, setTests] = useState<AcademicTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega testes do localStorage ao inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTests(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar testes:", error);
    }
    setIsLoading(false);
  }, []);

  // Salva testes no localStorage sempre que mudam
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    }
  }, [tests, isLoading]);

  /**
   * Cria um novo teste
   */
  const createTest = useCallback(
    (
      titulo: string,
      descricao: string,
      cenario: string,
      data_limite?: string
    ): AcademicTest => {
      const newTest: AcademicTest = {
        id: `test_${Date.now()}`,
        titulo,
        descricao,
        cenario,
        data_criacao: new Date().toISOString(),
        data_limite,
        respostas_recebidas: 0,
        status: "ativo",
      };
      setTests((prev) => [...prev, newTest]);
      return newTest;
    },
    []
  );

  /**
   * Atualiza um teste
   */
  const updateTest = useCallback((id: string, updates: Partial<AcademicTest>) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === id ? { ...test, ...updates } : test
      )
    );
  }, []);

  /**
   * Deleta um teste
   */
  const deleteTest = useCallback((id: string) => {
    setTests((prev) => prev.filter((test) => test.id !== id));
  }, []);

  /**
   * Busca um teste por ID
   */
  const getTestById = useCallback(
    (id: string): AcademicTest | undefined => {
      return tests.find((test) => test.id === id);
    },
    [tests]
  );

  /**
   * Incrementa contador de respostas
   */
  const recordResponse = useCallback((testId: string) => {
    updateTest(testId, (test) => ({
      respostas_recebidas: test.respostas_recebidas + 1,
    }));
  }, [updateTest]);

  /**
   * Lista testes ativos
   */
  const getActivTests = useCallback(() => {
    return tests.filter((test) => test.status === "ativo");
  }, [tests]);

  /**
   * Lista todos os testes (professor)
   */
  const getAllTests = useCallback(() => {
    return tests.sort(
      (a, b) =>
        new Date(b.data_criacao).getTime() -
        new Date(a.data_criacao).getTime()
    );
  }, [tests]);

  return {
    tests,
    isLoading,
    createTest,
    updateTest,
    deleteTest,
    getTestById,
    recordResponse,
    getActivTests,
    getAllTests,
  };
}
