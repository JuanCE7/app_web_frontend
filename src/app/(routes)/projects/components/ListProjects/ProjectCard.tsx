"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionCell";

export interface ProjectCardData {
  id: string;
  code: string;
  name: string;
  description?: string;
  role: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "P"
  );
}

function roleLabel(role: string): string {
  if (role === "Owner") return "Creador";
  if (role === "Editor") return "Invitado";
  return "Miembro";
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {getInitials(project.name)}
          </span>
          <Badge variant="secondary">{roleLabel(project.role)}</Badge>
        </div>

        <h3 className="line-clamp-1 text-lg font-semibold">{project.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {project.description || "Sin descripción"}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button asChild className="flex-1">
            <Link href={`/projects/${project.id}/open`}>Abrir</Link>
          </Button>
          {/* Reutiliza toda la lógica de acciones (editar/eliminar/compartir/
              exportar/salir) y sus modales, gateada por rol. */}
          <ActionsCell row={{ original: project }} />
        </div>
      </CardContent>
    </Card>
  );
}
