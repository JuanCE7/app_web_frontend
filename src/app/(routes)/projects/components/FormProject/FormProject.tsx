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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";

const formSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres"),
  userId: z.string().optional(),
});

export function FormProject(props: FormProjectProps) {
  const { setOpenModalCreate, projectId } = props;
  const { data: session } = useSession();
  const [projectData, setProjectData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío
  const { createProject, updateProject, getProjectById } = useProjects();
  const { getUserLogged } = useUsers();

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const project = await getProjectById(projectId);
          setProjectData(project);
        } catch (error) {
          toast({
            title: "Error",
            description: "Error al obtener los datos del proyecto:",
            variant: "destructive",
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
    mode: "onChange",
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
    setIsSubmitting(true); // Deshabilitar el botón
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del Proyecto"
                    type="text"
                    className="w-full text-sm sm:text-base p-2 sm:p-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del Proyecto"
                    className="resize-none w-full text-sm sm:text-base p-2 sm:p-3 min-h-[100px] sm:min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!isValid || isSubmitting} // Deshabilitar el botón si está en proceso de envío
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
        >
          {projectId ? "Actualizar" : "Crear"}
        </Button>
      </form>
    </Form>
  );
}
