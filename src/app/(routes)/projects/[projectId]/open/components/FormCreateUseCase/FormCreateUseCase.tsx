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
import { FormCreateUseCaseProps } from "./FormCreateUseCase.types";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useState } from "react";
import { createUseCase } from "../../useCases.api";

// Cambiamos los arrays a strings con un separador '|'
const formSchema = z.object({
  name: z.string(),
  description: z.string().min(2),
  entries: z.string().optional(), // Cadenas separadas por '|'
  preconditions: z.string().optional(),
  postconditions: z.string().optional(),
  mainFlow: z.string().optional(),
  alternateFlows: z.string().optional(),
});

export function FormCreateUseCase(props: FormCreateUseCaseProps) {
  const { setOpenModalCreate } = props;
  const [photoUploaded, setPhotoUploaded] = useState(false);
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

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        const user = await getUserLogged(session.user.email);
        values.creatorId = user.id;

        // Si quieres transformar los strings en arrays antes de enviarlos al backend:
        values.entries = values.entries?.split('|').map(item => item.trim()) || [];
        values.preconditions = values.preconditions?.split('|').map(item => item.trim()) || [];
        values.postconditions = values.postconditions?.split('|').map(item => item.trim()) || [];
        values.mainFlow = values.mainFlow?.split('|').map(item => item.trim()) || [];
        values.alternateFlows = values.alternateFlows?.split('|').map(item => item.trim()) || [];

        console.log("Final values with creatorId:", values);
        await createUseCase(values);
        toast({ title: "Use Case created" });
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
                    placeholder="Nombre del Caso de Uso"
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
                  <Input
                    placeholder="Descripción del Caso de Uso"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!isValid}>
          Crear
        </Button>
      </form>
    </Form>
  );
}
