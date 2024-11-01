"use client";

import { useRouter } from "next/navigation";
import { UseCaseProps } from "../ListUseCases/UseCase.types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function HeaderUseCases(props: UseCaseProps) {
  const { projectId } = props;
  const router = useRouter();

  const handleCreateUseCase = () => {
    router.push(`/projects/${projectId}/open/createUseCase`);
  };

  return (
    <div className="flex items-center text-xl justify-between">
      <div className="flex items-center text-xl">
        <ArrowLeft
          className="w-5 h-5 mr-2 cursor-pointer"
          onClick={() => router.push("/projects")}
        />
        <h2 className="text-2xl">Lista de Casos de Uso</h2>
      </div>
      <div >
        <Button onClick={handleCreateUseCase}>Crear Caso de Uso</Button>
      </div>
    </div>
  );
}
