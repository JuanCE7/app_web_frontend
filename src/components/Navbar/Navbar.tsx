"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUsers } from "@/context/UsersContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleTheme } from "../ToggleTheme";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Navbar() {
  const { data: session } = useSession();
  const { getUserLogged } = useUsers();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);
          setUserName(`${user.entity.firstName} ${user.entity.lastName}`);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    fetchUser();
  }, [session, getUserLogged]);

  return (
    <nav className="flex h-20 w-full items-center justify-between border-b bg-card px-4 md:px-6">
      {/* Menú móvil */}
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center rounded-md p-2 hover:bg-muted">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <DialogTitle className="sr-only">Menú</DialogTitle>
            <DialogDescription className="sr-only">
              Navegación principal
            </DialogDescription>
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>

      {/* Espaciador para empujar el contenido a la derecha */}
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <ToggleTheme />
        {userName && (
          <p className="hidden text-sm font-medium md:block">{userName}</p>
        )}
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {getInitials(userName) || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
