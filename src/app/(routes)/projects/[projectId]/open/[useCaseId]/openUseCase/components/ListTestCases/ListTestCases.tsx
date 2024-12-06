"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/Data-Table";
import { columns } from "./columns";
import { getTestCases } from "@/app/api/testCases/testCases.api";

export default function ListTestCases({
  useCaseId,
}: {
  useCaseId: string;
}) {
  const [listTestsCases, setListTestsCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestCases() {
      try {
        const testCases = await getTestCases(useCaseId);
        setListTestsCases(testCases);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestCases();
  }, [useCaseId, listTestsCases]);

  if (isLoading) {
    return <div>Cargando casos de prueba...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={listTestsCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  );
}
