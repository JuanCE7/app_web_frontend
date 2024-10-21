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
import Image from "next/image";

export interface Project {
  image?: string;
  id?: string;
  name: string;
  description?: string;
  creator?: string;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image");

      return (
        <div className="px-3">
          <Image
            src={image && typeof image === "string" && image !== "" ? image : '/no_image.png'}
            width={40}
            height={40}
            alt="Image"
            className="w-auto h-auto"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "creatorId",
    header: "creator",
  },
  {
    accessorKey: "projectCode",
    header: "projectCode",
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
            <Link href={`/projects/${id}/share`}>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
            </Link>
            <Link href={`/projects/${id}/open`}>
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
