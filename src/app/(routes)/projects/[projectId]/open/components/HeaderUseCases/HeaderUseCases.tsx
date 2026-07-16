"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UseCaseProps } from "../ListUseCases/UseCase.types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormUseCase } from "../FormUseCase";
import { apiJson } from "@/lib/apiClient";

export function HeaderUseCases(props: UseCaseProps) {
  const { projectId } = props;
  const router = useRouter();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    apiJson<{ name?: string }>(`/projects/project/${projectId}`)
      .then((p) => setProjectName(p?.name ?? ""))
      .catch(() => setProjectName(""));
  }, [projectId]);

  return (
    <div className="mb-6 space-y-4 animate-fadeInDown delay-[150ms]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          Proyectos
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">
          {projectName || "Proyecto"}
        </span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.push("/projects")}
            aria-label="Volver a proyectos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">Casos de uso</h1>
        </div>

        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Crear caso de uso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Caso de Uso</DialogTitle>
              <DialogDescription>
                Ingresa la Información para Crear un Nuevo Caso de Uso
              </DialogDescription>
            </DialogHeader>
            <FormUseCase
              projectId={projectId}
              setOpenModalCreate={setOpenModalCreate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
