'use client';

import { useUsers } from "@/context/UsersContext";
import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { useSession } from "next-auth/react";

export default function ListUsers() {
  const { users, isLoading } = useUsers();
  const { data: session } = useSession();

  if (isLoading) {
    return <div>Cargando usuarios...</div>;
  }

  // Filtrar al usuario logueado
  const filteredUsers = users.filter(user => user.email !== session?.user?.email);

  return (
    <DataTable
      columns={columns}
      data={filteredUsers}
      placeholder="Filtro por correo..."
      filter="email"
    />
  );
}
