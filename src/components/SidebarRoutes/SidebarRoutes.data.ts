import {
  FolderKanban,
  PanelsTopLeft,
  Info,
  UserPen,
  Settings,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: PanelsTopLeft,
    label: "Inicio",
    href: "/",
  },
  {
    icon: FolderKanban,
    label: "Proyectos",
    href: "/projects",
  },
];

export const dataToolsSidebar = [
  {
    icon: Info,
    label: "Información",
    href: "/information",
  },
];

export const dataSuportSideBar = [
  {
    icon: Settings,
    label: "Configuración",
    href: "/settings",
  },
];
