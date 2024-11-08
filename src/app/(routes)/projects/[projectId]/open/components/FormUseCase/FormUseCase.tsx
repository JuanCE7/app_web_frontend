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
import { Input } from "@/components/ui/input";
import { FormUseCaseProps } from "./FormUseCase.types";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createUseCase, updateUseCase } from "../../useCases.api";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().min(2),
  preconditions: z.string().min(2),
  postconditions: z.string().min(2),
  mainFlow: z.string().min(2),
  alternateFlows: z.string().min(2).optional(),
  projectId: z.string().optional(),
});

export function FormUseCase(props: FormUseCaseProps) {
  const { setOpenModalCreate, projectId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [useCaseData, setUseCaseData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [editorContent, setEditorContent] = useState<{
    html: string;
    text: string;
  }>({
    html: "",
    text: "",
  });

  // Define the onChange function
  const handleEditorChange = (content: { html: string; text: string }) => {
    setEditorContent(content);
    console.log("HTML content:", content.html);
    console.log("Plain text content:", content.text);
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
        const user = await getUserLogged(session.user.email);
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica si el archivo excede los 200 KB (200 * 1024 bytes)
      if (file.size > 200 * 1024) {
        console.log(file);
        toast({
          title: "El archivo es demasiado grande",
          description: "El tamaño máximo permitido es 200 KB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
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
              name="alternateFlows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precondiciones</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={editorContent.html}
                      onChange={handleEditorChange}
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
                  <FormLabel>Flujo Normal</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={editorContent.html}
                      onChange={handleEditorChange}
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
              name="alternateFlows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcondiciones</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={editorContent.html}
                      onChange={handleEditorChange}
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
                      value={editorContent.html}
                      onChange={handleEditorChange}
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
