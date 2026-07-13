"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { useUsers } from "./UsersContext";
import { apiJson } from "@/lib/apiClient";

interface Project {
  id: string;
  name: string;
  description: string;
  roleProject: string;
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  createProject: (projectData: any) => Promise<any>;
  getProjects: (userId: string) => Promise<any>;
  updateProject: (id: string, projectData: any) => Promise<any>;
  deleteProject: (id: string) => Promise<{ success: boolean }>;
  getProjectById: (id: string) => Promise<any>;
  getProjectRole: (userId: string, projectId: string) => Promise<string>;
  joinProject: (shareData: any) => Promise<any>;
  exitProject: (exitData: any) => Promise<any>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session } = useSession();
  const { getUserLogged } = useUsers();

  const createProject = async (projectData: any) => {
    const data = await apiJson(`/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });
    await refreshProjects();
    return data;
  };

  const getProjects = async (userId: string): Promise<any> => {
    return apiJson(`/projects/${userId}`, { method: "GET" });
  };

  const getProjectById = async (id: string): Promise<any> => {
    return apiJson(`/projects/project/${id}`, { method: "GET" });
  };

  const getProjectRole = async (
    userId: string,
    projectId: string
  ): Promise<string> => {
    const data = await apiJson<{ role: string }>(
      `/projects/${projectId}/role?userId=${userId}`,
      { method: "GET" }
    );
    return data.role;
  };

  const updateProject = async (id: string, projectData: any) => {
    const data = await apiJson(`/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });
    await refreshProjects();
    return data;
  };

  const deleteProject = async (id: string) => {
    await apiJson(`/projects/${id}`, { method: "DELETE" });
    await refreshProjects();
    return { success: true };
  };

  interface JoinProjectResponse {
    success: boolean;
    message: string;
    member?: {
      id: string;
      role: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      project: {
        id: string;
        name: string;
        code: string;
      };
    };
  }

  const joinProject = async (shareData: {
    userId: string;
    code: string;
  }): Promise<JoinProjectResponse> => {
    const data = await apiJson<JoinProjectResponse>(`/projects/shareProject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shareData),
    });
    await refreshProjects();
    return data;
  };

  const exitProject = async (exitData: {
    userId: string;
    projectId: string;
  }) => {
    const data = await apiJson(`/projects/exitProject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exitData),
    });
    await refreshProjects();
    return data;
  };

  const fetchProjects = useCallback(async () => {
    if (session?.user?.email) {
      try {
        setIsLoading(true);
        const user = await getUserLogged(session.user.email);
        const projectsData = await getProjects(user.id);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error obteniendo la información:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, refreshKey]);

  const refreshProjects = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        createProject,
        getProjects,
        updateProject,
        deleteProject,
        getProjectById,
        getProjectRole,
        joinProject,
        exitProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
