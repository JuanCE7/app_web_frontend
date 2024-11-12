const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createTestCase(testCaseData: any) {
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
  } catch (error) {
    console.error("Failed to create testcase:", error);
    throw error;
  }
}

export async function generateTestCase(id: string): Promise<any> {
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
    return data;
  } catch (error) {
    console.error("Failed to fetch usecase:", error);
    throw error;
  }
}

export async function getTestCases(useCaseId: string): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/testcases/${useCaseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching testcases");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch testcases:", error);
    throw error;
  }
}

export async function updateTestCase(id: string, testCaseData: any) {
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
      throw new Error(errorData.message || `Error updating testcase: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to update testcase:", error);
    throw error;
  }
}

export async function deleteTestCase(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/testcases/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Error deleting testcase: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete testcase:", error);
    throw error;
  }
}

export async function getTestCaseById(id: string): Promise<any>  {
  try {
    const res = await fetch(`${BACKEND_URL}/testcases/testcase/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json(); 
      throw new Error(errorData.message || 'Error fetching testcase');
    }

    const data = await res.json(); 
    return data; 
  } catch (error) {
    console.error("Failed to fetch testcase:", error);
    throw error;
  }
}