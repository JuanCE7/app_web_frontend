import Image from "next/image";

export default async function Dashboard() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-7xl font-bold text-center mb-6">
        CASE CRAFT
      </h1>

      <div className="flex justify-center mb-6">
        <div className="w-70 h-70 rounded-full flex items-center justify-center">
          <Image src="/gato.gif" alt="logo" width={400} height={400} priority />
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
