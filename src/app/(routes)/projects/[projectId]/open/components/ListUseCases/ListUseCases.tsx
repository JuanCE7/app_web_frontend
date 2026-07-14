'use client'

import { useUseCases } from "@/context/UseCaseContext";
import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function ListUseCases() {
  const { useCases, isLoading } = useUseCases();

  if (isLoading) {
    return <LoadingSpinner label="Cargando casos de uso…" />;
  }

  return (
    <DataTable
      columns={columns}
      data={useCases}
      placeholder="Filtro por nombre..."
      filter="name"
      emptyTitle="No hay casos de uso"
      emptyDescription="Crea un caso de uso para empezar a generar casos de prueba."
    />
  );
}

