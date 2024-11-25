import { getServerSession } from "next-auth/next";
import { getUserLogged } from "@/app/login/login.api";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleTheme } from "../ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import Image from "next/image";
import { DialogDescription, DialogTitle } from "../ui/dialog";

export async function Navbar() {
  // Obtener sesión y datos del usuario desde el servidor
  const session = await getServerSession();
  let userName = "";

  if (session?.user?.email) {
    try {
      const user = await getUserLogged(session.user.email);
      userName = `${user.entity.firstName} ${user.entity.lastName}`;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

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
            src="/perro.gif"
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
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
