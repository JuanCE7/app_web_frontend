"use client";

import { ArrowUpDown } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import React from "react";
import ActionsCell from "./ActionCell";

export interface Project {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  role?: string;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre del Proyecto
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "role",
    header: "Rol en el Proyecto",
    cell: ({ row }) => {
      const role = row.getValue("role");
      // Map role names to display values
      switch (role) {
        case "Owner":
          return <span>Creador</span>;
        case "Editor":
          return <span>Invitado</span>;
        default:
          return <span> Desconocido </span>;
      }
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
