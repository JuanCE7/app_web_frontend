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
import CardGenerateTestCase from "../CardGenerateTestCase/CardGenerateTestCase";

export function HeaderTestCases(props: TestCaseProps) {
  const { useCaseId, projectId } = props;
  const router = useRouter();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalGenerate, setOpenModalGenerate] = useState(false);

  return (
    <div className="flex items-center text-xl justify-between flex-wrap md:flex-nowrap gap-4">
  <div className="flex items-center text-xl">
    <ArrowLeft
      className="w-5 h-5 mr-2 cursor-pointer"
      onClick={() => router.push(`/projects/${projectId}/open`)}
    />
    <h2 className="text-2xl">Lista de Casos de Prueba Funcionales</h2>
  </div>
  {/* Botones */}
  <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
    <div>
      <Dialog open={openModalGenerate} onOpenChange={setOpenModalGenerate}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">
            Generar Casos de Prueba Funcionales
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generar Caso de Prueba Funcional</DialogTitle>
            <DialogDescription>
              Genera casos de prueba funcionales del caso de uso en el que te
              encuentras
            </DialogDescription>
          </DialogHeader>
          <CardGenerateTestCase
            setOpenModalGenerate={setOpenModalGenerate}
            useCaseId={useCaseId}
          />
        </DialogContent>
      </Dialog>
    </div>
    <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full md:w-auto">
          Crear Caso de Prueba Funcional
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Caso de Prueba Funcional</DialogTitle>
          <DialogDescription>
            Ingresa la Información para Crear un Nuevo Caso de Prueba Funcional
          </DialogDescription>
        </DialogHeader>
        <FormTestCase
          useCaseId={useCaseId}
          setOpenModalCreate={setOpenModalCreate}
        />
      </DialogContent>
    </Dialog>
  </div>
</div>

  );
}
