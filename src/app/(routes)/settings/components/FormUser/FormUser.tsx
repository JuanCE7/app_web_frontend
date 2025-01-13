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
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/context/UsersContext";

// Esquema de validación actualizado para que `role` sea obligatorio si el usuario es admin
const formSchema = z.object({
  entity: z.object({
    firstName: z.string().min(3, "El Nombre debe tener al menos 3 caracteres"),
    lastName: z.string().min(3, "El Apellido debe tener al menos 3 caracteres"),
  }),
  email: z.string().email("Correo no válido"),
  role: z
    .object({
      name: z.string(),
    })
    .optional(), // El rol es opcional inicialmente
});

export function FormUser() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [idUser, setIdUser] = useState<string>();
  const [initialEmail, setInitialEmail] = useState<string>();
  const [userData, setUserData] = useState<z.infer<typeof formSchema>>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newRole, setNewRole] = useState<"Administrator" | "Tester">("Tester");
  const {getUserLogged, updateUser} = useUsers()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          setUserData(user);
          setIdUser(user.id);
          setInitialEmail(user.email);
          setNewRole(user.role.name);
          if (user.role.name === "Administrator") setIsAdmin(true); // Verifica si el usuario es admin
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al obtener los datos del usuario:",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [session]);

  // Aseguramos que el formulario tenga en cuenta el rol como obligatorio si el usuario es admin
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity: {
        firstName: "",
        lastName: "",
      },
      email: "",
      role: { name: "Administator" }, 
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
        role: userData.role || { name: "Tester" },
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
          role: newRole,
        };

        await updateUser(idUser, flattenedValues);
        update({
          user: {
            email: values.email,
            role: values.role
          },
        });
        router.refresh();
        toast({ title: "Usuario actualizado correctamente" });
      } else {
        throw new Error("Sesión de usuario no disponible");
      }
    } catch (error) {
      toast({
        title: "Algo salió mal",
        description: "error" + error,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-fadeInDown delay-[150ms] mb-3"
      >
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
          {isAdmin && (
            <>
              <Label>Rol</Label>
              <Select
                value={newRole}
                onValueChange={(value) =>
                  setNewRole(value as "Administrator" | "Tester")
                }
                defaultValue={newRole}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol">
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrador</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <Button type="submit" disabled={!isValid}>
          Actualizar
        </Button>
      </form>
    </Form>
  );
}
