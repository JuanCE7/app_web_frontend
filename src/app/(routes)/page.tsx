import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Universidad Nacional de loja
      </h1>

      <div className="flex justify-center mb-6">
        <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center">
          <Image src="/unl.png" alt="logo" width={200} height={200} priority />
        </div>
      </div>

      <p className="text-sm text-center mb-6">
        Bienvenido al Sistema de Diseño de Casos de Prueba Funcionales,
        desarrollado para la Universidad Nacional de Loja. Esta plataforma
        utiliza inteligencia artificial para generar automáticamente casos de
        prueba funcionales a partir de casos de uso, optimizando el proceso de
        evaluación y asegurando una cobertura eficiente de las funcionalidades
        del sistema.
      </p>

      <footer className="text-xs text-gray-500 flex justify-between">
        <span>© 2024, made with by JuanitoRex01 for a web.</span>
        <span>Lorem ipsum dolor sit amet, creado</span>
      </footer>
    </div>
  );
}
