"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseCaseFormProps } from "./UseCaseForm.types";
import { formSchema } from "./UseCaseForm.form";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { createUseCase } from "../../../useCases.api";
import { Table, TableRow, TableCell } from "@/components/ui/table";

export function UseCaseForm(props: UseCaseFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayId: "",
      name: "",
      description: "",
      entries: "",
      preconditions: "",
      postconditions: "",
      mainFlow: "",
      alternateFlows: "",
    },
  });

  const [entries, setEntries] = useState<string[]>([]);
  const [preconditions, setPreconditions] = useState<string[]>([]);
  const [postconditions, setPostconditions] = useState<string[]>([]);
  const [mainFlow, setMainFlow] = useState<{ name: string; steps: string[] }[]>(
    []
  );
  const [alternateFlows, setAlternateFlows] = useState<
    { name: string; steps: string[] }[]
  >([]);

  const [entriesInput, setEntriesInput] = useState("");
  const [preconditionInput, setPreconditionInput] = useState("");
  const [postconditionInput, setPostconditionInput] = useState("");
  const [mainFlowInput, setMainFlowInput] = useState("");
  const [alternateFlowInput, setAlternateFlowInput] = useState("");

  // Separando stepInputs para cada flujo
  const [mainFlowStepInputs, setMainFlowStepInputs] = useState<{
    [key: number]: string;
  }>({});
  const [alternateFlowStepInputs, setAlternateFlowStepInputs] = useState<{
    [key: number]: string;
  }>({});

  const handleAddItem = (
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (value) setList((prev) => [...prev, value]);
  };

  const handleDeleteItem = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFlow = (
    flowName: string,
    setFlow: React.Dispatch<
      React.SetStateAction<{ name: string; steps: string[] }[]>
    >
  ) => {
    if (flowName) setFlow((prev) => [...prev, { name: flowName, steps: [] }]);
  };

  const handleAddStep = (
    flowIndex: number,
    stepInput: string,
    setFlow: React.Dispatch<
      React.SetStateAction<{ name: string; steps: string[] }[]>
    >,
    setStepInput: React.Dispatch<
      React.SetStateAction<{ [key: number]: string }>
    >
  ) => {
    if (stepInput.trim()) {
      setFlow((prevFlows) => {
        const updatedFlows = [...prevFlows];
        updatedFlows[flowIndex] = {
          ...updatedFlows[flowIndex],
          steps: [...updatedFlows[flowIndex].steps, stepInput],
        };
        return updatedFlows;
      });
      setStepInput((prev) => ({ ...prev, [flowIndex]: "" }));
    }
  };

  const handleDeleteStep = (
    flowIndex: number,
    stepIndex: number,
    setFlow: React.Dispatch<
      React.SetStateAction<{ name: string; steps: string[] }[]>
    >
  ) => {
    setFlow((prev) => {
      const updatedFlow = [...prev];
      // Verifica que solo el paso en `stepIndex` se elimine
      updatedFlow[flowIndex].steps = updatedFlow[flowIndex].steps.filter(
        (_, i) => i !== stepIndex
      );
      return updatedFlow;
    });
  };
  const handleEditStep = (
    flowIndex: number,
    stepIndex: number,
    updatedStep: string,
    setFlow: React.Dispatch<
      React.SetStateAction<{ name: string; steps: string[] }[]>
    >
  ) => {
    setFlow((prevFlows) => {
      const updatedFlows = [...prevFlows];
      updatedFlows[flowIndex].steps[stepIndex] = updatedStep;
      return updatedFlows;
    });
  };
  const handleDeleteFlow = (
    flowIndex: number,
    setFlow: React.Dispatch<
      React.SetStateAction<{ name: string; steps: string[] }[]>
    >
  ) => {
    setFlow((prev) => prev.filter((_, i) => i !== flowIndex));
  };

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        await createUseCase({
          ...values,
          preconditions,
          postconditions,
          mainFlow,
          alternateFlows,
        });
        toast({ title: "Project created" });
        router.refresh();
      } else {
        throw new Error("User session not available");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  const [entriesEditInputs, setEntriesEditInputs] = useState<{
    [key: number]: string;
  }>({});
  const [preconditionsEditInputs, setPreconditionsEditInputs] = useState<{
    [key: number]: string;
  }>({});
  const [postconditionsEditInputs, setPostconditionsEditInputs] = useState<{
    [key: number]: string;
  }>({});

  // Función para editar una entry específica
  const handleEditEntry = (
    entryIndex: number,
    newEntryValue: string,
    setEntries: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
      updatedEntries[entryIndex] = newEntryValue;
      return updatedEntries;
    });
  };

  // Función para eliminar una entry específica
  const handleDeleteEntry = (
    entryIndex: number,
    setEntries: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setEntries((prevEntries) => prevEntries.filter((_, i) => i !== entryIndex));
  };

  // Modificación para añadir una nueva entry
  const handleAddEntry = (
    entryInput: string,
    setEntries: React.Dispatch<React.SetStateAction<string[]>>,
    setEntryInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (entryInput) {
      setEntries((prevEntries) => [...prevEntries, entryInput]);
      setEntryInput("");
    }
  };
  // Función para editar una precondición específica
  const handleEditPrecondition = (
    preconditionIndex: number,
    newPreconditionValue: string,
    setPreconditions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setPreconditions((prevPreconditions) => {
      const updatedPreconditions = [...prevPreconditions];
      updatedPreconditions[preconditionIndex] = newPreconditionValue;
      return updatedPreconditions;
    });
  };

  // Función para eliminar una precondición específica
  const handleDeletePrecondition = (
    preconditionIndex: number,
    setPreconditions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setPreconditions((prevPreconditions) =>
      prevPreconditions.filter((_, i) => i !== preconditionIndex)
    );
  };

  // Función para añadir una nueva precondición
  const handleAddPrecondition = (
    preconditionInput: string,
    setPreconditions: React.Dispatch<React.SetStateAction<string[]>>,
    setPreconditionInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (preconditionInput) {
      setPreconditions((prevPreconditions) => [
        ...prevPreconditions,
        preconditionInput,
      ]);
      setPreconditionInput("");
    }
  };

  // Funciones similares para postcondiciones
  const handleEditPostcondition = (
    postconditionIndex: number,
    newPostconditionValue: string,
    setPostconditions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setPostconditions((prevPostconditions) => {
      const updatedPostconditions = [...prevPostconditions];
      updatedPostconditions[postconditionIndex] = newPostconditionValue;
      return updatedPostconditions;
    });
  };

  const handleDeletePostcondition = (
    postconditionIndex: number,
    setPostconditions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setPostconditions((prevPostconditions) =>
      prevPostconditions.filter((_, i) => i !== postconditionIndex)
    );
  };

  const handleAddPostcondition = (
    postconditionInput: string,
    setPostconditions: React.Dispatch<React.SetStateAction<string[]>>,
    setPostconditionInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (postconditionInput) {
      setPostconditions((prevPostconditions) => [
        ...prevPostconditions,
        postconditionInput,
      ]);
      setPostconditionInput("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          {/* Input Fields */}
          <FormField
            control={form.control}
            name="displayId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="UC01" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de caso de uso..."
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preconditions Table */}
          <div>
            <FormLabel>Entradas</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Añadir entrada..."
                value={entriesInput}
                onChange={(e) => setEntriesInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() =>
                  handleAddEntry(entriesInput, setEntries, setEntriesInput)
                }
              >
                Añadir
              </Button>
            </div>
            <Table>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="text"
                      value={entriesEditInputs[index] || entry}
                      onChange={(e) =>
                        setEntriesEditInputs({
                          ...entriesEditInputs,
                          [index]: e.target.value,
                        })
                      }
                      onBlur={() => {
                        handleEditEntry(
                          index,
                          entriesEditInputs[index] || entry,
                          setEntries
                        );
                        setEntriesEditInputs((prev) => ({
                          ...prev,
                          [index]: "",
                        }));
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteEntry(index, setEntries)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
          {/* Preconditions Table */}
          <div>
            <FormLabel>Precondiciones</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Añadir precondición..."
                value={preconditionInput}
                onChange={(e) => setPreconditionInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() =>
                  handleAddPrecondition(
                    preconditionInput,
                    setPreconditions,
                    setPreconditionInput
                  )
                }
              >
                Añadir
              </Button>
            </div>
            <Table>
              {preconditions.map((precondition, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="text"
                      value={preconditionsEditInputs[index] || precondition}
                      onChange={(e) =>
                        setPreconditionsEditInputs({
                          ...preconditionsEditInputs,
                          [index]: e.target.value,
                        })
                      }
                      onBlur={() => {
                        handleEditPrecondition(
                          index,
                          preconditionsEditInputs[index] || precondition,
                          setPreconditions
                        );
                        setPreconditionsEditInputs((prev) => ({
                          ...prev,
                          [index]: "",
                        }));
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        handleDeletePrecondition(index, setPreconditions)
                      }
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Postconditions Table */}
          <div>
            <FormLabel>Postcondiciones</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Añadir postcondición..."
                value={postconditionInput}
                onChange={(e) => setPostconditionInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() =>
                  handleAddPostcondition(
                    postconditionInput,
                    setPostconditions,
                    setPostconditionInput
                  )
                }
              >
                Añadir
              </Button>
            </div>
            <Table>
              {postconditions.map((postcondition, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="text"
                      value={postconditionsEditInputs[index] || postcondition}
                      onChange={(e) =>
                        setPostconditionsEditInputs({
                          ...postconditionsEditInputs,
                          [index]: e.target.value,
                        })
                      }
                      onBlur={() => {
                        handleEditPostcondition(
                          index,
                          postconditionsEditInputs[index] || postcondition,
                          setPostconditions
                        );
                        setPostconditionsEditInputs((prev) => ({
                          ...prev,
                          [index]: "",
                        }));
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        handleDeletePostcondition(index, setPostconditions)
                      }
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Main Flow Table */}
          <div>
            <FormLabel>Flujo Normal</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add main flow..."
                value={mainFlowInput}
                onChange={(e) => setMainFlowInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  if (mainFlow.length === 0) {
                    handleAddFlow(mainFlowInput, setMainFlow);
                    setMainFlowInput("");
                  } else {
                    toast({
                      title: "Solo puedes agregar un flujo principal.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Añadir Flujo
              </Button>
            </div>
            <Table>
              {mainFlow.map((flow, flowIndex) => (
                <TableRow key={flowIndex}>
                  <TableCell>{flow.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {flow.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex items-center space-x-2"
                        >
                          {/* Column with step number */}
                          <span className="text-gray-500">{stepIndex + 1}</span>
                          {/* Editable step content */}
                          <Input
                            type="text"
                            value={step}
                            onChange={(e) =>
                              handleEditStep(
                                flowIndex,
                                stepIndex,
                                e.target.value,
                                setMainFlow
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteStep(
                                flowIndex,
                                stepIndex,
                                setMainFlow
                              )
                            }
                          >
                            Eliminar Paso
                          </Button>
                        </div>
                      ))}
                      {/* Input para añadir un nuevo paso */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          placeholder="Add step..."
                          value={mainFlowStepInputs[flowIndex] || ""}
                          onChange={(e) =>
                            setMainFlowStepInputs({
                              ...mainFlowStepInputs,
                              [flowIndex]: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            handleAddStep(
                              flowIndex,
                              mainFlowStepInputs[flowIndex],
                              setMainFlow,
                              setMainFlowStepInputs
                            )
                          }
                        >
                          Añadir Paso
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => handleDeleteFlow(flowIndex, setMainFlow)}
                    >
                      Eliminar Flujo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Alternate Flow Table */}
          <div>
            <FormLabel>Flujos Alternos</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add alternate flow..."
                value={alternateFlowInput}
                onChange={(e) => setAlternateFlowInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  handleAddFlow(alternateFlowInput, setAlternateFlows);
                  setAlternateFlowInput("");
                }}
              >
                Añadir Flujo
              </Button>
            </div>
            <Table>
              {alternateFlows.map((flow, flowIndex) => (
                <TableRow key={flowIndex}>
                  <TableCell>{flow.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {flow.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex items-center space-x-2"
                        >
                          {/* Column with step number */}
                          <span className="text-gray-500">{stepIndex + 1}</span>
                          {/* Editable step content */}
                          <Input
                            type="text"
                            value={step}
                            onChange={(e) =>
                              handleEditStep(
                                flowIndex,
                                stepIndex,
                                e.target.value,
                                setAlternateFlows
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteStep(
                                flowIndex,
                                stepIndex,
                                setAlternateFlows
                              )
                            }
                          >
                            Eliminar Paso
                          </Button>
                        </div>
                      ))}
                      {/* Input para añadir un nuevo paso */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          placeholder="Add step..."
                          value={alternateFlowStepInputs[flowIndex] || ""}
                          onChange={(e) =>
                            setAlternateFlowStepInputs({
                              ...alternateFlowStepInputs,
                              [flowIndex]: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            handleAddStep(
                              flowIndex,
                              alternateFlowStepInputs[flowIndex],
                              setAlternateFlows,
                              setAlternateFlowStepInputs
                            )
                          }
                        >
                          Añadir Paso
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() =>
                        handleDeleteFlow(flowIndex, setAlternateFlows)
                      }
                    >
                      Eliminar Flujo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </div>

        <Button type="submit" disabled={!isValid}>
          Guardar Caso de Uso
        </Button>
      </form>
    </Form>
  );
}
