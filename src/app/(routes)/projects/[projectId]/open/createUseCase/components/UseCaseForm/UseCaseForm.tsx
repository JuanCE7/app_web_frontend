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
      updatedFlow[flowIndex].steps = updatedFlow[flowIndex].steps.filter(
        (_, i) => i !== stepIndex
      );
      return updatedFlow;
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          {/* Input Fields */}
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
            <FormLabel>Entries</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add entries..."
                value={entriesInput}
                onChange={(e) => setEntriesInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  handleAddItem(entriesInput, setEntries);
                  setEntriesInput("");
                }}
              >
                Add
              </Button>
            </div>
            <Table>
              {entries.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteItem(index, setEntries)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
          {/* Preconditions Table */}
          <div>
            <FormLabel>Preconditions</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add precondition..."
                value={preconditionInput}
                onChange={(e) => setPreconditionInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  handleAddItem(preconditionInput, setPreconditions);
                  setPreconditionInput("");
                }}
              >
                Add
              </Button>
            </div>
            <Table>
              {preconditions.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteItem(index, setPreconditions)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Postconditions Table */}
          <div>
            <FormLabel>Postconditions</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add postcondition..."
                value={postconditionInput}
                onChange={(e) => setPostconditionInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  handleAddItem(postconditionInput, setPostconditions);
                  setPostconditionInput("");
                }}
              >
                Add
              </Button>
            </div>
            <Table>
              {postconditions.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteItem(index, setPostconditions)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Main Flow Table */}
          <div>
            <FormLabel>Main Flow</FormLabel>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Add main flow..."
                value={mainFlowInput}
                onChange={(e) => setMainFlowInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  // Verificar si mainFlow ya contiene un flujo antes de agregar uno nuevo
                  if (mainFlow.length === 0) {
                    handleAddFlow(mainFlowInput, setMainFlow);
                    setMainFlowInput(""); // Limpiar el campo de input después de agregar
                  } else {
                    toast({
                      title: "Solo puedes agregar un flujo principal.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Add Flow
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
                          <span>{step}</span>
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
                            Delete Step
                          </Button>
                        </div>
                      ))}
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
                          Add Step
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
            <FormLabel>Alternate Flow</FormLabel>
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
                Add Flow
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
                          <span>{step}</span>
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
                            Delete Step
                          </Button>
                        </div>
                      ))}
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
                          Add Step
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
