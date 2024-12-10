"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UseCase {
  id: string;
  name: string;
  description: string;
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
    try {
      const res = await fetch(`${BACKEND_URL}/usecases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(useCaseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error creating usecase");
      }

      const data = await res.json();
    } catch (error) {
      throw error;
    }
  };

  const getUseCases = async (projectId: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/usecases/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching usecase");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getUseCaseById = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/usecases/usecase/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching usecase");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateUseCase = async (id: string, useCaseData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/usecases/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(useCaseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error updating usecase: ${res.statusText}`
        );
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUseCase = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/usecases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error deleting usecase: ${res.statusText}`
        );
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
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
