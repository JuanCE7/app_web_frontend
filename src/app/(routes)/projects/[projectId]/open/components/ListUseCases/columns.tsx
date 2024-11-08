"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useState } from "react";
import { FormUseCase } from "../FormUseCase";
import { useRouter } from "next/navigation";
import { deleteUseCase } from "../../useCases.api";
import { toast } from "@/hooks/use-toast";

export interface UseCase {
  code ?: string;
  id?: string;
  name: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
  projectId: string;
}

export const columns: ColumnDef<UseCase>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre"
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "preconditions",
    header: "Pre-condiciones",
  },
  {
    accessorKey: "postconditions",
    header: "Post-condiciones",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { code, name, description, preconditions,postconditions, mainFlow, alternateFlows, projectId } = row.original;
      const [openModalCreate, setOpenModalCreate] = useState(false);
      const [openModalDelete, setOpenModalDelete] = useState(false);
      const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(
        null
      );
      const [selectedProjectId, setSelectedProjectId] = useState<
        string | null
      >();
      const { id } = row.original;
      const router = useRouter();

      const confirmDeleteProject = () => {
        if (selectedProjectId) deleteUseCase(selectedProjectId);
        closeModal()
        router.refresh();
        toast({
          title: "Proyecto Eliminado Correctamente",
        });        
      };
      const closeModal = () => {
        setOpenModalDelete(false);
      };

      const handleEdit = () => {
        selectedUseCase({ code, name, description, preconditions, postconditions, mainFlow, alternateFlows});
        setOpenModalCreate(true);
      };
      const handleDelete = () => {
        setSelectedProjectId(id);
        setOpenModalDelete(true);
      };
      return (
        <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`open/createUseCase`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Modal de edición */}
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
                <DialogDescription>
                  Modifica la información del proyecto
                </DialogDescription>
              </DialogHeader>
              {selectedUseCase && (
                <FormUseCase
                  useCaseId={id}
                  projectId={projectId}
                  setOpenModalCreate={setOpenModalCreate}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
            <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
              <DialogHeader className="text-center">
                <DialogTitle className="text-center">
                  Confirmar Eliminación
                </DialogTitle>
                <DialogDescription className="text-center">
                  ¿Estás seguro de que deseas eliminar este elemento? Esta
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>

              <div className="flex w-full space-x-4 mt-6">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteProject}
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>

        
      );
    },
  },
];
