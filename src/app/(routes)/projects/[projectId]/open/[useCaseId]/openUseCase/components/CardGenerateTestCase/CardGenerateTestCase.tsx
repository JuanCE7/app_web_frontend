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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

type TestCase = {
  code: string;
  name: string;
  description: string;
  expectedResult: string;
  explanationDetails: string;
  explanationSummary: string;
  inputData: string;
  steps: string;
  useCaseId: string;
};

export default function CardGenerateTestCase({
  useCaseId,
  setOpenModalGenerate,
}: CardGenerateTestCaseProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTestCases = async () => {
    if (useCaseId) {
      setIsLoading(true);
      try {
        const response = await generateTestCase(useCaseId);
        setTestCases(response.generatedTestCases);
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema generando los casos de prueba.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTestCaseSelection = (testCaseCode: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(testCaseCode)
        ? prev.filter((code) => code !== testCaseCode)
        : [...prev, testCaseCode]
    );
  };

  const saveSelectedTestCases = async () => {
    if (selectedTestCases.length === 0) {
      toast({
        title: "Error",
        description:
          "Por favor, selecciona al menos un caso de prueba antes de guardar.",
        variant: "destructive",
      });
      return;
    }

    const testCasesToSave = testCases.filter((tc) =>
      selectedTestCases.includes(tc.code)
    );
    for (const testCase of testCasesToSave) {
      try {
        await createTestCase({ ...testCase, useCaseId: useCaseId || "" });
      } catch (error) {
        toast({
          title: "Error",
          description: `Error al guardar el caso de prueba ${testCase.code}`,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Éxito",
      description: `Se han guardado ${testCasesToSave.length} casos de prueba.`,
    });
    setOpenModalGenerate(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Button onClick={generateTestCases} className="w-full mb-4">
          {testCases.length > 0
            ? "Volver a generar"
            : "Generar casos de prueba"}
        </Button>

        {isLoading && (
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mt-4">
              <Image
                src="/perro.gif"
                alt="Perro animado"
                width={300}
                height={300}
                priority
                unoptimized
              />
            </div>
          </div>
        )}

        {testCases.length > 0 && !isLoading && (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testCases.map((testCase) => (
                <Card key={testCase.code} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <Badge variant="secondary">{testCase.code}</Badge>
                      <span className="flex-grow ml-2">{testCase.name}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {testCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="font-semibold mb-2">Pasos:</h3>
                    <p className="line-clamp-3">{testCase.steps}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      variant={
                        selectedTestCases.includes(testCase.code)
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 mr-2 justify-center items-center"
                      onClick={() => toggleTestCaseSelection(testCase.code)}
                    >
                      {selectedTestCases.includes(testCase.code) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Seleccionado
                        </>
                      ) : (
                        "Seleccionar"
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Link
                          href="#"
                          className="text-sm text-white hover:underline"
                        >
                          Ver Detalles
                        </Link>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{testCase.name}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="mt-4 h-[60vh] pr-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold">Código</h3>
                              <p>{testCase.code}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Descripción</h3>
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
                              <h3 className="font-semibold">Explicación</h3>
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
          </ScrollArea>
        )}

        {testCases.length > 0 && (
          <Button
            onClick={saveSelectedTestCases}
            className="w-full mt-4"
            disabled={selectedTestCases.length === 0}
          >
            Guardar casos de prueba seleccionados ({selectedTestCases.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
