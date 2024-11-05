"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Share2,
  ExternalLink,
} from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

export interface UseCase {
  displayId ?: string;
  id?: string;
  name: string;
  description?: string;
  entries?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
}

export const columns: ColumnDef<UseCase>[] = [
  {
    accessorKey: "displayId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "entries",
    header: "Entries",
  },
  {
    accessorKey: "preconditions",
    header: "Pre-conditions",
  },
  {
    accessorKey: "postconditions",
    header: "Post-conditions",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/projects/${id}/edit`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
