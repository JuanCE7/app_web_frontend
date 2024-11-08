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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createUseCase, updateUseCase } from "../../useCases.api";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

const formSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(3),
  description: z.string().min(5),
  preconditions: z.string().min(5),
  postconditions: z.string().min(5),
  mainFlow: z.string().min(5),
  alternateFlows: z.string().min(5).optional(),
  projectId: z.string().optional(),
});

export function FormUseCase(props: FormUseCaseProps) {
  const { setOpenModalCreate, projectId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [useCaseData, setUseCaseData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [editorPreconditionsContent, setEditorPreconditionsContent] = useState<{
    html: string;
    text: string;
  }>({
    html: "",
    text: "",
  });
  const [editorPostconditionsContent, setEditorPostconditionsContent] = useState<{
    html: string;
    text: string;
  }>({
    html: "",
    text: "",
  });
  const [editorMainFlowContent, setEditorMainFlowContent] = useState<{
    html: string;
    text: string;
  }>({
    html: "",
    text: "",
  });
  const [editorAlternateFlowContent, setEditorAlternateFlowContent] = useState<{
    html: string;
    text: string;
  }>({
    html: "",
    text: "",
  });

  // Define the onChange function
  const handleEditorPreChange = (content: { html: string; text: string }) => {
    setEditorPreconditionsContent(content);

  };
  const handleEditorPostChange = (content: { html: string; text: string }) => {
    setEditorPostconditionsContent(content);
  };
  const handleEditorMainChange = (content: { html: string; text: string }) => {
    setEditorMainFlowContent(content);
  };
  const handleEditorAlternateChange = (content: { html: string; text: string }) => {
    setEditorAlternateFlowContent(content);
  };
  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          // const project = await getProjectById(projectId);
          // console.log(project)
          // setuseCaseData(project); // Asigna los datos al estado
        } catch (error) {
          console.error("Error al obtener los datos del proyecto:", error);
        }
      };

      fetchProject();
    }
  }, [projectId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (useCaseData) {
      form.reset({
        code: useCaseData.code || "",
        name: useCaseData.name || "",
        description: useCaseData.description || "",
        preconditions: useCaseData.preconditions || "",
        postconditions: useCaseData.postconditions || "",
        mainFlow: useCaseData.mainFlow || "",
        alternateFlows: useCaseData.alternateFlows || "",
      });
    }
  }, [useCaseData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        console.log("Final values with creatorId:", values);
        if (projectId) {
          await updateUseCase(projectId, values);
          toast({ title: "Proyecto actualizado" });
        } else {
          await createUseCase(values);
          toast({ title: "Proyecto creado" });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                      placeholder="Nombre del Proyecto"
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
              name="preconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precondiciones</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={editorPreconditionsContent.html}
                      onChange={handleEditorPreChange}
                      toolbarOption={1}
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
                      value={editorMainFlowContent.html}
                      onChange={handleEditorMainChange}
                      toolbarOption={2}
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
                      placeholder="Descripción del Proyecto"
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
              name="postconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcondiciones</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={editorPostconditionsContent.html}
                      onChange={handleEditorPostChange}
                      toolbarOption={1}
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
                      value={editorAlternateFlowContent.html}
                      onChange={handleEditorAlternateChange}
                      toolbarOption={2}
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
          <Button type="submit" disabled={!isValid} className="w-full">
            {projectId ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
