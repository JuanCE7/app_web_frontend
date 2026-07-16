"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FolderKanban,
  Lock,
  UsersRound,
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/context/UsersContext";
import { apiJson } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

interface DashboardStats {
  projects: number;
  testCases: number;
  hasUseCases: boolean;
  hasTestCases: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { getUserLogged } = useUsers();
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState<string>();
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    testCases: 0,
    hasUseCases: false,
    hasTestCases: false,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const user = await getUserLogged(session.user.email);
      setFirstName(user?.entity?.firstName ?? "");
      setRole(user?.role?.name);

      const userId = user?.id;
      if (!userId) return;

      // Conteos calculados en el cliente a partir de los endpoints existentes.
      const projects: any[] = await apiJson(`/projects/${userId}`).catch(
        () => []
      );
      const useCaseArrays = await Promise.all(
        projects.map((p) =>
          apiJson<any[]>(`/usecases/${p.id}`).catch(() => [])
        )
      );
      const allUseCases = useCaseArrays.flat();
      const testCaseArrays = await Promise.all(
        allUseCases.map((uc: any) =>
          apiJson<any[]>(`/testcases/${uc.id}`).catch(() => [])
        )
      );
      const testCases = testCaseArrays.reduce(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      );

      setStats({
        projects: projects.length,
        testCases,
        hasUseCases: allUseCases.length > 0,
        hasTestCases: testCases > 0,
      });
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [session, getUserLogged]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading" || loading) {
    return <LoadingSpinner fullScreen label="Cargando tu panel…" />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Vista de administrador: gestión de usuarios en lugar del onboarding.
  if (role === "Administrator") {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Hola, {firstName} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra los usuarios y roles del sistema.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold">Gestión de usuarios</p>
                <p className="text-sm text-muted-foreground">
                  Activa cuentas y asigna roles a tu equipo.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/users">
                Ir a usuarios <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    {
      title: "Crea tu primer proyecto",
      description: "Dale un nombre y una descripción a tu sistema.",
      done: stats.projects > 0,
      cta: { label: "Crear proyecto", href: "/projects" },
    },
    {
      title: "Define tus casos de uso",
      description: "Describe los flujos principales de tu sistema.",
      done: stats.hasUseCases,
      cta: { label: "Ir a proyectos", href: "/projects" },
    },
    {
      title: "Genera casos de prueba con IA",
      description: "La IA crea la cobertura funcional por ti.",
      done: stats.hasTestCases,
      cta: { label: "Ir a proyectos", href: "/projects" },
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const remaining = steps.length - completed;
  // Primer paso no completado = paso activo (los siguientes quedan bloqueados).
  const activeIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Hola, {firstName} 👋</h1>
        <p className="mt-1 text-muted-foreground">
          {remaining > 0
            ? `Estás a ${remaining} paso${
                remaining > 1 ? "s" : ""
              } de tu primer set de casos de prueba.`
            : "¡Listo! Ya tienes casos de prueba generados. Sigue creando."}
        </p>
      </div>

      {/* Onboarding */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Primeros pasos</h2>
            <span className="text-sm font-medium text-muted-foreground">
              {completed} / {steps.length}
            </span>
          </div>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(completed / steps.length) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => {
              const isActive = i === activeIndex;
              const isLocked = !step.done && !isActive;
              return (
                <div
                  key={step.title}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4",
                    isActive && "border-primary/40 bg-primary/5",
                    isLocked && "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      step.done
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {step.done ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : isActive ? (
                    <Button asChild size="sm">
                      <Link href={step.cta.href}>{step.cta.label}</Link>
                    </Button>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={<FolderKanban className="h-5 w-5" />}
          value={stats.projects}
          label="Proyectos activos"
        />
        <StatCard
          icon={<FileCheck2 className="h-5 w-5" />}
          value={stats.testCases}
          label="Casos de prueba generados"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-3xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
