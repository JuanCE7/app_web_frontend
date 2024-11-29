"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { columns } from "./columns";
import { TestCaseProps } from "./TestCase.types";
import { DataTable } from "@/components/Data-Table";
import { getTestCases } from "@/lib/testCases.api";

export default function ListTestCases(props: TestCaseProps) {
  const { data: session } = useSession();
  const [listTestCases, setLisTestCases] = useState([]);
  const { useCaseId } = props;

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        if (session?.user?.email) {
          const testCases = await getTestCases(useCaseId);
          setLisTestCases(testCases);
        } else {
          throw new Error("User session not available");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchTestCases();
  }, [session]);

  return (
    <DataTable
      columns={columns}
      data={listTestCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  );
}
