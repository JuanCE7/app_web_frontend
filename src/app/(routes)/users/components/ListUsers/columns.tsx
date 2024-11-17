"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  UserRoundX,
  UserRoundPen,
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
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { updateUser } from "../../users.api";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export interface Project {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  role?: "Administrator" | "Tester";
  status?: string;
}

export const columns: ColumnDef<Project>[] = [
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
    accessorKey: "firstName",
    header: "Nombre",
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
  },
  {
    accessorKey: "role",
    header: "Rol",
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
    cell: ({ row }) => {
      const { id, role, status } = row.original;
      const [openModal, setOpenModal] = useState(false);
      const [actionType, setActionType] = useState<"disable" | "role" | "enable" | null>(null);
      const [newRole, setNewRole] = useState<"Administrator" | "Tester">(role || "Tester");
      const router = useRouter();
  
      // Función para actualizar el rol
      const handleUpdateRole = async () => {
        if (id) {
          await updateUser(id, { role: newRole });
          setOpenModal(false);
          router.refresh();
          toast({ title: "Rol actualizado correctamente" });
        }
      };
  
      // Función para activar o desactivar usuario
      const handleToggleUserStatus = async () => {
        if (id) {
          const newStatus = status ? false : true;
          await updateUser(id, { status: newStatus });
          setOpenModal(false);
          router.refresh();
          toast({
            title: newStatus ? "Usuario activado correctamente" : "Usuario desactivado correctamente",
          });
        }
      };
  
      // Controlador para abrir los diálogos
      const openDialog = (type: "disable" | "role" | "enable") => {
        setActionType(type);
        setOpenModal(true);
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
              <DropdownMenuItem onClick={() => openDialog("role")}>
                <UserRoundPen className="w-4 h-4 mr-2" />
                Cambiar Rol
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog(status ? "disable" : "enable")}>
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
                    defaultValue={role}
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
    },
  }
  
];
