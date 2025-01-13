import { ArrowUpDown } from "lucide-react";
import ActionsCell from "./ActionsCell"; // Ajusta la ruta
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { UseCase } from "@/components/pdf/pdf.types";

const removeHtmlTags = (text: string | undefined): string => {
  if (typeof text !== "string") return "";

  // Reemplaza las etiquetas HTML por un salto de línea solo entre etiquetas
  return text
    .replace(/<\/[^>]+>/g, "\n") // Reemplaza etiquetas de cierre por saltos de línea
    .replace(/<[^>]+>/g, "") // Elimina las etiquetas de apertura
    .replace(/\n\s*\n/g, "\n") // Elimina saltos de línea repetidos consecutivos
    .trim(); // Elimina espacios o saltos al inicio y final
};

export const columns: ColumnDef<UseCase>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "preconditions",
    header: "Pre-condiciones",
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue("preconditions"))}</span>,
  },
  {
    accessorKey: "postconditions",
    header: "Post-condiciones",
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue("postconditions"))}</span>,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell row={row} />, 
  },
];
