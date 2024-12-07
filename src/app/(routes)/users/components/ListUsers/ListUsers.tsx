'use client';

import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { getUsers } from "@/app/api/users/users.api";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ListUsers() {
  const { data: session, status } = useSession();
  const [listUsers, setListUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getUsers();

        // Filtrar al usuario autenticado de la lista
        if (session?.user?.email) {
          const filteredUsers = users.filter(
            (user: { email?: string }) => user.email !== session.user.email
          );
          setListUsers(filteredUsers);
        } else {
          setListUsers(users); // Si no hay sesión, mostrar todos los usuarios
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status !== "loading") {
      fetchUsers();
    }
  }, [session, status, listUsers]); // Dependencias actualizadas

  if (isLoading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={listUsers}
      placeholder="Filtro por correo..."
      filter="email"
    />
  );
}
