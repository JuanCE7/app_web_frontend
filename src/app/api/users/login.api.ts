export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function registerUser(values: any) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    }),
  });
  return res;
}

export async function passwordRecovery(email: string): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/passwordRecovery/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      let errorMessage = "Error fetching password";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorData = "error";
        errorMessage = errorData || errorMessage;
      }
      throw new Error(errorMessage);
    }
    const text = await res.text();
    if (!text) {
      return { error: "No data received from server" };
    }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error en la recuperación de contraseña",
    };
  }
}

export async function verifyOtp(values: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/verifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: values.token,
        enteredOtp: values.otpCode,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Error al verificar el OTP",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error en la verificación de OTP",
    };
  }
}
export async function getUserLogged(email: string): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/users/mail/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      let errorMessage = "Error fetching user";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, mantenemos el mensaje por defecto
      }
      return { error: errorMessage };
    }

    const text = await res.text();
    if (!text) {
      return { error: "No data received from server" };
    }

    const data = JSON.parse(text);
    return data;
  } catch (error: any) {
    return { error: error.message || "Unknown error occurred" };
  }
}
