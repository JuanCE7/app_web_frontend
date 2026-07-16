"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
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

type Item = { icon: any; label: string; href: string };

function Section({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="px-4">
      <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </p>
      {items.map((item) => (
        <SidebarItem key={item.label} item={item} />
      ))}
    </div>
  );
}

export function SidebarRoutesClient({ userRole }: SidebarRoutesClientProps) {
  const router = useRouter();
  const isTester = userRole === "Tester";
  const isAdmin = userRole === "Administrator";

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="flex h-20 items-center border-b px-6 cursor-pointer"
      >
        <Logo />
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-6 overflow-y-auto py-6">
        {isTester && <Section title="General" items={dataGeneralSidebar} />}
        {isAdmin && <Section title="Gestión" items={dataAdminSideBar} />}
        <Section
          title="Soporte"
          items={isTester ? [...dataToolsSidebar, ...dataSuportSideBar] : dataSuportSideBar}
        />
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
