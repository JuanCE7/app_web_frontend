"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface UsersContextType {
  users: User[];
  isLoading: boolean;
  getUsers: () => Promise<any>;
  registerUser: (userData: any) => Promise<any>;
  updateUser: (id: string, userData: any) => Promise<any>;
  passwordRecovery: (email: string) => Promise<any>;
  verifyOtp: (value: any) => Promise<any>;
  getUserLogged: (email: string) => Promise<any>;
  refreshUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const getUsers = async (): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching user");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  const registerUser = async (values: any) => {
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
    await refreshUsers()
    return res;
  };

  const updateUser = async (id: string, userData: any) => {
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
      await refreshUsers()
      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  const passwordRecovery = async (email: string): Promise<any> => {
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
  };

  const verifyOtp = async (values: any) => {
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
  };
  const getUserLogged = async (email: string): Promise<any> => {
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
          console.error("Error fetching user")
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
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error obteniendo la información:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]);

  const refreshUsers = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        isLoading,
        registerUser,
        getUsers,
        updateUser,
        passwordRecovery,
        verifyOtp,
        getUserLogged,
        refreshUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
