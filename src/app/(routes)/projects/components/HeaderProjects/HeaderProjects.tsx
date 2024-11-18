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
import { Plus, FolderInput } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { joinProject } from "../../projects.api";
import { getUserLogged } from "@/app/login/login.api";
import { useSession } from "next-auth/react";

interface ShareErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export function HeaderProjects() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalShare, setOpenModalShare] = useState(false);
  const [projectCode, setProjectCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const getErrorMessage = (error: any): string => {
    // Si el error tiene una respuesta de la API
    if (error.response?.data) {
      const errorData = error.response.data as ShareErrorResponse;
      return errorData.message;
    }

    // Si es un error de red o el servidor no responde
    if (error.message === "Network Error") {
      return "No se pudo conectar con el servidor. Por favor, verifica tu conexión.";
    }

    // Si es un error genérico
    if (error instanceof Error) {
      return error.message;
    }

    // Para cualquier otro tipo de error
    return "Ocurrió un error inesperado al unirse al proyecto.";
  };

  const handleSubmit = async () => {
    if (!projectCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de proyecto.",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para unirte a un proyecto.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = await getUserLogged(session.user.email);

      if (user.error) {
        toast({
          title: "Error",
          description: "No se pudo obtener la información del usuario.",
          variant: "destructive",
        });
        return;
      }

      const shareData = {
        userId: user.id,
        code: projectCode.trim(),
      };

      const response = await joinProject(shareData);

      if (response.success) {
        toast({
          title: "¡Éxito!",
          description: "Te has unido al proyecto correctamente.",
        });
        setOpenModalShare(false);
        setProjectCode("");
        // Aquí podrías agregar una función para actualizar la lista de proyectos
      }
    } catch (error) {
      console.error("Error al unirse al proyecto:", error);
      const errorMessage = getErrorMessage(error);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 className="text-2xl">Lista de Proyectos</h2>

      <div className="flex flex-wrap gap-4">
        {/* Botón para Ingresar a Proyecto */}
        <Dialog open={openModalShare} onOpenChange={setOpenModalShare}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <FolderInput className="mr-2 h-4 w-4" />
              Ingresar a Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ingresar a Proyecto</DialogTitle>
              <DialogDescription>
                Ingresa el código del proyecto al cual deseas unirte
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                placeholder="Código del Proyecto"
                disabled={isLoading}
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenModalShare(false);
                    setProjectCode("");
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Procesando...
                    </span>
                  ) : (
                    "Unirme al Proyecto"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Botón para Crear Proyecto */}
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Crear Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Crear Proyecto</DialogTitle>
              <DialogDescription>
                Ingresa la Información para Crear un Nuevo Proyecto
              </DialogDescription>
            </DialogHeader>
            <FormProject setOpenModalCreate={setOpenModalCreate} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
