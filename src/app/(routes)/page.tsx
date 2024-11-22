import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <h1 className="text-6xl font-bold text-center mb-6">
        CASE CRAFT
      </h1>

      <div className="flex justify-center mb-6">
        <div className="w-30 h-30 rounded-full flex items-center justify-center">
          <Image src="/programming.gif" alt="Programming" layout="intrinsic"  width={300} height={300} priority />
        </div>
      </div>

      <p className="text-2xl text-center mb-6">
        Bienvenido al Sistema de Diseño de Casos de Prueba Funcionales,
        desarrollado para la Universidad Nacional de Loja. Esta plataforma
        utiliza inteligencia artificial para generar automáticamente casos de
        prueba funcionales a partir de casos de uso, optimizando el proceso de
        evaluación y asegurando una cobertura eficiente de las funcionalidades
        del sistema.
      </p>
    </div>
  );
}
