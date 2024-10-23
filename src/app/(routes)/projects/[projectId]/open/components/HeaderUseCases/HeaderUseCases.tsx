"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseCaseProps } from "../ListUseCases/UseCase.types";
import Link from "next/link";

export function HeaderUseCases(props: UseCaseProps) {
  const { projectId } = props;
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl"> Lista de Casos de Uso</h2>

      <Link href={`/projects/${projectId}/open/createUseCase`}>
        <Button>Crear Caso de Uso</Button>
      </Link>
    </div>
  );
}
