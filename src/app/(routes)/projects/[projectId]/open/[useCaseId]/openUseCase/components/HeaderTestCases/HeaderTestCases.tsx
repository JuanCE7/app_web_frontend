"use client";

import { useRouter } from "next/navigation";
import { TestCaseProps } from "../ListTestCases/TestCase.types";
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
import { FormTestCase } from "../FormTestCase";

export function HeaderTestCases(props: TestCaseProps) {
  const { useCaseId, projectId } = props;
  const router = useRouter();
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center text-xl justify-between">
      <div className="flex items-center text-xl">
        <ArrowLeft
          className="w-5 h-5 mr-2 cursor-pointer"
          onClick={() => router.push(`/projects/${projectId}/open`)}
        />
        <h2 className="text-2xl">Lista de Casos de Prueba Funcionales</h2>
      </div>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Crear Caso de Prueba Funcional</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Caso de Prueba Funcional</DialogTitle>
            <DialogDescription>Ingresa la Información para Crear un Nuevo Caso de Prueba Funcional</DialogDescription>
          </DialogHeader>
          <FormTestCase useCaseId={useCaseId} setOpenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
