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
import { Dispatch, useEffect, useState } from "react";
import { useUsers } from "@/context/UsersContext";
import { Eye, EyeOff } from "lucide-react";

export type FormPasswordProps = {
  setOpenModalChangePassword: Dispatch<boolean>;
};

const formSchema = z
  .object({
    passwordReset: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPasswordReset: z.string(),
  })
  .refine((data) => data.passwordReset === data.confirmPasswordReset, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPasswordReset"],
  });

export function FormPassword(props: FormPasswordProps) {
  const { setOpenModalChangePassword } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [idUser, setIdUser] = useState<string>();
  const { getUserLogged, updateUser } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          setIdUser(user.id);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordReset: "",
      confirmPasswordReset: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (idUser) {
        const flattenedValues = {
          password: values.passwordReset,
        };

        await updateUser(idUser, flattenedValues);

        router.refresh();
        toast({ title: "Contraseña actualizada correctamente" });
      } else {
        throw new Error("Sesión de usuario no disponible");
      }
    } catch (error) {
      toast({
        title: "Algo salió mal",
        description: "error" + error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setOpenModalChangePassword(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-fadeInDown delay-[150ms]"
      >
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="passwordReset"
            key={"passwordReset"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu nueva contraseña"
                      maxLength={50}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPasswordReset"
            key={"confirmPasswordReset"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                    maxLength={50}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            Cambiar Contraseña
          </Button>
        </div>
      </form>
    </Form>
  );
}
