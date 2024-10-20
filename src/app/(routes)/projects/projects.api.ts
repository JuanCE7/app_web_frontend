const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 

export async function createProject(productData: any) {
  try {
console.log(productData)
    const res = await fetch(`${BACKEND_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error creating project');
    }

    const data = await res.json();
    console.log(data);
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
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}
export async function getProjectById(id: string): Promise<any>  {
  try {
    const res = await fetch(`${BACKEND_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json(); 
      throw new Error(errorData.message || 'Error fetching project');
    }

    const data = await res.json(); 
    console.log(data); 
    return data; 
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}
