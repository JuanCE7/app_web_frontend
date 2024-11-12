"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createTestCase, generateTestCase } from "../../../testCases.api";
import { CardGenerateTestCaseProps } from "./CardGenerateTestCase.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Simulación de datos detallados para cada opción
const opcionesDetalladas = [
  { id: 1, detalle: "Detalles completos de la opción 1..." },
  { id: 2, detalle: "Detalles completos de la opción 2..." },
];

type TestCase = {
  code: string;
  name: string;
  description: string;
  expectedResult: string;
  explanationDetails: string,
  explanationSummary: string,
  inputData: string;
  steps: string;
  useCaseId: string;
};

export default function CardGenerateTestCase(props: CardGenerateTestCaseProps) {
  const { useCaseId, setOpenModalGenerate } = props;
  const [testCaseGenerateO1, setTestCaseGenerateO1] = useState<
    TestCase[] | null
  >(null);
  const [testCaseGenerateO2, setTestCaseGenerateO2] = useState<
    TestCase[] | null
  >(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const generarOpciones = () => {
    if (useCaseId) {
      setIsLoading(true);
      completeData(useCaseId);
    }
    setMostrarOpciones(true);
    setOpcionSeleccionada(null);
  };

  const completeData = async (id: string) => {
    try {
      // Simulando la respuesta de la API
      const response = await generateTestCase(id);
      const response2 = await generateTestCase(id);
      setTestCaseGenerateO1(response.generatedTestCases);
      setTestCaseGenerateO2(response2.generatedTestCases);
      console.log(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema generando los casos de prueba.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarOpcion = (opcion: number) => {
    setOpcionSeleccionada(opcion);
  };

  const guardarOpcion = () => {
    if (opcionSeleccionada) {
      const testCases = obtenerTestCase(opcionSeleccionada);

      // Verificamos si la lista de casos de prueba está vacía
      if (!testCases || testCases.length === 0) {
        toast({
          title: "Error",
          description: "No hay casos de prueba para guardar.",
          variant: "destructive",
        });
        return;
      }
      console.log(obtenerTestCase(opcionSeleccionada));
      for (const testCase of testCases) {
        console.log(testCase)
        testCase.useCaseId = useCaseId || "";
        createTestCase(testCase);
      }
      toast({
        title: "Opción guardada",
        description: `Has guardado la Opción ${opcionSeleccionada}`,
      });
      setOpenModalGenerate(false)
    } else {
      toast({
        title: "Error",
        description: "Por favor, selecciona una opción antes de guardar",
        variant: "destructive",
      });
    }
  };

  const obtenerTestCase = (opcion: number) => {
    return opcion === 1 ? testCaseGenerateO1 : testCaseGenerateO2;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Button onClick={generarOpciones} className="w-full mb-4">
          {mostrarOpciones ? "Volver a generar" : "Generar opciones"}
        </Button>

        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {mostrarOpciones && !isLoading && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {opcionesDetalladas.map((opcion) => (
                <Card key={opcion.id} className="flex-1">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Opción {opcion.id}
                    </h3>
                    <div className="container mx-auto py-10">
                      <h1 className="text-3xl font-bold mb-6">
                        Casos de Prueba
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                        {obtenerTestCase(opcion.id)?.map((testCase, index) => (
                          <Card key={index} className="flex flex-col">
                            <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                <span>{testCase.name}</span>
                                <Badge variant="secondary">
                                  {testCase.code}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {testCase.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <h3 className="font-semibold mb-2">Pasos:</h3>
                              <ul className="list-disc list-inside"></ul>
                            </CardContent>
                            <CardFooter>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="w-full">
                                    Ver Detalles
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>{testCase.name}</DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="mt-4 h-[60vh] pr-4">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold">
                                          Código
                                        </h3>
                                        <p>{testCase.code}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          Descripción
                                        </h3>
                                        <p>{testCase.description}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">Pasos</h3>
                                        <p>{testCase.steps}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          Datos de Entrada
                                        </h3>
                                        <p>{testCase.inputData}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          Resultado Esperado
                                        </h3>
                                        <p>{testCase.expectedResult}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          Explicación
                                        </h3>
                                        <p>
                                          <strong>Resumen:</strong>{" "}
                                          {testCase.explanationSummary}
                                        </p>
                                        <p>
                                          <strong>Detalles:</strong>{" "}
                                          {testCase.explanationDetails}
                                        </p>
                                      </div>
                                    </div>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => seleccionarOpcion(opcion.id)}
                        variant={
                          opcionSeleccionada === opcion.id
                            ? "default"
                            : "outline"
                        }
                        className="flex-grow mr-2"
                      >
                        {opcionSeleccionada === opcion.id
                          ? "Seleccionada"
                          : "Seleccionar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={guardarOpcion}
              className="w-full"
              disabled={!opcionSeleccionada}
            >
              Guardar opción seleccionada
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
