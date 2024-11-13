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
import { createProject, getProjectById, updateProject } from "../../projects.api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  image: z.string().optional(),
  userId: z.string().optional(), 
});

export function FormProject(props: FormProjectProps) {
  const { setOpenModalCreate, projectId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<z.infer<typeof formSchema> | null>(null);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const project = await getProjectById(projectId);
          setProjectData(project);
          console.log(form)
        } catch (error) {
          console.error("Error al obtener los datos del proyecto:", error);
        }
      };

      fetchProject();
    }
  }, [projectId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (projectData) {
      form.reset({
        name: projectData.name || "",
        description: projectData.description || "",
        image: projectData.image || "",
        userId: projectData.userId || "",
      });
      setBase64Image(projectData.image || null);
    }
  }, [projectData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        const user = await getUserLogged(session.user.email);
        values.image = base64Image || ""
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica si el archivo excede los 200 KB (200 * 1024 bytes)
      if (file.size > 200 * 1024) {
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
          <FormField
            control={form.control}
            name="image"
            render={({}) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <Input id="image" type="file" onChange={handleImageChange} />

                {base64Image && (
                  <div className="mt-2">
                    <img
                      src={base64Image}
                      alt="Imagen del Proyecto"
                      className="h-20 rounded-lg"
                    />
                  </div>
                )}
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
