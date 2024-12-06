"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SidebarItem from "../SidebarItem/SidebarItem";
import {
  dataAdminSideBar,
  dataGeneralSidebar,
  dataSuportSideBar,
  dataToolsSidebar,
} from "./SidebarRoutes.data";

interface SidebarRoutesClientProps {
  userRole: string;
}

export function SidebarRoutesClient({ userRole }: SidebarRoutesClientProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div onClick={() => router.push("/")} className="min-h-20 h-20 flex items-center px-6 border-b cursor-pointer">
          <Image
            src={theme === "dark" ? "/carrera2.png" : "/carrera.png"}
            alt="logo"
            width={300}
            height={300}
            priority
          />
        </div>

        {/* Sección General */}
        {userRole === "Tester" && (
          <>
            <div className="p-2 md:p-6">
              <p>GENERAL</p>
              {dataGeneralSidebar.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
            <Separator />
          </>
        )}

        {/* Sección Herramientas (solo visible para Testers) */}
        {userRole === "Tester" && (
          <>
            <div className="p-2 md:p-6">
              <p>HERRAMIENTAS</p>
              {dataToolsSidebar.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
            <Separator />
          </>
        )}

        {/* Sección Gestión (solo visible para Administradores) */}
        {userRole === "Administrator" && (
          <div className="p-2 md:p-6">
            <p>GESTIÓN</p>
            {dataAdminSideBar.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </div>
        )}

        {/* Sección Soporte (visible para todos los roles) */}
        <div className="p-2 md:p-6">
          <p>SOPORTE</p>
          {dataSuportSideBar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>

      {/* Botón de Cerrar Sesión */}
      <div>
        <div className="text-center p-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Cerrar Sesión
          </Button>
        </div>
        <Separator />
        <footer className="mt-3 p-3 text-center">
          2024. Juan Castillo - Derechos reservados.
        </footer>
      </div>
    </div>
  );
}

