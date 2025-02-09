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
import { FormUseCaseProps } from "./FormUseCase.types";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useUseCases } from "@/context/UseCaseContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  code: z.string().min(2, "El código debe tener al menos 2 caracteres"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  preconditions: z
    .string()
    .min(5, "Las precondiciones deben tener al menos 5 caracteres"),
  postconditions: z
    .string()
    .min(5, "Las postcondiciones deben tener al menos 5 caracteres"),
  mainFlow: z
    .string()
    .min(5, "El flujo normal debe tener al menos 5 caracteres"),
  alternateFlows: z.string().optional(),
  projectId: z.string().optional(),
});

export function FormUseCase(props: FormUseCaseProps) {
  const { setOpenModalCreate, projectId, useCaseId } = props;
  const { data: session } = useSession();
  const [useCaseData, setUseCaseData] = useState<z.infer<typeof formSchema>>();
  const { createUseCase, getUseCaseById, updateUseCase } = useUseCases();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (useCaseId) {
      const fetchUseCase = async () => {
        try {
          const useCase = await getUseCaseById(useCaseId);
          form.reset(useCase);
          setUseCaseData(useCase);
        } catch (error) {
          toast({
            title: "Error",
            description: "Error al obtener los datos del caso de uso:",
            variant: "destructive",
          });
        }
      };

      fetchUseCase();
    }
  }, [useCaseId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      preconditions: "",
      postconditions: "",
      mainFlow: "",
      alternateFlows: "",
      projectId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (useCaseData) {
      if (useCaseData) {
        form.setValue("code", useCaseData.code || "");
        form.setValue("name", useCaseData.name || "");
        form.setValue("description", useCaseData.description || "");
        form.setValue("preconditions", useCaseData.preconditions || "");
        form.setValue("postconditions", useCaseData.postconditions || "");
        form.setValue("mainFlow", useCaseData.mainFlow || "");
        form.setValue("alternateFlows", useCaseData.alternateFlows || "");
      }
    }
  }, [useCaseData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (session?.user?.email) {
        values.projectId = projectId;
        if (useCaseId) {
          await updateUseCase(useCaseId, values);
          toast({ title: "Caso de Uso actualizado" });
        } else {
          await createUseCase(values);
          toast({ title: "Caso de Uso creado" });
        }
        setOpenModalCreate(false);
      } else {
        throw new Error("User session not available");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="UC01"
                    type="text"
                    {...field}
                    maxLength={20}
                  />
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
                        placeholder="Nombre del Caso de Uso"
                        className="resize-none"
                        maxLength={250}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preconditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precondiciones</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(content) => {
                          field.onChange(content.html, content.text);
                        }}
                        toolbarOption={1}
                        data_test="preconditions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mainFlow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flujo Normal</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={(content) =>
                          field.onChange(content.html, content.text)
                        }
                        toolbarOption={2}
                        data_test="mainFlow"
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
                        placeholder="Descripción del Caso de Uso"
                        className="resize-none"
                        maxLength={250}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postconditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcondiciones</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={(content) =>
                          field.onChange(content.html, content.text)
                        }
                        toolbarOption={1}
                        data_test="postconditions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternateFlows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flujo Alterno</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(content) =>
                          field.onChange(content.html, content.text)
                        }
                        toolbarOption={2}
                        data_test="alternateFlows"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Botón de submit centrado */}
          <div className="flex justify-end pt-5">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full"
            >
              {useCaseId ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
