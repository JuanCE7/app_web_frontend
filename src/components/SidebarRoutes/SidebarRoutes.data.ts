import {
  SquareUserRound,
  FolderKanban,
  PanelsTopLeft,
  ShieldCheck,
  Info,
  UserPen,
  Settings,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: PanelsTopLeft,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: UserPen,
    label: "Profile",
    href: "/task",
  },
];

export const dataToolsSidebar = [
  {
    icon: Info,
    label: "Information",
    href: "/information",
  },
  {
    icon: SquareUserRound,
    label: "About",
    href: "/about",
  },
];

export const dataSuportSideBar = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
  {
    icon: ShieldCheck,
    label: "Security",
    href: "/security",
  },
];
