"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormTestCaseProps } from "./FormTestCase.types";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { Input } from "@/components/ui/input";
import { createTestCase, getTestCaseById, updateTestCase } from "../../../testCases.api";

const formSchema = z.object({
  code: z.string().min(2, "El código debe tener al menos 2 caracteres"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  steps: z
    .string()
    .min(5, "Las precondiciones deben tener al menos 5 caracteres"),
  inputData: z
    .string()
    .min(5, "Las postcondiciones deben tener al menos 5 caracteres"),
  expectedResult: z
    .string()
    .min(5, "El flujo normal debe tener al menos 5 caracteres"),
  explanationSummary: z.string().optional(),
  explanationDetails: z.string().optional(),
  useCaseId: z.string().optional(),
});

export function FormTestCase(props: FormTestCaseProps) {
  const { setOpenModalCreate, useCaseId, testCaseId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [testCaseData, setTestCaseData] = useState<z.infer<typeof formSchema>>();

  useEffect(() => {
    if (testCaseId) {
      const fetchUseCase = async () => {
        try {
          const testCase = await getTestCaseById(testCaseId);
          form.reset(testCase);
          setTestCaseData(testCase);
        } catch (error) {
          console.error("Error al obtener los datos del proyecto:", error);
        }
      };

      fetchUseCase();
    }
  }, [testCaseId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (testCaseData) {
      form.setValue("code", testCaseData.code);
      form.setValue("name", testCaseData.name);
      form.setValue("description", testCaseData.description);
      form.setValue("steps", testCaseData.steps);
      form.setValue("inputData", testCaseData.inputData);
      form.setValue("expectedResult", testCaseData.expectedResult);
    }
  }, [testCaseData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        values.useCaseId = useCaseId;
        console.log(values);
        if (testCaseId) {
          await updateTestCase(testCaseId, values);
          toast({ title: "Caso de Prueba actualizado" });
        } else {
          console.log(values);
          await createTestCase(values);
          toast({ title: "Caso de Prueba creado" });
        }
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codigo</FormLabel>
              <FormControl>
                <Input placeholder="TC01..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-6">
          {/* Primera columna */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nombre del caso de prueba..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasos</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={(content) => {
                        field.onChange(content.html, content.text);
                      }}
                      toolbarOption={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Segunda columna */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del Caso de Prueba"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datos de Entrada</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={(content) => {
                        field.onChange(content.html, content.text);
                      }}
                      toolbarOption={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="expectedResult"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultado Esperado</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Resultado esperado..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Botón de submit centrado */}
        <div className="flex justify-end pt-5">
          <Button type="submit" disabled={!isValid} className="w-full">
            {testCaseId ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
}