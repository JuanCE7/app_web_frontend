import { cache } from 'react';
import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { getUseCases } from "@/lib/useCases.api";
import { headers } from 'next/headers'

export default async function ListUseCases({ projectId }: { projectId: string }) {
  headers();
  const listUseCases = await getUseCases(projectId);

  return (
    <DataTable
      columns={columns}
      data={listUseCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  );
}