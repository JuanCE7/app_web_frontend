"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiJson, ApiError } from "@/lib/apiClient";

interface TestCase {
  id: string;
  name: string;
  description: string;
}

interface TestCaseContextType {
  testCases: TestCase[];
  isLoading: boolean;
  createTestCase: (testCaseData: any) => Promise<any>;
  generateTestCase: (id: string) => Promise<any>;
  getTestCases: (useCaseId: string) => Promise<any>;
  updateTestCase: (id: string, testCaseData: any) => Promise<any>;
  deleteTestCase: (id: string) => Promise<{ success: boolean }>;
  getTestCaseById: (id: string) => Promise<any>;
  getExplanationById: (id: string) => Promise<any>;
  refreshTestCases: () => Promise<void>;
}

const TestCaseContext = createContext<TestCaseContextType | undefined>(
  undefined
);

export function TestCaseProvider({
  children,
  useCaseId,
}: {
  children: React.ReactNode;
  projectId: string;
  useCaseId: string;
}) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const createTestCase = async (testCaseData: any) => {
    const data = await apiJson(`/testcases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCaseData),
    });
    await refreshTestCases();
    return data;
  };

  const generateTestCase = async (id: string): Promise<any> => {
    // La generación con IA puede tardar; damos más margen de timeout por intento.
    const data = await apiJson(`/testcases/generate/${id}`, {
      method: "POST",
      timeoutMs: 60_000,
    });
    await refreshTestCases();
    return data;
  };

  const getTestCases = async (useCaseId: string): Promise<any> => {
    // Antes esto devolvía [] al fallar, ocultando un backend dormido como
    // "no hay casos de prueba". Ahora propagamos el error normalizado.
    return apiJson(`/testcases/${useCaseId}`, { method: "GET" });
  };

  const updateTestCase = async (id: string, testCaseData: any) => {
    const data = await apiJson(`/testcases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCaseData),
    });
    await refreshTestCases();
    return data;
  };

  const deleteTestCase = async (id: string) => {
    await apiJson(`/testcases/${id}`, { method: "DELETE" });
    await refreshTestCases();
    return { success: true };
  };

  const getTestCaseById = async (id: string): Promise<any> => {
    return apiJson(`/testcases/testcase/${id}`, { method: "GET" });
  };

  const getExplanationById = async (id: string): Promise<any> => {
    try {
      return await apiJson(`/explanation/${id}`, { method: "GET" });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Not Found");
      }
      throw error;
    }
  };

  const fetchTestCases = useCallback(async () => {
    try {
      setIsLoading(true);
      const testCasesData = await getTestCases(useCaseId);
      setTestCases(testCasesData);
    } catch (error) {
      // El aviso global de "servidor despertando" ya se dispara desde apiClient.
      // Aquí evitamos romper la UI dejando la lista vacía como último recurso.
      console.error("Error fetching test cases:", error);
      setTestCases([]);
    } finally {
      setIsLoading(false);
    }
  }, [useCaseId]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases, refreshKey]);

  const refreshTestCases = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <TestCaseContext.Provider
      value={{
        testCases,
        isLoading,
        createTestCase,
        generateTestCase,
        getTestCases,
        updateTestCase,
        deleteTestCase,
        getTestCaseById,
        getExplanationById,
        refreshTestCases,
      }}
    >
      {children}
    </TestCaseContext.Provider>
  );
}

export function useTestCases() {
  const context = useContext(TestCaseContext);
  if (context === undefined) {
    throw new Error("useTestCases must be used within a TestCaseProvider");
  }
  return context;
}
