"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { getUserLogged, registerUser } from "./login.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";
import { ToggleTheme } from "@/components/ToggleTheme";

type FormType = "login" | "register" | "forgotPassword";

const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 carácteres"),
});

const registerSchema = z.object({
  firstName: z.string().min(3, "El Nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El Apellido debe tener al menos 3 caracteres"),
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Correo no válido"),
});

export default function AuthCard() {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    const userResponse = await getUserLogged(values.email);

    if (userResponse.status === false) {
      toast({
        title: "Cuenta desactivada",
        description: "Tu cuenta ha sido desactivada, contacta con soporte.",
        variant: "destructive",
      });
      return;
    }

    const responseNextAuth = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      toast({
        title: "Error de inicio de sesión",
        description: responseNextAuth.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Bienvenido al Sistema" });
    router.push("/");
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await registerUser(values);

      if (!res.ok) {
        const responseAPI = await res.json();
        throw new Error(responseAPI.message);
      }

      const responseNextAuth = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (responseNextAuth?.error) throw new Error(responseNextAuth.error);

      toast({ title: "Registrado Correctamente" });
      router.push("/");
    } catch (error) {
      toast({
        title: "Registro Fallido",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    // Implement forgot password logic here
    toast({ title: "Recuperación de contraseña", description: "Se ha enviado un correo con instrucciones." });
  };

  const renderForm = () => {
    switch (formType) {
      case "login":
        return (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu contraseña"
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
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("forgotPassword")}
                  className="text-blue-600 hover:underline"
                >
                  Olvidé mi contraseña
                </button>
              </div>
              <Button type="submit" className="w-full mt-6">
                Iniciar sesión
              </Button>
            </form>
          </Form>
        );
      case "register":
        return (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su correo" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ingrese su contraseña"
                          type={showPassword ? "text" : "password"}
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
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirme su contraseña"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6">
                Registro
              </Button>
            </form>
          </Form>
        );
      case "forgotPassword":
        return (
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu correo electrónico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6">
                Recuperar Contraseña
              </Button>
            </form>
          </Form>
        );
    }
  };

  const getFormTitle = () => {
    switch (formType) {
      case "login":
        return "Iniciar sesión";
      case "register":
        return "Registrarse";
      case "forgotPassword":
        return "Recuperar Contraseña";
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 bg-[url('/background.png')]">
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>
      <Card className="w-full max-w-lg bg-opacity-70 p-8 rounded-lg shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            {getFormTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{renderForm()}</CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {formType === "login" || formType === "register" ? (
            <div className="text-center text-sm">
              {formType === "login"
                ? "¿No tienes una cuenta?"
                : "¿Ya tienes una cuenta?"}{" "}
              <button
                onClick={() =>
                  setFormType(formType === "login" ? "register" : "login")
                }
                className="text-blue-600 hover:underline"
              >
                {formType === "login" ? "Regístrate" : "Inicia sesión"}
              </button>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <Separator />
              <Button
                variant="default"
                className="w-full"
                onClick={() => setFormType("login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio de
                sesión
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}