"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";

const steps = [
  {
    title: "Bienvenido a la Guía de Casos de Prueba Funcionales",
    content: "Esta guía te llevará paso a paso a través del proceso de creación y aplicación de casos de prueba funcionales. Aprenderás qué son, cómo generarlos y cómo implementarlos en nuestra aplicación.",
    image: "/diseno.gif",
  },
  {
    title: "¿Qué son los Casos de Prueba Funcionales?",
    content: "Los casos de prueba funcionales son conjuntos de condiciones que determinan si un sistema cumple con los requisitos y funciona correctamente. Se basan en las especificaciones del software y verifican la funcionalidad del sistema desde la perspectiva del usuario.",
    image: "/progra.gif",
  },
  {
    title: "Casos de Uso vs Casos de Prueba",
    content: "Los casos de uso describen cómo un usuario interactúa con el sistema para lograr un objetivo específico. Los casos de prueba, por otro lado, son escenarios diseñados para verificar que esas interacciones funcionan como se espera. Los casos de uso son la base para crear casos de prueba efectivos.",
    image: "/dise.gif",
  },
  {
    title: "Técnicas para Generar Casos de Prueba",
    content: "Existen varias técnicas para generar casos de prueba efectivos:\n\n1. Partición de Equivalencia: Divide los datos de entrada en grupos.\n2. Análisis de Valores Límite: Prueba los límites de los rangos de entrada.\n3. Tablas de Decisión: Representa relaciones lógicas complejas.\n4. Transición de Estados: Prueba sistemas con diferentes estados.",
    image: "/programming.gif",
  },
  {
    title: "Aplicando las Técnicas",
    content: "Para aplicar estas técnicas:\n\n1. Identifica las funcionalidades a probar.\n2. Determina las entradas y salidas esperadas.\n3. Aplica las técnicas relevantes para cada funcionalidad.\n4. Documenta los casos de prueba generados.",
    image: "/dis.gif",
  },
  {
    title: "Creando Casos de Prueba en Nuestra App",
    content: "Para crear casos de prueba en nuestra aplicación:\n\n1. Crea un nuevo proyecto.\n2. Define los casos de uso del sistema.\n3. Utiliza las técnicas aprendidas para generar casos de prueba.\n4. Ingresa los casos de prueba en la herramienta de gestión de pruebas.\n5. Asigna prioridades y ejecuta las pruebas.",
    image: "/disapp.gif",
  },
  {
    title: "¡Listo para Comenzar!",
    content: "Has completado la guía sobre casos de prueba funcionales. Ahora puedes comenzar a crear tus propios casos de prueba utilizando nuestra aplicación. Recuerda, la práctica hace al maestro. ¡Buena suerte en tu journey de testing!",
    image: "/empezar.webp",
  },
];

export default function InformationCarousel() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Card className="w-full h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {steps.length}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/2 h-[200px] sm:h-[300px]">
            <Image
              src={steps[currentStep].image}
              alt={`Ilustración para ${steps[currentStep].title}`}
              className="rounded-md object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <p className="text-muted-foreground text-xl mb-6 h-[150px] sm:h-[250px] overflow-y-auto">
              {steps[currentStep].content}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            aria-label="Paso anterior"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            aria-label={currentStep === steps.length - 1 ? "Finalizar" : "Siguiente paso"}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

