import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUseCase } from "@/app/api/useCases/useCases.api";
import { toast } from "@/hooks/use-toast";
import { FormUseCase } from "../FormUseCase";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ActionsCellProps {
  row: any; // Ajusta el tipo según la estructura de tus datos.
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
  const {
    code,
    name,
    description,
    preconditions,
    postconditions,
    mainFlow,
    alternateFlows,
    projectId,
  } = row.original;

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | null>(null);

  const router = useRouter();

  const confirmDeleteUseCase = async () => {
    try {
      if (selectedUseCaseId) {
        await deleteUseCase(selectedUseCaseId);
        closeModal();
        router.refresh();
        toast({
          title: "Caso de Uso Eliminado Correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error al eliminar el caso de uso",
        description: "Inténtalo de nuevo",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setOpenModalDelete(false);
    setTimeout(() => router.refresh(), 100);
  };

  const handleEdit = () => {
    setSelectedUseCase({
      code,
      name,
      description,
      preconditions,
      postconditions,
      mainFlow,
      alternateFlows,
      projectId,
    });
    setOpenModalCreate(true);
  };

  const handleDelete = () => {
    if (row.original.id) {
      setSelectedUseCaseId(row.original.id);
      setOpenModalDelete(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" name="AbrirMenu" className="w-8 h-8 p-0">
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
          <DropdownMenuItem asChild>
            <Link href={`/projects/${projectId}/open/${row.original.id}/openUseCase`}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir al detalle
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de edición */}
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Caso de Uso</DialogTitle>
            <DialogDescription>
              Modifica la información del caso de uso
            </DialogDescription>
          </DialogHeader>
          {selectedUseCase && (
            <FormUseCase
              useCaseId={row.original.id}
              projectId={projectId}
              setOpenModalCreate={setOpenModalCreate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de eliminación */}
      <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
        <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-center">
              ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full space-x-4 mt-6">
            <Button variant="outline" onClick={closeModal} className="flex-1">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUseCase} className="flex-1">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionsCell;
