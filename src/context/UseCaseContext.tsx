"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiJson } from "@/lib/apiClient";

interface UseCase {
  id: string;
  code: string;
  name: string;
  description: string;
  projectId: string;
}

interface UseCaseContextType {
  useCases: UseCase[];
  isLoading: boolean;
  createUseCase: (useCaseData: any) => Promise<any>;
  getUseCases: (useCaseId: string) => Promise<any>;
  updateUseCase: (id: string, useCaseData: any) => Promise<any>;
  deleteUseCase: (id: string) => Promise<{ success: boolean }>;
  getUseCaseById: (id: string) => Promise<any>;
  refreshUseCases: () => Promise<void>;
}

const UseCaseContext = createContext<UseCaseContextType | undefined>(undefined);

export function UseCaseProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const createUseCase = async (useCaseData: any) => {
    const data = await apiJson(`/usecases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(useCaseData),
    });
    await refreshUseCases();
    return data;
  };

  const getUseCases = async (projectId: string): Promise<any> => {
    return apiJson(`/usecases/${projectId}`, { method: "GET" });
  };

  const getUseCaseById = async (id: string): Promise<any> => {
    return apiJson(`/usecases/usecase/${id}`, { method: "GET" });
  };

  const updateUseCase = async (id: string, useCaseData: any) => {
    const data = await apiJson(`/usecases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(useCaseData),
    });
    await refreshUseCases();
    return data;
  };

  const deleteUseCase = async (id: string) => {
    await apiJson(`/usecases/${id}`, { method: "DELETE" });
    await refreshUseCases();
    return { success: true };
  };

  const fetchUseCases = useCallback(async () => {
    try {
      setIsLoading(true);
      const useCasesData = await getUseCases(projectId);
      setUseCases(useCasesData);
    } catch (error) {
      console.error("Error fetching use cases:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchUseCases();
  }, [fetchUseCases, refreshKey]);

  const refreshUseCases = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <UseCaseContext.Provider
      value={{
        useCases,
        isLoading,
        createUseCase,
        getUseCases,
        updateUseCase,
        deleteUseCase,
        getUseCaseById,
        refreshUseCases,
      }}
    >
      {children}
    </UseCaseContext.Provider>
  );
}

export function useUseCases() {
  const context = useContext(UseCaseContext);
  if (context === undefined) {
    throw new Error("useUseCases must be used within a UseCaseProvider");
  }
  return context;
}
