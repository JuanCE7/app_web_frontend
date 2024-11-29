const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createProject(projectData: any) {
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
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
}

export async function getProjects(userId: string): Promise<any> {
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

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}

export async function getProjectById(id: string): Promise<any> {
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

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}

export async function getProjectRole(
  userId: string,
  projectId: string
): Promise<string> {
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
    return data.role; // Asumimos que el backend retorna { role: "admin" }
  } catch (error) {
    console.error("Failed to fetch project role:", error);
    throw error;
  }
}

export async function updateProject(id: string, projectData: any) {
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
    return data;
  } catch (error) {
    console.error("Failed to update project:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
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

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
}

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

export async function joinProject(shareData: {
  userId: string;
  code: string;
}): Promise<JoinProjectResponse> {
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

    return data;
  } catch (error) {
    console.error("Failed to share project:", error);
    throw error;
  }
}

export async function exitProject(exitData: { userId: string; projectId: string }) {
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

    return data;
  } catch (error) {
    console.error("Failed to share project:", error);
    throw error;
  }
}
