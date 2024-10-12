"use client";

import SidebarItem from "../SidebarItem/SidebarItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import {
  dataGeneralSidebar,
  dataSuportSideBar,
  dataToolsSidebar,
} from "./SidebarRoutes.data";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";

export function SidebarRoutes() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div onClick={() => router.push("/")}>
          <Logo />
        </div>
        <div className="p-2 md:p-6">
          <p>GENERAL</p>
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p>TOOLS</p>
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p>SUPPORT</p>
          {dataSuportSideBar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        
      </div>
      <div>
        <div className="text-center p-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Signout
          </Button>
        </div>
        <Separator />
        <footer className="mt-3 p-3 text-center">
          2024. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
