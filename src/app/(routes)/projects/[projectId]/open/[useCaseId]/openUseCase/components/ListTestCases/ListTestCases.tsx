"use client";

import { DataTable } from "@/components/Data-Table";
import { columns } from "./columns";
import { useTestCases } from "@/context/TestCaseContext";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function ListTestCases({ useCaseId }: { useCaseId: string }) {
  const { testCases, isLoading } = useTestCases();

  if (isLoading) {
    return <LoadingSpinner label="Cargando casos de prueba…" />;
  }

  return (
    <DataTable
      columns={columns}
      data={testCases}
      placeholder="Filtro por código ..."
      filter="code"
      emptyTitle="No hay casos de prueba"
      emptyDescription="Genera casos con IA desde un caso de uso, o créalos manualmente."
    />
  );
}
