"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectCard } from "./ProjectCard";
import { FormProject } from "../FormProject";

function NewProjectCard() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-6 w-6" />
          </span>
          <span className="font-semibold">Nuevo proyecto</span>
          <span className="max-w-[200px] text-sm text-muted-foreground">
            Empieza otro sistema y genera sus casos de prueba con IA.
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crear Proyecto</DialogTitle>
          <DialogDescription>
            Ingresa la información para crear un nuevo proyecto
          </DialogDescription>
        </DialogHeader>
        <FormProject setOpenModalCreate={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export default function ListProjects() {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return <LoadingSpinner label="Cargando proyectos…" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <NewProjectCard />
    </div>
  );
}
