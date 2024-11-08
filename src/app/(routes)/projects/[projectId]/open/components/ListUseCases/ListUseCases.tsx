"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { columns } from "./columns";
import { getUseCases } from "../../useCases.api";
import { UseCaseProps } from "./UseCase.types";
import { DataTable } from "@/components/Data-Table";

export default function ListUseCases(props: UseCaseProps) {
  
  const { data: session } = useSession();
  const [listUseCases, setListUseCases] = useState([]);
  const { projectId } = props;

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        console.log(projectId)
        if (session?.user?.email) {
          const useCases = await getUseCases(projectId);
          setListUseCases(useCases);
        } else {
          throw new Error("User session not available");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchUseCases();
  }, [session]);

  return (
    <DataTable
      columns={columns}
      data={listUseCases}
      placeholder="Filtro por ID ..."
      filter="name"
    />
  );
}
