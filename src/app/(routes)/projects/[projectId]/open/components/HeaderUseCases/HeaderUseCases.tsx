"use client";

import { useRouter } from "next/navigation";
import { UseCaseProps } from "../ListUseCases/UseCase.types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormUseCase } from "../FormUseCase";

export function HeaderUseCases(props: UseCaseProps) {
  const { projectId } = props;
  const router = useRouter();
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center text-xl justify-between">
      <div className="flex items-center text-xl">
        <ArrowLeft
          className="w-5 h-5 mr-2 cursor-pointer"
          onClick={() => router.push("/projects")}
        />
        <h2 className="text-2xl">Lista de Casos de Uso</h2>
      </div>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Crear Caso de Uso</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Caso de Uso</DialogTitle>
            <DialogDescription>Ingresa la Información para Crear un Nuevo Caso de Uso</DialogDescription>
          </DialogHeader>
          <FormUseCase projectId={projectId} setOpenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
