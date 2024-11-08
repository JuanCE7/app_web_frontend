"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FormProject } from "../FormProject/FormProject";

export function HeaderProjects() {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl"> Lista de Proyectos</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Crear Proyecto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Crear Proyecto</DialogTitle>
            <DialogDescription>Ingresa la Información para Crear un Nuevo Proyecto</DialogDescription>
          </DialogHeader>
          <FormProject setOpenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
