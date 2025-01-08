"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { useUsers } from "@/context/UsersContext";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>();
  const { getUserLogged } = useUsers();

  const fetchUserRole = useMemo(() => {
    return async () => {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);
          if (user?.role) {
            let role = user.role.name;
            setUserRole(role);
          } else {
            console.warn("User role is undefined or malformed:", user);
            setUserRole("");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserRole();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const roleBasedRedirect = userRole === "Tester" ? "/projects" : "/users";

  return (
    <div className="p-4 sm:p-6 md:p-8 mt-4 rounded-lg shadow-md bg-background">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 animate-fadeInDown animate-pulse">
        ¡Bienvenido a TestCaseCraft!
      </h1>

      <div className="flex justify-center mb-4 sm:mb-6 animate-fadeInDown delay-[150ms]">
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center">
          <Image
            src="/diseno.gif"
            alt="diseno"
            width={350}
            height={350}
            priority
            className="rounded-md object-cover w-full h-full"
          />
        </div>
      </div>

      <p className="text-lg sm:text-xl text-center mb-3 sm:mb-4 animate-fadeInDown delay-[300ms]">
        Un sistema para el diseño y generación de casos de prueba funcionales a
        partir de casos de uso, desarrollado para la Universidad Nacional de
        Loja.
      </p>
      <p className="text-sm sm:text-base text-center mb-4 sm:mb-6 text-slate-500 animate-fadeInDown delay-[450ms]">
        Nuestra plataforma utiliza inteligencia artificial para automatizar la
        creación de casos de prueba funcionales, garantizando una cobertura
        exhaustiva de las funcionalidades del sistema. Simplifica tu trabajo,
        mejora la calidad y asegura un desarrollo más eficiente.
      </p>

      <div className="flex justify-center items-center">
        <Button
          name="go"
          className="flex justify-center w-full sm:w-64 h-12 sm:h-14 text-sm sm:text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-teal-600 duration-300"
        >
          <Link href={roleBasedRedirect} className="flex items-center justify-center w-full h-full">
            ¡Vamos allá!
          </Link>
        </Button>
      </div>
    </div>
  );
}
