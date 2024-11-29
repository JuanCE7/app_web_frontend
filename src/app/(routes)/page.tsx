import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <h1 className="text-5xl font-bold text-center mb-6">
        ¡Bienvenido a TestCaseCraft!
      </h1>

      <div className="flex justify-center mb-6">
        <div className="w-30 h-30 rounded-full flex items-center justify-center">
          <Image
            src="/programming.gif"
            alt="Programming"
            layout="intrinsic"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>

      <p className="text-xl text-center mb-4">
        Un sistema para el diseño y generación de casos de prueba
        funcionales a partir de casos de uso, desarrollado para la
        Universidad Nacional de Loja.
      </p>
      <p className="text-center mb-6 text-slate-500">
        Nuestra plataforma utiliza inteligencia artificial para automatizar la
        creación de casos de prueba, garantizando una cobertura exhaustiva de las funcionalidades del
        sistema. Simplifica tu trabajo, mejora la calidad y asegura un desarrollo más eficiente.
      </p>
    </div>
  );
}
