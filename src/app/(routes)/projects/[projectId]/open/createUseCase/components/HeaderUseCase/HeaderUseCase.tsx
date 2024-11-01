"use client";

import { ArrowLeft } from "lucide-react";
import { HeaderUseCaseProps } from "./HeaderUseCase.types";
import { useRouter } from "next/navigation";

export function HeaderUseCase(props: HeaderUseCaseProps) {
  const { projectId, useCaseId } = props;
  const router = useRouter();
  return (
    <div className="flex items-center text-xl mb-5">
      <ArrowLeft
        className="w-5 h-5 mr-2 cursor-pointer"
        onClick={() => router.push(`/projects/${projectId}/open`)}
      />      
      <h2 className="text-2xl"> Crear Caso de Uso</h2>
    </div>
  );
}
