"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
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

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;
type FlowType = { name: string; steps: string[] };
type ItemType = 'entries' | 'preconditions' | 'postconditions';
type FlowsType = 'mainFlow' | 'alternateFlows';

export function UseCaseForm(props: UseCaseFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayId: "",
      name: "",
      description: "",
      entries: [],
      preconditions: [],
      postconditions: [],
      mainFlow: [{ name: "", steps: [] }],
      alternateFlows: [{ name: "", steps: [] }],
      projectId: "",
    },
  });

  // Estados para las listas
  const [entries, setEntries] = useState<string[]>([]);
  const [preconditions, setPreconditions] = useState<string[]>([]);
  const [postconditions, setPostconditions] = useState<string[]>([]);
  const [mainFlow, setMainFlow] = useState<FlowType[]>([]);
  const [alternateFlows, setAlternateFlows] = useState<FlowType[]>([]);

  // Estados para los inputs temporales usando useCallback
  const [tempInputs, setTempInputs] = useState({
    entries: "",
    preconditions: "",
    postconditions: "",
    mainFlow: "",
    alternateFlows: "",
  });

  const [tempStepInputs, setTempStepInputs] = useState<{
    [key in FlowsType]: { [key: number]: string };
  }>({
    mainFlow: {},
    alternateFlows: {},
  });

  // Memoizar las funciones de manejo de cambios
  const handleTempInputChange = useCallback((
    type: ItemType | FlowsType,
    value: string
  ) => {
    setTempInputs(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const handleTempStepInputChange = useCallback((
    flowType: FlowsType,
    flowIndex: number,
    value: string
  ) => {
    setTempStepInputs(prev => ({
      ...prev,
      [flowType]: {
        ...prev[flowType],
        [flowIndex]: value
      }
    }));
  }, []);

  // Componente memoizado para la tabla de items
  const ItemsTable = useCallback(({
    itemType,
    items,
    setItems,
    label,
    placeholder
  }: {
    itemType: ItemType;
    items: string[];
    setItems: SetStateFunction<string[]>;
    label: string;
    placeholder: string;
  }) => (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center space-x-2 mb-2">
        <Input
          placeholder={placeholder}
          value={tempInputs[itemType]}
          onChange={(e) => {
            e.preventDefault();
            handleTempInputChange(itemType, e.target.value);
          }}
        />
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (tempInputs[itemType].trim()) {
              setItems(prev => [...prev, tempInputs[itemType]]);
              handleTempInputChange(itemType, "");
            }
          }}
        >
          Añadir
        </Button>
      </div>
      <Table>
        {items.map((item, index) => (
          <TableRow key={`${itemType}-${index}`}>
            <TableCell>
              <Input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  setItems(newItems);
                }}
              />
            </TableCell>
            <TableCell>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  ), [tempInputs, handleTempInputChange]);

  // Componente memoizado para la tabla de flujos
  const FlowTable = useCallback(({
    flowType,
    flows,
    setFlows,
    label,
    placeholder
  }: {
    flowType: FlowsType;
    flows: FlowType[];
    setFlows: SetStateFunction<FlowType[]>;
    label: string;
    placeholder: string;
  }) => (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center space-x-2 mb-2">
        <Input
          placeholder={placeholder}
          value={tempInputs[flowType]}
          onChange={(e) => {
            e.preventDefault();
            handleTempInputChange(flowType, e.target.value);
          }}
        />
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (tempInputs[flowType].trim()) {
              if (flowType === 'mainFlow' && flows.length > 0) {
                toast({
                  title: "Solo puedes agregar un flujo principal.",
                  variant: "destructive",
                });
                return;
              }
              setFlows(prev => [...prev, { name: tempInputs[flowType], steps: [] }]);
              handleTempInputChange(flowType, "");
            }
          }}
        >
          Añadir Flujo
        </Button>
      </div>
      <Table>
        {flows.map((flow, flowIndex) => (
          <TableRow key={`${flowType}-${flowIndex}`}>
            <TableCell>{flow.name}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                {flow.steps.map((step, stepIndex) => (
                  <div key={`${flowType}-${flowIndex}-step-${stepIndex}`} className="flex items-center space-x-2">
                    <span className="text-gray-500">{stepIndex + 1}</span>
                    <Input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const newFlows = [...flows];
                        newFlows[flowIndex].steps[stepIndex] = e.target.value;
                        setFlows(newFlows);
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const newFlows = [...flows];
                        newFlows[flowIndex].steps = newFlows[flowIndex].steps.filter((_, i) => i !== stepIndex);
                        setFlows(newFlows);
                      }}
                    >
                      Eliminar Paso
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    placeholder="Add step..."
                    value={tempStepInputs[flowType][flowIndex] || ""}
                    onChange={(e) => {
                      e.preventDefault();
                      handleTempStepInputChange(flowType, flowIndex, e.target.value);
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const stepInput = tempStepInputs[flowType][flowIndex];
                      if (stepInput?.trim()) {
                        setFlows(prevFlows => {
                          const updatedFlows = [...prevFlows];
                          updatedFlows[flowIndex] = {
                            ...updatedFlows[flowIndex],
                            steps: [...updatedFlows[flowIndex].steps, stepInput],
                          };
                          return updatedFlows;
                        });
                        handleTempStepInputChange(flowType, flowIndex, "");
                      }
                    }}
                  >
                    Añadir Paso
                  </Button>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Button
                type="button"
                onClick={() => setFlows(flows.filter((_, i) => i !== flowIndex))}
              >
                Eliminar Flujo
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  ), [tempInputs, tempStepInputs, handleTempInputChange, handleTempStepInputChange]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = {
        ...values,
        entries,
        preconditions,
        postconditions,
        mainFlow,
        alternateFlows,
      };
      
      await createUseCase(formData);
      toast({ title: "Use Case created" });
      router.refresh();
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

          <ItemsTable
            itemType="entries"
            items={entries}
            setItems={setEntries}
            label="Entradas"
            placeholder="Añadir entrada..."
          />
          <ItemsTable
            itemType="preconditions"
            items={preconditions}
            setItems={setPreconditions}
            label="Precondiciones"
            placeholder="Añadir precondición..."
          />
          <ItemsTable
            itemType="postconditions"
            items={postconditions}
            setItems={setPostconditions}
            label="Postcondiciones"
            placeholder="Añadir postcondición..."
          />

          <FlowTable
            flowType="mainFlow"
            flows={mainFlow}
            setFlows={setMainFlow}
            label="Flujo Normal"
            placeholder="Add main flow..."
          />
          <FlowTable
            flowType="alternateFlows"
            flows={alternateFlows}
            setFlows={setAlternateFlows}
            label="Flujos Alternos"
            placeholder="Add alternate flow..."
          />
        </div>

        <Button type="submit" disabled={!isValid}>
          Guardar Caso de Uso
        </Button>
      </form>
    </Form>
  );
}