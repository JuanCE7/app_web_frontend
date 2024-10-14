export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function registerUser(userData: any) {
  const res = await fetch(`${BACKEND_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  console.log(data);
}

export async function getUserLogged(email: string): Promise<any>  {
  try {
    const res = await fetch(`${BACKEND_URL}/users/mail/${email}`, {
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