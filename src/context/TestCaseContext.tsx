"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    try {
      const res = await fetch(`${BACKEND_URL}/testcases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCaseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error creating testcase");
      }

      const data = await res.json();
      await refreshTestCases();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const generateTestCase = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/testcases/generate/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching usecase");
      }

      const data = await res.json();
      await refreshTestCases();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getTestCases = async (useCaseId: string): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/testcases/${useCaseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      return [];
    }
  };

  const updateTestCase = async (id: string, testCaseData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/testcases/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCaseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error updating testcase: ${res.statusText}`
        );
      }

      const data = await res.json();
      await refreshTestCases();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteTestCase = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/testcases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error deleting testcase: ${res.statusText}`
        );
      }

      await refreshTestCases();
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const getTestCaseById = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/testcases/testcase/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching testcase");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getExplanationById = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/explanation/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Not Found");
        }
        throw new Error("Error al obtener la explicación");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const fetchTestCases = useCallback(async () => {
    try {
      setIsLoading(true);
      const testCasesData = await getTestCases(useCaseId);
      setTestCases(testCasesData);
    } catch (error) {
      console.error("Error fetching test cases:", error);
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
