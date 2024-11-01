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
import { createUseCase } from "../../useCases.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UseCaseForm(props: UseCaseFormProps) {
  const { setOpenModalCreate } = props;
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      entries: [],
      preconditions: [],
      postconditions: [],
      mainFlow: [],
      alternateFlows: [],
    },
  });

  const { isValid } = form.formState;

  // Estado para los inputs de cada tabla
  const [precondition, setPrecondition] = useState("");
  const [postcondition, setPostcondition] = useState("");
  const [mainFlow, setMainFlow] = useState("");
  const [alternateFlow, setAlternateFlow] = useState("");

  // Funciones para agregar elementos a cada lista
  const addPrecondition = () => {
    form.setValue("preconditions", [...form.getValues("preconditions"), precondition]);
    setPrecondition("");
  };

  const addPostcondition = () => {
    form.setValue("postconditions", [...form.getValues("postconditions"), postcondition]);
    setPostcondition("");
  };

  const addMainFlow = () => {
    form.setValue("mainFlow", [...form.getValues("mainFlow"), mainFlow]);
    setMainFlow("");      
  };

  const addAlternateFlow = () => {
    form.setValue("alternateFlows", [...form.getValues("alternateFlows"), alternateFlow]);
    setAlternateFlow("");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        console.log("Final values", values);
        await createUseCase(values);
        toast({ title: "Project created" });
        setOpenModalCreate(false);
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

          {/* Tabla de Precondiciones */}
          <FormLabel>Preconditions</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Precondition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.getValues("preconditions").map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Input 
                    value={precondition} 
                    onChange={(e) => setPrecondition(e.target.value)} 
                    placeholder="Add precondition" 
                  />
                  <Button onClick={addPrecondition} type="button">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Tabla de Postcondiciones */}
          <FormLabel>Postconditions</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postcondition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.getValues("postconditions").map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Input 
                    value={postcondition} 
                    onChange={(e) => setPostcondition(e.target.value)} 
                    placeholder="Add postcondition" 
                  />
                  <Button onClick={addPostcondition} type="button">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Tabla de Main Flow */}
          <FormLabel>Main Flow</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Main Flow Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.getValues("mainFlow").map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Input 
                    value={mainFlow} 
                    onChange={(e) => setMainFlow(e.target.value)} 
                    placeholder="Add main flow step" 
                  />
                  <Button onClick={addMainFlow} type="button">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Tabla de Alternate Flow */}
          <FormLabel>Alternate Flow</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternate Flow Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.getValues("alternateFlows").map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Input 
                    value={alternateFlow} 
                    onChange={(e) => setAlternateFlow(e.target.value)} 
                    placeholder="Add alternate flow step" 
                  />
                  <Button onClick={addAlternateFlow} type="button">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Button type="submit" disabled={!isValid}>
          Crear Caso de Uso
        </Button>
      </form>
    </Form>
  );
}
