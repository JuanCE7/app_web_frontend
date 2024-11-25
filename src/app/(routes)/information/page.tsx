"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";

export default function Information() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenido a la Guía de Casos de Prueba Funcionales",
      content:
        "Esta guía te ayudará a entender los casos de prueba funcionales, las técnicas para generarlos y cómo implementarlos en nuestra aplicación.",
      image: "/1.png?height=200&width=400",
    },
    {
      title: "¿Qué son los Casos de Prueba Funcionales?",
      content:
        "Los casos de prueba funcionales son un conjunto de condiciones o variables bajo las cuales un analista determinará si un sistema cumple con los requisitos y funciona correctamente. Estos casos se basan en las especificaciones del software y verifican la funcionalidad del sistema.",
      image: "/2.png?height=200&width=400",
    },
    {
      title: "Técnica: Partición de Equivalencia",
      content:
        "La partición de equivalencia divide el dominio de entrada de un programa en clases de datos de las que se pueden derivar casos de prueba. Esta técnica reduce el número total de casos de prueba que deben desarrollarse.",
      image: "/3.png?height=200&width=400",
    },
    {
      title: "Técnica: Tablas de Decisión",
      content:
        "Las tablas de decisión son una forma sistemática de representar relaciones complejas lógicas. Son útiles cuando la ejecución de un programa depende de la combinación de varias condiciones.",
      image: "/4.jpg?height=200&width=400",
    },
    {
      title: "Técnica: Transición de Estados",
      content:
        "La técnica de transición de estados se utiliza para probar sistemas que pueden estar en diferentes estados y cuyo comportamiento depende de su estado actual y los eventos que ocurren.",
      image: "/5.png?height=200&width=400",
    },
    {
      title: "Técnica: Valores Límite",
      content:
        "El análisis de valores límite es una técnica de diseño de casos de prueba que examina el comportamiento en los límites de los rangos de entrada. Se basa en la premisa de que los errores tienden a ocurrir cerca de los extremos del dominio de entrada.",
      image: "/6.png?height=200&width=400",
    },
    {
      title: "Generación de Casos de Prueba en la Aplicación",
      content:
        "Para generar casos de prueba en nuestra aplicación, sigue estos pasos: \n1) Crea un nuevo proyecto, \n2) Define los casos de uso del sistema, \n 3) Utiliza las técnicas aprendidas para generar casos de prueba, \n4) Selecciona los casos más relevantes y efectivos para tu proyecto.",
      image: "/7.png?height=200&width=400",
    },
    {
      title: "¡Listo para comenzar!",
      content:
        "Has completado la guía sobre casos de prueba funcionales. Ahora puedes comenzar a crear tus propios casos de prueba utilizando nuestra aplicación. Si necesitas más información, consulta la documentación detallada en el menú de ayuda.",
        image: "/2.png?height=200&width=400",
    },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-6">
        <div className="mb-4 text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {steps.length}
        </div>
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        <div className="relative mb-4 max-w-md mx-auto">
          <Image
            src={steps[currentStep].image}
            alt={`Ilustración para ${steps[currentStep].title}`}
            className="w-full h-50 object-cover rounded-md"
          />
        </div>
        <p className="text-muted-foreground mb-6">
          {steps[currentStep].content}
        </p>
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
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
              />
            ))}
          </div>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}