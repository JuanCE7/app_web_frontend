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

import { useState } from "react";
import { FormTestCase } from "../FormTestCase";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { deleteTestCase } from "../../../testCases.api";

export interface UseCase {
  code?: string;
  id?: string;
  name: string;
  description?: string;
  steps?: string;
  inputData?: string;
  expectResult?: string;
  projectId: string;
}
const removeHtmlTags = (text: string) => {
  return text?.replace(/<[^>]*>/g, "\n") || "";
};
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
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "steps",
    header: "Pasos",
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue("steps"))}</span>,
  },
  {
    accessorKey: "inputData",
    header: "Datos de Entrada",
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue("inputData"))}</span>,
  },
  {
    accessorKey: "expectedResult",
    header: "Resultado esperado",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const {
        code,
        name,
        description,
        steps,
        inputData,
        expectResult,
        projectId,
      } = row.original;
      const [openModalCreate, setOpenModalCreate] = useState(false);
      const [openModalDelete, setOpenModalDelete] = useState(false);
      const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(
        null
      );
      const [selectedTestCaseId, setSelectedTestCaseId] = useState<
        string | null
      >();
      const { id } = row.original;
      const router = useRouter();

      const confirmDeleteTestCase = () => {
        if (selectedTestCaseId) deleteTestCase(selectedTestCaseId);
        closeModal();
        router.refresh();
        toast({
          title: "Caso de Uso Eliminado Correctamente",
        });
      };
      const closeModal = () => {
        setOpenModalDelete(false);
      };

      const handleEdit = () => {
        setSelectedUseCase({
          code,
          name,
          description,
          steps,
          inputData,
          expectResult,
          projectId,
        });
        setOpenModalCreate(true);
      };
      const handleDelete = () => {
        setSelectedTestCaseId(id);
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
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                Explicación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Modal de edición */}
          <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
            <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Caso de Prueba</DialogTitle>
                <DialogDescription>
                  Modifica la información del caso de prueba
                </DialogDescription>
              </DialogHeader>
              {selectedUseCase && (
                <FormTestCase
                  testCaseId={id}
                  useCaseId={projectId}
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
                  onClick={confirmDeleteTestCase}
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
