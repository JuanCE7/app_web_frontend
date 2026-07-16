"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { SidebarItemProps } from "./SidebarItem.types";

export default function SidebarItem(props: SidebarItemProps) {
  const { item } = props;
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const activePath = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-3 mt-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        activePath && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      {label}
    </Link>
  );
}
