"use client";

import { useEffect } from "react";
import { DataTable } from "@/components/Data-Table";
import { columns } from "./columns";
import { useTestCases } from "@/context/TestCaseContext";

export default function ListTestCases({ useCaseId }: { useCaseId: string }) {
  const { testCases, isLoading } = useTestCases();

  if (isLoading) {
    return <div>Cargando casos de prueba funcionales...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={testCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  );
}
