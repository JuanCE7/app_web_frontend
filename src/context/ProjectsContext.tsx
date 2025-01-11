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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    try {
      const res = await fetch(`${BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error creating project");
      }
      const data = await res.json();
      await refreshProjects();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getProjects = async (userId: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching project");
      }

      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const getProjectById = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects/project/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching project");
      }

      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const getProjectRole = async (
    userId: string,
    projectId: string
  ): Promise<string> => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/projects/${projectId}/role?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching project role");
      }

      const data = await res.json();
      return data.role;
    } catch (error) {
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error updating project: ${res.statusText}`
        );
      }
      const data = await res.json();
      await refreshProjects();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Error deleting project: ${res.statusText}`
        );
      }
      await refreshProjects();
      return { success: true };
    } catch (error) {
      throw error;
    }
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
    try {
      const response = await fetch(`${BACKEND_URL}/projects/shareProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shareData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            data: {
              statusCode: response.status,
              message: data.message || "Error al unirse al proyecto",
              error: data.error,
            },
          },
        };
      }
      await refreshProjects();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const exitProject = async (exitData: {
    userId: string;
    projectId: string;
  }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/projects/exitProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            data: {
              statusCode: response.status,
              message: data.message || "Error al unirse al proyecto",
              error: data.error,
            },
          },
        };
      }
      await refreshProjects();
      return data;
    } catch (error) {
      throw error;
    }
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
