import {
  FolderKanban,
  PanelsTopLeft,
  Info,
  UsersRound ,
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

export const dataAdminSideBar = [
  {
    icon: UsersRound ,
    label: "Gestión de Roles",
    href: "/users",
  },
];
