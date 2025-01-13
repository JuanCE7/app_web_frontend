"use client";
import SessionRoleProvider from "@/context/RoleProvider";
import { FormUser } from "./components/FormUser";
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
import { KeyRound } from "lucide-react";
import { FormPassword } from "./components/FormUser/FormPassword";

export default function Settings() {
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Administrator", "Tester"]}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fadeInDown delay-[150ms]">
          <h2 className="text-2xl animate-fadeInDown delay-[150ms]">
            Configuración de Perfil
          </h2>

          <Dialog open={openModalChangePassword} onOpenChange={setOpenModalChangePassword}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" variant={"outline"}>
                <KeyRound className="mr-2 h-4 w-4" />
                Cambiar Contraseña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cambiar Contraseña</DialogTitle>
                <DialogDescription>
                  Cambia la contraseña de tu usuario con una nueva de mínimo 6 caracteres.
                </DialogDescription>
              </DialogHeader>
              <FormPassword setOpenModalChangePassword={setOpenModalChangePassword}/>
            </DialogContent>
          </Dialog>
        </div>
        <FormUser />
      </SessionRoleProvider>
    </div>
  );
}
