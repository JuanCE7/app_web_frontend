"use client";

import SidebarItem from "../SidebarItem/SidebarItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import {
  dataAdminSideBar,
  dataGeneralSidebar,
  dataSuportSideBar,
  dataToolsSidebar,
} from "./SidebarRoutes.data";
import { useRouter } from "next/navigation";
import { getUserLogged } from "@/app/login/login.api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export function SidebarRoutes() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Obtener la información del usuario al cargar el componente
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);
          setUserRole(user.role.name);
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        }
      }
    };

    fetchUserRole();
  }, [session?.user?.email]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div onClick={() => router.push("/")}>
          <div className="min-h-20 h-20 flex items-center px-6 border-b cursor-pointer">
            <Image
              src="/carrera.png"
              alt="logo"
              width={300}
              height={300}
              priority
              className="dark:filter dark:invert"
            />
          </div>
        </div>

        {/* Sección General */}
        {userRole === "Tester" ? (
          <>
            <div className="p-2 md:p-6">
              <p>GENERAL</p>
              {dataGeneralSidebar.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
            <Separator />
          </>
        ) : null}
        {/* Sección Herramientas (solo visible para Admins y Owners) */}
        {userRole === "Tester" ? (
          <>
            <div className="p-2 md:p-6">
              <p>HERRAMIENTAS</p>
              {dataToolsSidebar.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
            <Separator />
          </>
        ) : null}

        {userRole === "Administrator" ? (
          <>
            <div className="p-2 md:p-6">
              <p>GESTIÓN</p>
              {dataAdminSideBar.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
          </>
        ) : null}
        {/* Sección Soporte (visible para todos los roles) */}

        <>
          <div className="p-2 md:p-6">
            <p>SOPORTE</p>
            {dataSuportSideBar.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </div>
        </>
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
