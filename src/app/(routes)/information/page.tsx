"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Code,
  AppWindow,
} from "lucide-react";
import Image from "next/image";

const steps = [
  {
    title: "Creando Casos de Prueba en Nuestra Aplicación",
    content: `Guía paso a paso para usar nuestra herramienta de generación de casos de prueba:

1. Crear un Nuevo Proyecto
   - La descripción del proyecto es crucial
   - Una descripción detallada mejora la generación de casos de prueba
   - Ayuda en la comunicación con la Inteligencia Artificial

2. Definir Casos de Uso
   - Identifica los flujos principales del sistema
   - Documenta las interacciones esperadas del usuario

3. Generación Automática de Casos de Prueba
   - Haz clic en el botón "Generar Casos de Prueba"
   - La IA analizará tu descripción y generará casos

4. Selección de Casos de Prueba
   - Revisa los casos generados
   - Selecciona los más relevantes
   - Prioriza casos que cubran diferentes escenarios

5. Guardar y Documentar
   - Guarda los casos de prueba seleccionados
   - Revisa la explicación detallada de cada caso
   - Refina manualmente si es necesario

Consejo Pro: Mantén tus casos de prueba actualizados con los cambios en el sistema.`,
    image: "/diseno.gif",
    icon: <AppWindow className="text-blue-500" />,
  },
  {
    title: "Introducción a los Casos de Prueba Funcionales",
    content: `Los casos de prueba funcionales son herramientas fundamentales en el desarrollo de software que garantizan la calidad y el correcto funcionamiento de un sistema. 

Objetivos principales:
- Verificar que el software cumpla con los requisitos especificados
- Identificar posibles errores o comportamientos inesperados
- Validar la experiencia del usuario final`,
    image: "/disapp.gif",
    icon: <CheckCircle className="text-green-500" />,
  },
  {
    title: "Anatomía de un Caso de Prueba Funcional",
    content: `Un caso de prueba funcional efectivo debe contener:

1. Identificador único
2. Descripción del escenario
3. Precondiciones
4. Pasos de ejecución
5. Datos de entrada
6. Resultado esperado
7. Resultado real
8. Estado de la prueba (Pasado/Fallado)

Ejemplo:
ID: TC001
Descripción: Validación de inicio de sesión
Precondición: Usuario registrado
Pasos:
1. Ingresar credenciales válidas
2. Hacer clic en "Iniciar Sesión"
Resultado Esperado: Acceso al panel de usuario`,
    image: "/progra.gif",
    icon: <Code className="text-blue-500" />,
  },
  {
    title: "Técnicas Avanzadas de Generación de Casos de Prueba",
    content: `Técnicas principales para diseñar casos de prueba:

1. Partición de Equivalencia
   - Divide entradas en grupos con comportamiento similar
   - Reduce la cantidad de casos de prueba necesarios
   - Minimiza la redundancia

2. Análisis de Valores Límite
   - Enfocado en probar valores extremos
   - Detecta errores en los bordes de rangos válidos
   
3. Pruebas de Estado
   - Evalúa transiciones entre estados del sistema
   - Verifica comportamientos complejos

Consejo Pro: Combina múltiples técnicas para máxima cobertura.`,
    image: "/programming.gif",
    icon: <AlertTriangle className="text-yellow-500" />,
  },
  {
    title: "Estrategia de Implementación de Casos de Prueba",
    content: `Pasos para implementar casos de prueba efectivos:

1. Análisis de Requisitos
   - Comprende a fondo las especificaciones del sistema
   - Identifica funcionalidades críticas

2. Diseño de Casos de Prueba
   - Cubre escenarios positivos y negativos
   - Incluye casos de prueba para cada requisito

3. Preparación de Datos
   - Genera datos de prueba representativos
   - Considera variedad de escenarios

4. Ejecución y Documentación
   - Registra resultados detalladamente
   - Reporta desviaciones de los requisitos`,
    image: "/dise.gif",
    icon: <CheckCircle className="text-purple-500" />,
  },
  {
    title: "Herramientas y Automatización",
    content: `Herramientas recomendadas para casos de prueba:

Frameworks de Automatización:
- Selenium (Web)
- Cypress
- JUnit (Java)
- pytest (Python)

Beneficios de la Automatización:
- Repetibilidad de pruebas
- Reducción de errores humanos
- Ejecución rápida de pruebas
- Cobertura de múltiples escenarios

Consejo: No automatices todo. Mantén pruebas exploratorias manuales.`,
    image: "/disapp.gif",
    icon: <Code className="text-indigo-500" />,
  },
  {
    title: "Mejores Prácticas",
    content: `Consejos para casos de prueba de alta calidad:

1. Mantenibilidad
   - Escribe casos de prueba claros y concisos
   - Usa nomenclatura estándar
   - Documenta la intención de cada prueba

2. Independencia
   - Diseña casos de prueba que no dependan entre sí
   - Permite ejecución en cualquier orden

3. Cobertura
   - Apunta al 100% de cobertura de requisitos
   - Incluye casos de prueba de límites y esquinas

4. Revisión Continua
   - Actualiza casos de prueba con cambios en requisitos
   - Realiza revisiones periódicas`,
    image: "/dis.gif",
    icon: <CheckCircle className="text-teal-500" />,
  },
  {
    title: "Principios de Documentación",
    content: `Documentación efectiva de casos de prueba:

Elementos clave:
- Título descriptivo
- Precondiciones detalladas
- Pasos reproducibles
- Datos de entrada
- Resultados esperados
- Estado de la prueba
- Notas adicionales

Formato recomendado:
| ID | Título | Precondición | Pasos | Resultado Esperado | Estado |
|----|---------|--------------|---------|--------------------|--------|
| TC001 | Validación Login | Usuario registrado | 1. Ingresar credenciales | Acceso al sistema | Pasado |`,
    image: "/empezar.webp",
    icon: <AlertTriangle className="text-orange-500" />,
  },
  {
    title: "Próximos Pasos",
    content: `Recomendaciones para convertirte en un experto en casos de prueba:

1. Práctica Continua
   - Desarrolla casos de prueba regularmente
   - Analiza sistemas existentes

2. Aprendizaje
   - Estudia metodologías de testing
   - Sigue blogs y comunidades especializadas

3. Certificaciones
   - ISTQB Fundational Level
   - Certificaciones de herramientas específicas

4. Mentalidad
   - Sé meticuloso
   - Piensa como un usuario final
   - Busca siempre mejorar la calidad`,
    image: "/programming.gif",
    icon: <CheckCircle className="text-red-500" />,
  },
];

export default function ImprovedTestCaseTutorial() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index} className="block mb-2">
        {line}
      </span>
    ));
  };

  return (
    <Card className="w-full h-full shadow-lg">
      <CardContent className="p-6 sm:p-8 animate-fadeInDown">
        <div className="flex items-center mb-4 space-x-3">
          {steps[currentStep].icon}
          <div className="text-sm font-medium text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
          {steps[currentStep].title}
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative w-full sm:w-1/2 h-[250px] sm:h-[350px]">
            <Image
              src={steps[currentStep].image}
              alt={`Ilustración para ${steps[currentStep].title}`}
              className="rounded-lg object-cover shadow-md"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={currentStep === 0}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <p className="text-muted-foreground text-lg mb-6 h-[250px] sm:h-[350px] overflow-y-auto pr-4">
              {formatContent(steps[currentStep].content)}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            aria-label="Paso anterior"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-primary w-6"
                    : "bg-muted hover:bg-primary/50"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            aria-label={
              currentStep === steps.length - 1 ? "Finalizar" : "Siguiente paso"
            }
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
