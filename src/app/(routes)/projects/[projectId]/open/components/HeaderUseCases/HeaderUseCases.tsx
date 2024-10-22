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

export function HeaderUseCases() {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl"> Lista de Casos de Uso</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Crear Caso de Uso
            
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Crear Caso de Uso</DialogTitle>
            <DialogDescription>Crear Nuevo Caso de Uso</DialogDescription>
          </DialogHeader>
          {/* <FormCreateUseCase setOpenModalCreate={setOpenModalCreate}/> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
