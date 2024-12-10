"use client";

import {
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState, useCallback, useMemo } from "react";
import { FormProject } from "../FormProject";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { GeneratePDF } from "../GeneratePDF";
import { useSession } from "next-auth/react";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";

export interface Project {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  role?: string;
}

interface ModalState {
  create: boolean;
  delete: boolean;
  share: boolean;
  export: boolean;
  exit: boolean;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = React.memo(
  ({ open, onOpenChange, title, description, onConfirm }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            {title.includes("Eliminación") ? "Eliminar" : "Salir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
);

interface ActionsCellProps {
  row: any;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
  const { id, name, description, code, role } = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const { getUserLogged } = useUsers();

  const [modalState, setModalState] = useState<ModalState>({
    create: false,
    delete: false,
    share: false,
    export: false,
    exit: false,
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const toggleModal = useCallback(
    (modalName: keyof ModalState, open: boolean) => {
      setModalState((prev) => ({ ...prev, [modalName]: open }));
    },
    []
  );

  const { refreshProjects, exitProject, deleteProject} = useProjects();

  const handleAction = useCallback(
    async (action: () => Promise<void>, successMessage: string) => {
      try {
        await action();
        await refreshProjects();
        toast({ title: successMessage });
      } catch (error) {
        toast({
          title: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    },
    [refreshProjects]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Error al copiar el código", variant: "destructive" });
    }
  }, [code]);

  const confirmDeleteProject = useCallback(
    () =>
      handleAction(async () => {
        if (selectedProjectId) {
          await deleteProject(selectedProjectId);
          toggleModal("delete", false);
        }
      }, "Proyecto Eliminado Correctamente"),
    [selectedProjectId, router, toggleModal]
  );

  const confirmExitProject = useCallback(
    () =>
      handleAction(async () => {
        if (session?.user?.email && selectedProjectId) {
          const user = await getUserLogged(session.user.email);
          const exitData = {
            userId: user.id || "",
            projectId: selectedProjectId,
          };
          await exitProject(exitData);
          toggleModal("exit", false);
        }
      }, "Has salido del proyecto correctamente"),
    [session, selectedProjectId, toggleModal, handleAction]
  );

  const handleEdit = useCallback(() => {
    setSelectedProject({ id, name, description });
    toggleModal("create", true);
  }, [id, name, description, toggleModal]);

  const handleDelete = useCallback(() => {
    if (id) {
      setSelectedProjectId(id);
      toggleModal("delete", true);
    }
  }, [id, toggleModal]);

  const handleShare = useCallback(() => {
    if (id) {
      setSelectedProjectId(id);
      toggleModal("share", true);
    }
  }, [id, toggleModal]);

  const handleExport = useCallback(() => {
    if (id) {
      setSelectedProject({ id, name, description });
      setSelectedProjectId(id);
      toggleModal("export", true);
    }
  }, [id, name, description, toggleModal]);

  const handleExit = useCallback(() => {
    if (id) {
      setSelectedProjectId(id);
      toggleModal("exit", true);
    }
  }, [id, toggleModal]);

  // Memoize dropdown menu to prevent unnecessary re-renders
  const dropdownMenu = useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" name="Abrir Menu" className="w-8 h-8 p-0">
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
            <>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </DropdownMenuItem>
            </>
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
    ),
    [role, handleEdit, handleDelete, handleShare, handleExport, handleExit]
  );

  return (
    <>
      {dropdownMenu}

      {/* Export PDF Modal */}
      <Dialog
        open={modalState.export}
        onOpenChange={(open) => toggleModal("export", open)}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Exportar Proyecto en PDF</DialogTitle>
            <DialogDescription>
              Visualiza la información del proyecto y descarga el pdf generado
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <GeneratePDF
              projectId={id}
              setOpenModalGenerate={(open: boolean) =>
                toggleModal("export", open)
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog
        open={modalState.create}
        onOpenChange={(open) => toggleModal("create", open)}
      >
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
              setOpenModalCreate={(open: boolean) =>
                toggleModal("create", open)
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        open={modalState.delete}
        onOpenChange={(open) => toggleModal("delete", open)}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteProject}
      />

      {/* Share Project Modal */}
      <Dialog
        open={modalState.share}
        onOpenChange={(open) => toggleModal("share", open)}
      >
        <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">
              Compartir el proyecto
            </DialogTitle>
            <DialogDescription>
              Código de acceso del proyecto, puedes compartir este código con
              los usuarios que desees compartir el proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full space-x-4 mt-6">
            <Input readOnly value={code || ""} className="flex-1" />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="h-10 w-10"
              name="copy"
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

      {/* Exit Project Modal */}
      <ConfirmDialog
        open={modalState.exit}
        onOpenChange={(open) => toggleModal("exit", open)}
        title="Confirmar Salida del Proyecto"
        description="¿Estás seguro de que deseas salir de este proyecto? Esta acción no se puede deshacer."
        onConfirm={confirmExitProject}
      />
    </>
  );
};
export default ActionsCell;