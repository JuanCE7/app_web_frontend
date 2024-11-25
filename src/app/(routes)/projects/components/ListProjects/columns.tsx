"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  LogOut,
  ExternalLink,
  Check,
  FileDown,
  Copy,
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
import { deleteProject, exitProject } from "../../projects.api";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { GeneratePDF } from "../GeneratePDF";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";

export interface Project {
  id?: string;
  code?: string;
  image?: string;
  name: string;
  description?: string;
  role?: string;
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
            className="w-20 h-20 object-cover"
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
    accessorKey: "role",
    header: "Rol en el Proyecto",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { id, name, description, image, code, role } = row.original;
      const [openModalCreate, setOpenModalCreate] = useState(false);
      const [openModalDelete, setOpenModalDelete] = useState(false);
      const [openModalShare, setOpenModalShare] = useState(false);
      const [openModalExport, setOpenModalExport] = useState(false);
      const [openModalExit, setOpenModalExit] = useState(false);
      const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
      );
      const [selectedProjectId, setSelectedProjectId] = useState<
        string | null
      >();
      const router = useRouter();
      const [copied, setCopied] = useState(false);
      const [projectCode] = useState(code || "");
      const { data: session } = useSession();

      const handleCopy = async () => {
        await navigator.clipboard.writeText(projectCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      const confirmDeleteProject = async () => {
        if (selectedProjectId) await deleteProject(selectedProjectId);
        closeModal();
        router.refresh();
        toast({
          title: "Proyecto Eliminado Correctamente",
        });
      };

      const confirmExitProject = async () => {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          const exitData = {
            userId: user.id || "",
            projectId: selectedProjectId || "",
          };
          exitProject(exitData);
          closeModal();
          router.refresh();
          toast({
            title: "Has salido del proyecto correctamente",
          });
        }
      };

      const closeModal = () => {
        setOpenModalDelete(false);
        setOpenModalExit(false);
      };

      const handleEdit = () => {
        setSelectedProject({ id, name, description, image: image ?? "" });
        setOpenModalCreate(true);
      };

      const handleDelete = () => {
        setSelectedProjectId(id);
        setOpenModalDelete(true);
      };

      const handleShare = () => {
        setSelectedProjectId(id);
        setOpenModalShare(true);
      };

      const handleExport = () => {
        setSelectedProject({ id, name, description, image: image ?? "" });
        setSelectedProjectId(id);
        setOpenModalExport(true);
      };

      const handleExit = () => {
        setSelectedProjectId(id);
        setOpenModalExit(true);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Abrir Menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              {role === "Owner" && (
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              )}
              {role === "Owner" && (
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/projects/${id}/open`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ir al detalle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Exportar en PDF
              </DropdownMenuItem>
              {role === "Editor" && (
                <DropdownMenuItem onClick={handleExit}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir del proyecto
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={openModalExport} onOpenChange={setOpenModalExport}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Exportar Proyecto en PDF</DialogTitle>
                <DialogDescription>
                  Visualiza la información del proyecto y descarga el pdf
                  generado
                </DialogDescription>
              </DialogHeader>
              {selectedProject && (
                <GeneratePDF
                  projectId={id}
                  setOpenModalGenerate={setOpenModalExport}
                />
              )}
            </DialogContent>
          </Dialog>

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
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar este elemento? Esta
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full space-x-4 mt-6">
                <Button
                  variant="outline"
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

          <Dialog open={openModalShare} onOpenChange={setOpenModalShare}>
            <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
              <DialogHeader className="text-center">
                <DialogTitle className="text-center">
                  Compartir el proyecto
                </DialogTitle>
                <DialogDescription>
                  Código de acceso del proyecto, puedes compartir este código
                  con los usuarios que desees compartir el proyecto
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full space-x-4 mt-6">
                <Input readOnly value={projectCode} className="flex-1" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-10 w-10"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openModalExit} onOpenChange={setOpenModalExit}>
            <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
              <DialogHeader className="text-center">
                <DialogTitle className="text-center">
                  Confirmar Salida del Proyecto
                </DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas salir de este proyecto? Esta
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmExitProject}
                  className="flex-1"
                >
                  Salir del Proyecto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
