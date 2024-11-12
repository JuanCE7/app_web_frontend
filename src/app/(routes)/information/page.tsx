"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Information() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenido a nuestra aplicación",
      content:
        "Esta guía te ayudará a comenzar con nuestra aplicación. Sigue los pasos para aprender todas las funcionalidades clave.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Paso 1: Crear una cuenta",
      content:
        "Para comenzar, haz clic en el botón 'Registrarse' en la esquina superior derecha. Completa el formulario con tu información personal.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Paso 2: Configurar tu perfil",
      content:
        "Una vez que hayas iniciado sesión, ve a la sección 'Perfil' y añade una foto de perfil y completa tu información personal.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Paso 3: Explorar el dashboard",
      content:
        "En el dashboard principal, encontrarás un resumen de tus actividades y accesos rápidos a las principales funciones.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Paso 4: Crear tu primera tarea",
      content:
        "Haz clic en el botón '+' para crear una nueva tarea. Rellena los detalles y establece una fecha de vencimiento.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "¡Listo para comenzar!",
      content:
        "Has completado la guía básica. Explora más funciones en el menú de ayuda si necesitas más información.",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4 text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {steps.length}
        </div>
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        {/* <div className="aspect-video relative mb-4">
          <img
            src={steps[currentStep].image}
            alt={`Ilustración para ${steps[currentStep].title}`}
            className="w-full h-full object-cover rounded-md"
          />
        </div> */}
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
