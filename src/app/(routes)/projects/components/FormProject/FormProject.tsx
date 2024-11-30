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
import { FormProjectProps } from "./FormProject.types";
import { toast } from "@/hooks/use-toast";
import { createProject, getProjectById, updateProject } from "@/lib/projects.api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/lib/login.api";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  userId: z.string().optional(), 
});

export function FormProject(props: FormProjectProps) {
  const { setOpenModalCreate, projectId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [projectData, setProjectData] = useState<z.infer<typeof formSchema> | null>(null);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const project = await getProjectById(projectId);
          setProjectData(project);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Error al obtener los datos del proyecto:',
            variant: 'destructive',
          });
        }
      };
      fetchProject();
    }
  }, [projectId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      userId: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (projectData) {
      form.reset({
        name: projectData.name || "",
        description: projectData.description || "",
        userId: projectData.userId || "",
      });
    }
  }, [projectData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        const user = await getUserLogged(session.user.email);
        if (projectId) {
          await updateProject(projectId, values);
          toast({ title: "Proyecto actualizado" });
        } else {
          values.userId = user.id;
          await createProject(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del Proyecto"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
          
        </div>
        <Button type="submit" disabled={!isValid}>
          {projectId ? "Actualizar" : "Crear"}
        </Button>
      </form>
    </Form>
  );
}
