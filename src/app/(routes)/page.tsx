import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <h1 className="text-5xl font-bold text-center mb-6 animate-fadeInDown">
        ¡Bienvenido a TestCaseCraft!
      </h1>

      <div className="flex justify-center mb-6 animate-fadeInDown delay-[150ms]">
        <div className="w-30 h-30 rounded-full flex items-center justify-center">
          <Image
            src="/diseno.gif"
            alt="diseno"
            width={350}
            height={350}
            priority
            className="rounded-md object-cover"
          />
        </div>
      </div>

      <p className="text-xl text-center mb-4 animate-fadeInDown delay-[300ms]">
        Un sistema para el diseño y generación de casos de prueba funcionales a
        partir de casos de uso, desarrollado para la Universidad Nacional de
        Loja.
      </p>
      <p className="text-center mb-6 text-slate-500 animate-fadeInDown delay-[450ms]">
        Nuestra plataforma utiliza inteligencia artificial para automatizar la
        creación de casos de prueba, garantizando una cobertura exhaustiva de
        las funcionalidades del sistema. Simplifica tu trabajo, mejora la
        calidad y asegura un desarrollo más eficiente.
      </p>
      <div className="flex justify-center items-center">
        
      <Button className="flex justify-center w-full sm:w-64 h-full transition ease-in-out delay-150hover:-translate-y-1 hover:scale-110 hover:bg-teal-600 duration-300">
        <Link href={"/projects"}>
        ¡Vamos allá!
        </Link>
      </Button>
      </div>
    </div>
  );
}
