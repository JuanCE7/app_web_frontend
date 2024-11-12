"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Share2,
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
import Image from "next/image";
import { useState } from "react";
import { FormProject } from "../FormProject";
import { deleteProject } from "../../projects.api";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export interface Project {
  id?: string;
  image?: string;
  name: string;
  description?: string;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const image = row.getValue("image");

      return (
        <div className="px-3">
          <Image
            src={
              image && typeof image === "string" && image !== ""
                ? image
                : "/no_image.png"
            }
            width={20}
            height={20}
            alt="Image"
            className="w-20 h-20"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre del Proyecto
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "creatorId",
    header: "Creador",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { id, name, description, image } = row.original;
      const [openModalCreate, setOpenModalCreate] = useState(false);
      const [openModalDelete, setOpenModalDelete] = useState(false);
      const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
      );
      const [selectedProjectId, setSelectedProjectId] = useState<
        string | null
      >();
      const router = useRouter();

      const confirmDeleteProject = () => {
        if (selectedProjectId) deleteProject(selectedProjectId);
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
        setSelectedProject({ id, name, description, image: image ?? "" });
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
                <span className="sr-only">Abrir Menu</span>
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
              <Link href={`/projects/${id}/share`}>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
              </Link>
              <Link href={`/projects/${id}/open`}>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ir al detalle
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
              {selectedProject && (
                <FormProject
                  projectId={id}
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
