const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function updateUser(id: string, userData: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || `Error updating user: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}
