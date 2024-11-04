const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 

export async function createUseCase(useCaseData: any) {
  console.log(useCaseData)
  console.log("JSON enviado al backend:", JSON.stringify(useCaseData, null, 2));
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
      throw new Error(errorData.message || 'Error creating usecase');
    }

    const data = await res.json();
  } catch (error) {
    console.error("Failed to create usecase:", error);
    throw error;
  }
}

export async function getUseCases(projectId: string): Promise<any> {
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
    console.error("Failed to fetch usecase:", error);
    throw error;
  }
}

export async function getUseCaseById(id: string): Promise<any>  {
  try {
    const res = await fetch(`${BACKEND_URL}/usecases/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json(); 
      throw new Error(errorData.message || 'Error fetching usecase');
    }

    const data = await res.json(); 
    return data; 
  } catch (error) {
    console.error("Failed to fetch usecase:", error);
    throw error;
  }
}

export async function updateUseCase(id: string, useCaseData: any) {
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
      throw new Error(errorData.message || `Error updating usecase: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to update usecase:", error);
    throw error;
  }
}

export async function deleteUseCase(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/usecases/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Error deleting usecase: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete usecase:", error);
    throw error;
  }
}