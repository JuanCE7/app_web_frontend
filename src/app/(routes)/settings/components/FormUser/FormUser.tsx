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

const formSchema = z.object({
  firstName: z.string().min(4, "El Nombre debe tener al menos 4 caracteres"),
  lastName: z.string().min(4, "El Apellido debe tener al menos 4 caracteres"),
  email: z.string().email("Correo No válido"),
  image: z.string().optional(),
});

export function FormUser() {
  const router = useRouter();
  const { data: session } = useSession();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [idUser, setIdUser] = useState<string>();
  const [initialEmail, setInitialEmail] = useState<string>();
  const [userData, setUserData] = useState<z.infer<typeof formSchema> | null>(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          setUserData(user);
          setIdUser(user.id);
          setInitialEmail(user.email)
          setBase64Image(user.image)
        }
      } catch (error) {
        console.error("Error al obtener los datos del proyecto:", error);
      }
    };

    fetchUser();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
      });
    }
  }, [userData, form]);

  const { isValid } = form.formState;
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // Enviar los datos del formulario, incluyendo la imagen base64
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (idUser) {
        // Incluye la imagen base64 si existe
        values.image = base64Image || ""
        if(initialEmail!=values.email){
          if (getUserLogged(values.email)) {
            toast({ title: "Email existente" });
            return;
          }
        }        
        console.log(values)
        // Actualiza el usuario
        await updateUser(idUser, values);
        toast({ title: "Usuario actualizado" });
        router.refresh();
      } else {
        throw new Error("User session not available");
      }
    } catch (error) {
      toast({
        title: "Algo salió mal",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      {base64Image && (
        <div className="mt-2">
          <img
            src={base64Image}
            alt="Imagen del Usuario"
            className="h-20 rounded-lg"
          />
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" type="text" {...field} />
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
                  <Input placeholder="Correo" type="text" {...field} />
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
