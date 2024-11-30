import { columns } from "./columns";
import { DataTable } from "@/components/Data-Table";
import { getTestCases } from "@/lib/testCases.api";
import { headers } from 'next/headers'

export default async function ListTestCases({ useCaseId }: { useCaseId: string }) {
  headers();
  const listTestCases = await getTestCases(useCaseId);
  console.log("listTestCases")
  console.log(listTestCases)
  return (
    <DataTable
      columns={columns}
      data={listTestCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  );
}
