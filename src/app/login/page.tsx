"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { ToggleTheme } from "@/components/ToggleTheme";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getUserLogged, registerUser } from "./login.api";

type FormType = "login" | "register" | "forgotUsername" | "forgotPassword";

const formSchema = z
  .object({
    firstName: z.string().min(3, "El Nombre debe tener al menos 3 caracteres"),
    lastName: z.string().min(3, "El Apellido debe tener al menos 3 caracteres"),
    email: z.string().email("Correo No válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AuthCard() {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCopy, setPasswordCopy] = useState<string>("");
  const { data: session } = useSession();
  const [showInfo, setShowInfo] = useState(true); // Nuevo estado para la sección de bienvenida

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    setErrors([]);
  }, [formType]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let res;
    try {
      res = await registerUser(values);

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
        description:
          error instanceof Error ? res?.json.toString() : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const userResponse = await getUserLogged(email);

    if (userResponse.status === false) {
      toast({
        title: "Cuenta desactivada",
        description: "Tu cuenta ha sido desactivada, contacta con soporte.",
        variant: "destructive",
      });
      return;
    }

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }
    toast({ title: "Bienvenido al Sistema" });
      router.push("/");
  };

  const renderForm = () => {
    switch (formType) {
      case "login":
        return (
          <>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  placeholder="Ingresa tu email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    onChange={(event) => setPassword(event.target.value)}
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
              </div>
              <div className="flex justify-between text-sm">
                <button
                  onClick={() => setFormType("forgotPassword")}
                  className="text-blue-600 hover:underline"
                >
                  Olvidé mi contraseña
                </button>
              </div>
              <Button type="submit" className="w-full mt-6">
                {getButtonText()}
              </Button>
            </form>
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
                <ul className="mb-0">
                  {errors.map((error) => (
                    <li key={error} className="list-disc ml-5">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );
      case "register":
        return (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese su correo"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                  control={form.control}
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
          </>
        );
      case "forgotUsername":
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
        );
      case "forgotPassword":
        return (
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail">Correo Electrónico</Label>
            <Input
              id="usernameOrEmail"
              placeholder="Ingresa tu usuario o correo electrónico"
            />
          </div>
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

  const getButtonText = () => {
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
      <Card className="w-full max-w-lg  bg-opacity-70 p-8 rounded-lg shadow-lg ">
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
              <Button
                type="submit"
                variant={"destructive"}
                className="w-full mt-6"
              >
                {getButtonText()}
              </Button>
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
