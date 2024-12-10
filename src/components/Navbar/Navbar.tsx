"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUsers } from "@/context/UsersContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleTheme } from "../ToggleTheme";
import { UserRound } from "lucide-react";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import Image from "next/image";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative w-[300px]"></div>

      <div className="flex gap-x-2 items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center">
          <Image
            src="/gato.gif"
            alt="Perro animado"
            width={300}
            height={300}
            priority
            unoptimized
          />
        </div>
        <ToggleTheme />
        {userName && (
          <p className="text-sm md:text-base whitespace-nowrap">
            <span className="block md:hidden">{userName.split(" ")[0]}</span>
            <span className="hidden md:block">{userName}</span>
          </p>
        )}
        <UserRound />
      </div>
    </nav>
  );
}
