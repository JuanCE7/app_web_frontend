"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useTheme } from 'next-themes';

import { updateUser } from "@/app/api/users/user.api";
import { formSchema } from "./register.form";
import { loginSchema } from "./login.form";
import Image from "next/image";
import { getUserLogged, passwordRecovery, registerUser, verifyOtp } from "@/app/api/users/login.api";

type FormType =
  | "login"
  | "register"
  | "forgotPassword"
  | "otpValidation"
  | "changePassword";

const forgotPasswordSchema = z.object({
  emailOTP: z.string().email("Correo No válido"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "El código OTP debe tener 6 dígitos"),
});

const changePasswordSchema = z
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

export default function AuthCard() {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const { theme } = useTheme();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailOTP: "",
    },
    mode: "onChange",
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      passwordReset: "",
      confirmPasswordReset: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

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
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const userResponse = await getUserLogged(values.email);

      if (userResponse.status === false) {
        toast({
          title: "Cuenta desactivada",
          description: "Tu cuenta ha sido desactivada, contacta con soporte.",
          variant: "destructive",
        });
        return;
      }
  
      // Intentar inicio de sesión con NextAuth
      const responseNextAuth = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
  
      if (!responseNextAuth || responseNextAuth.error) {
        throw new Error(
           "Correo o contraseña incorrectos"
        );
      }
  
      // Login exitoso
      toast({ title: "Bienvenido al Sistema" });
      router.push("/");
    } catch (error) {
      // Manejo de errores
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Inicio de Sesión Fallido",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  

  const handleForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    try {
      const response = await passwordRecovery(values.emailOTP);
      if (response.otpToken) {
        setEmail(values.emailOTP);
        setToken(response.otpToken);
        setFormType("otpValidation");
        toast({
          title: "Correo enviado",
          description: "Por favor, revisa tu bandeja de entrada",
        });
      } else {
        throw new Error(
          "No se pudo enviar el correo de recuperación, ingrese una información correcta"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleOTPValidation = async (values: z.infer<typeof otpSchema>) => {
    try {
      const value = {
        token: token,
        otpCode: values.otp,
      };
      const response = await verifyOtp(value);

      if (response.success) {
        setFormType("changePassword");
        otpForm.reset(); 
        toast({ title: "OTP validado correctamente" });
      } else {
        throw new Error("Código OTP inválido");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    try {
      const user = await getUserLogged(email);
      const response = await updateUser(user.id, { password: values.passwordReset});
      if (response) {
        setFormType("login");
        toast({
          title: "Contraseña cambiada correctamente",
          description: "Por favor, inicia sesión con tu nueva contraseña",
        });
      } else {
        throw new Error("No se pudo cambiar la contraseña");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const renderForm = () => {
    switch (formType) {
      case "login":
        return (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="firstName"
                key={"firstName"}
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
                key={"lastName"}
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
        );
      case "forgotPassword":
        return (
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
              className="space-y-4"
            >
              <FormField
                control={forgotPasswordForm.control}
                name="emailOTP"
                key={"emailOTP"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa tu correo electrónico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6">
                Enviar correo de recuperación
              </Button>
            </form>
          </Form>
        );
      case "otpValidation":
        return (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleOTPValidation)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center text-center">
                    <FormLabel className="mb-4">Código OTP</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-4" />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6">
                Validar OTP
              </Button>
            </form>
          </Form>
        );
      case "changePassword":
        return (
          <Form {...changePasswordForm}>
            <form
              onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <FormField
                control={changePasswordForm.control}
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
                control={changePasswordForm.control}
                name="confirmPasswordReset"
                key={"confirmPasswordReset"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirma tu nueva contraseña"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6">
                Cambiar Contraseña
              </Button>
            </form>
          </Form>
        );
      default:
        return null;
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
      case "otpValidation":
        return "Validar OTP";
      case "changePassword":
        return "Cambiar Contraseña";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 bg-[url('/bg.jpg')]">
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>
      <Card className="w-full max-w-lg  bg-opacity-70 p-8 rounded-lg shadow-lg">
        <CardHeader className="space-y-1 items-center justify-center">
            <Image
              src={theme === 'dark' ? '/carrera2.png' : '/carrera.png'}
              alt="logo"
              width={300}
              height={300}
              priority
            />
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
                variant="outline"
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
