"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleTheme } from "../ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getUserLogged } from "@/app/login/login.api";

export function Navbar() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          let user = await getUserLogged(session.user.email);
          setUserName(user.entity.firstName + " " + user.entity.lastName);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-[300px]"></div>
      <div className="flex gap-x-2 items-center">
        <ToggleTheme />
        {userName && (
          <p className="text-sm md:text-base whitespace-nowrap">
            <span className="block md:hidden">{userName.split(" ")[0]}</span>
            <span className="hidden md:block">{userName}</span>
          </p>
        )}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
