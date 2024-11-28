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
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useEffect, useState } from "react";
import { updateUser } from "../../user.api";

// Actualizamos el esquema para reflejar la estructura que recibes
const formSchema = z.object({
  entity: z.object({
    firstName: z.string().min(3, "El Nombre debe tener al menos 3 caracteres"),
    lastName: z.string().min(3, "El Apellido debe tener al menos 3 caracteres"),
  }),
  email: z.string().email("Correo no válido"),
  status: z.boolean(),
  role: z.object({
    name: z.string(),
  }),
});

export function FormUser() {
  const router = useRouter();
  const { data: session } = useSession();
  const [base64Image, setBase64Image] = useState<string>();
  const [idUser, setIdUser] = useState<string>();
  const [initialEmail, setInitialEmail] = useState<string>();
  const [userData, setUserData] = useState<z.infer<typeof formSchema>>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          setUserData(user);
          setIdUser(user.id);
          setInitialEmail(user.email);
          setBase64Image(user.entity.imageEntity || null);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUser();
  }, [session]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity: {
        firstName: "",
        lastName: "",
      },
      email: "",
      status: false,
      role: {
        name: "",
      },
    },
    mode: "onChange",
  });

  // Restablecemos los valores del formulario cuando se obtienen los datos del usuario
  useEffect(() => {
    if (userData) {
      form.reset({
        entity: {
          firstName: userData.entity?.firstName || "",
          lastName: userData.entity?.lastName || "",
        },
        email: userData.email || "",
        status: userData.status || false,
        role: {
          name: userData.role?.name || "",
        },
      });
    }
  }, [userData, form]);

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (idUser) {
        if (initialEmail !== values.email) {
          const response = await getUserLogged(values.email);
          if (!response.error) {
            toast({ title: "Email ya registrado", variant: "destructive" });
            return;
          }
        }

        const flattenedValues = {
          email: values.email,
          firstName: values.entity.firstName,
          lastName: values.entity.lastName,
          status: values.status,
          role: values.role.name,
        };

        console.log("Datos enviados:", flattenedValues);

        // Actualiza el usuario con los datos aplanados
        await updateUser(idUser, flattenedValues);
        router.refresh();
        toast({ title: "Usuario actualizado correctamente" });
      } else {
        throw new Error("Sesión de usuario no disponible");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      toast({ title: "Algo salió mal", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="entity.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="entity.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input placeholder="Correo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
        </div>
        <Button type="submit" disabled={!isValid}>
          Actualizar
        </Button>
      </form>
    </Form>
  );
}
