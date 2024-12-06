const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getUsers(): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/users`, {
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
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/users/admin/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    throw error;
  }
}
