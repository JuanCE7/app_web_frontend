'use client'

import { useUseCases } from "@/context/UseCaseContext";
import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";

export default function ListUseCases() {
  const { useCases, isLoading } = useUseCases();

  if (isLoading) {
    return <div>Cargando casos de uso...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={useCases}
      placeholder="Filtro por nombre..."
      filter="name"
    />
  );
}

