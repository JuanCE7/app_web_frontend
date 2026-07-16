"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Inbox } from "lucide-react";
import { useUseCases } from "@/context/UseCaseContext";
import { apiJson } from "@/lib/apiClient";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionsCell from "./ActionsCell";

export default function ListUseCases() {
  const { useCases, isLoading } = useUseCases();
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Conteo de casos de prueba por caso de uso (client-side) para el badge de estado.
  useEffect(() => {
    let cancelled = false;
    async function loadCounts() {
      const entries = await Promise.all(
        useCases.map(async (uc) => {
          const tcs = await apiJson<any[]>(`/testcases/${uc.id}`).catch(
            () => []
          );
          return [uc.id, Array.isArray(tcs) ? tcs.length : 0] as const;
        })
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    }
    if (useCases.length > 0) loadCounts();
    return () => {
      cancelled = true;
    };
  }, [useCases]);

  if (isLoading) {
    return <LoadingSpinner label="Cargando casos de uso…" />;
  }

  const pending = useCases.filter((uc) => (counts[uc.id] ?? 0) === 0);
  const firstPending = pending[0];

  return (
    <div className="space-y-4">
      {/* Banner de generación con IA (acento violeta) */}
      {useCases.length > 0 && firstPending && (
        <div className="flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/50 dark:bg-violet-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">
                Tienes {pending.length} caso{pending.length > 1 ? "s" : ""} de uso
                {pending.length > 1 ? " listos" : " listo"}
              </p>
              <p className="text-sm text-muted-foreground">
                Genera automáticamente sus casos de prueba funcionales en
                segundos.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            <Link
              href={`/projects/${firstPending.projectId}/open/${firstPending.id}/openUseCase`}
            >
              Generar ahora
            </Link>
          </Button>
        </div>
      )}

      {/* Tabla de casos de uso */}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Caso de uso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {useCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium">No hay casos de uso</p>
                    <p className="text-sm text-muted-foreground">
                      Crea un caso de uso para empezar a generar casos de prueba.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              useCases.map((uc) => {
                const count = counts[uc.id] ?? 0;
                const generated = count > 0;
                return (
                  <TableRow key={uc.id}>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {uc.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="font-medium">{uc.name}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {uc.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      {generated ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {count} caso{count > 1 ? "s" : ""} generado
                          {count > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-amber-600 dark:text-amber-400">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Pendiente
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant={generated ? "outline" : "default"}
                          size="sm"
                        >
                          <Link
                            href={`/projects/${uc.projectId}/open/${uc.id}/openUseCase`}
                          >
                            {generated ? "Ver casos" : "Generar"}
                          </Link>
                        </Button>
                        <ActionsCell row={{ original: uc }} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
