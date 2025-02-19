import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserRoundX,
  UserRoundPen,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/context/UsersContext";
import { ColumnDef } from "@tanstack/react-table";

export interface User {
  id?: string;
  entity?: {
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  email?: string;
  role?: {
    name: "Administrator" | "Tester";
  };
  status?: string;
}

// New component to manage the actions for each row
const ActionsCell = ({ row }: { row: any }) => {
  const { id, role, status } = row.original;
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState<
    "disable" | "role" | "enable" | null
  >(null);
  const [newRole, setNewRole] = useState<"Administrator" | "Tester">(
    role.name || "Tester"
  );
  const { updateUser } = useUsers();
  // Función para actualizar el rol
  const handleUpdateRole = async () => {
    if (id) {
      await updateUser(id, { role: newRole });
      setOpenModal(false);
      
      toast({ title: "Rol actualizado correctamente" });
    }
  };

  // Función para activar o desactivar usuario
  const handleToggleUserStatus = async () => {
    if (id) {
      const newStatus = status ? false : true;
      await updateUser(id, { status: newStatus });
      setOpenModal(false);
      toast({
        title: newStatus
          ? "Usuario activado correctamente"
          : "Usuario desactivado correctamente",
      });
    }
  };

  // Controlador para abrir los diálogos
  const openDialog = (type: "disable" | "role" | "enable", user: User) => {
    setActionType(type);
    if (user?.role?.name) setNewRole(user.role.name);
    setOpenModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" name="Abrir Menu" className="w-8 h-4 p-0">
            <span className="sr-only">Abrir Menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openDialog("role", row.original)}>
            <UserRoundPen className="w-4 h-4 mr-2" />
            Cambiar Rol
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openDialog(status ? "disable" : "enable", row.original)
            }
          >
            {status ? (
              <>
                <UserRoundX className="w-4 h-4 mr-2" />
                Desactivar
              </>
            ) : (
              <>
                <UserRoundPen className="w-4 h-4 mr-2" />
                Activar
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo para cambiar rol o activar/desactivar */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">
              {actionType === "role"
                ? "Cambiar rol de usuario"
                : actionType === "enable"
                ? "Confirmar activación"
                : "Confirmar desactivación"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {actionType === "role"
                ? "Puedes cambiar el rol de un usuario"
                : actionType === "enable"
                ? "¿Estás seguro de que deseas activar a este usuario?"
                : "¿Estás seguro de que deseas desactivar a este usuario?"}
            </DialogDescription>
          </DialogHeader>

          {actionType === "role" && (
            <div className="w-full mt-4">
              <Select
                value={newRole}
                onValueChange={(value) =>
                  setNewRole(value as "Administrator" | "Tester")
                }
                defaultValue={role.name}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol">
                    {newRole}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrador</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateRole} className="mt-4 w-full">
                Guardar
              </Button>
            </div>
          )}

          {actionType === "disable" || actionType === "enable" ? (
            <div className="flex w-full space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setOpenModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant={actionType === "disable" ? "destructive" : "default"}
                onClick={handleToggleUserStatus}
                className="flex-1"
              >
                {actionType === "disable" ? "Desactivar" : "Activar"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    header: "Nombre",
    accessorFn: (row) => row.entity?.firstName || "",
  },
  {
    header: "Apellido",
    accessorFn: (row) => row.entity?.lastName || "",
  },
  {
    header: "Rol",
    accessorFn: (row) => row.role?.name || "",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <span className={row.original.status ? "text-green-600" : "text-red-600"}>
        {row.original.status ? "Activo" : "Desactivado"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
