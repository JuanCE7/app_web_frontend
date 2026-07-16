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
    <div className="mx-auto max-w-4xl">
      <SessionRoleProvider allowedRoles={["Administrator", "Tester"]}>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fadeInDown delay-[150ms]">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Perfil</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualiza tu información y contraseña.
            </p>
          </div>

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
