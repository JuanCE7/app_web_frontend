'use client';

import { useUsers } from "@/context/UsersContext";
import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function ListUsers() {
  const { users, isLoading } = useUsers();
  const { data: session } = useSession();

  if (isLoading) {
    return <LoadingSpinner label="Cargando usuarios…" />;
  }

  // Filtrar al usuario logueado
  const filteredUsers = users.filter(user => user.email !== session?.user?.email);

  return (
    <DataTable
      columns={columns}
      data={filteredUsers}
      placeholder="Filtro por correo..."
      filter="email"
      emptyTitle="No hay otros usuarios"
      emptyDescription="Cuando se registren más usuarios, aparecerán aquí."
    />
  );
}
