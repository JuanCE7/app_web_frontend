"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseCaseProps } from "../../../components/ListUseCases/UseCase.types";

export function HeaderUseCase(props: UseCaseProps) {
  const { projectId } = props;
  const router = useRouter();
  
  return (
    <div>
      <div className="flex items-center text-xl">
        <ArrowLeft
          className="w-5 h-5 mr-2 cursor-pointer"
          onClick={() => router.push(`/projects/${projectId}/open`)}
        />
        Regresar
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl"> Crear Caso de Uso</h2>

        <Link href={`/projects/${projectId}/open/createUseCase`}>
          <Button>Crear Caso de Uso</Button>
        </Link>
      </div>
    </div>
  );
}
