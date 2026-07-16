"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowLeft, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { formSchema } from "./register.form";
import { loginSchema } from "./login.form";
import { useUsers } from "@/context/UsersContext";
import { pingHealth } from "@/lib/apiClient";

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

function getPasswordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Muy débil", "Débil", "Aceptable", "Buena", "Segura"];
  return { score, label: labels[score] };
}

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label } = getPasswordStrength(password);
  const barColor =
    score >= 4
      ? "bg-emerald-500"
      : score === 3
      ? "bg-emerald-500"
      : score === 2
      ? "bg-amber-500"
      : "bg-destructive";
  const textColor =
    score >= 3
      ? "text-emerald-600 dark:text-emerald-400"
      : score === 2
      ? "text-amber-600 dark:text-amber-400"
      : "text-destructive";
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < score ? barColor : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("mt-1 text-xs font-medium", textColor)}>
        {score >= 3 ? `Contraseña ${label.toLowerCase()} ✓` : `Seguridad: ${label}`}
      </p>
    </div>
  );
}

export default function AuthCard() {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser, passwordRecovery, verifyOtp, resetPassword } =
    useUsers();
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

  // Pre-calentamiento: apenas se abre el login, despertamos el backend (Render
  // free se duerme). Así, para cuando el usuario termina de escribir sus
  // credenciales, el servidor ya está despierto y el login no falla por cold start.
  useEffect(() => {
    pingHealth();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      // El backend valida credenciales y estado de la cuenta (desactivada) y
      // devuelve el mensaje a través de NextAuth. Ya no consultamos /users
      // antes de autenticar (esa ruta ahora requiere token).
      const responseNextAuth = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!responseNextAuth || responseNextAuth.error) {
        throw new Error(
          responseNextAuth?.error || "Correo o contraseña incorrectos"
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPValidation = async (values: z.infer<typeof otpSchema>) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    setIsSubmitting(true);
    try {
      // Autorizado por el token OTP firmado (flujo deslogueado), sin tocar
      // rutas de /users que ahora requieren autenticación.
      const response = await resetPassword(token, values.passwordReset);
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
    } finally {
      setIsSubmitting(false);
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
                      <Input
                        placeholder="Ingresa tu email"
                        {...field}
                        maxLength={50}
                      />
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
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("forgotPassword")}
                  className="text-blue-600 hover:underline"
                >
                  Olvidé mi contraseña
                </button>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                Entrar
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
                      <Input
                        placeholder="Ingrese su nombre"
                        {...field}
                        maxLength={60}
                      />
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
                      <Input
                        placeholder="Ingrese su apellido"
                        {...field}
                        maxLength={60}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    field.value || ""
                  );
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Ingrese su correo"
                            type="email"
                            maxLength={50}
                            {...field}
                          />
                          {emailValid && (
                            <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                    <PasswordStrengthMeter password={field.value} />
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
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
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
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
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
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
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
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
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
        return "Bienvenido de vuelta";
      case "register":
        return "Crea tu cuenta";
      case "forgotPassword":
        return "Recuperar contraseña";
      case "otpValidation":
        return "Validar código OTP";
      case "changePassword":
        return "Cambiar contraseña";
      default:
        return "";
    }
  };

  const getFormSubtitle = () => {
    switch (formType) {
      case "login":
        return "Entra para seguir con tus proyectos.";
      case "register":
        return "Empieza a generar casos de prueba con IA en menos de un minuto.";
      case "forgotPassword":
        return "Te enviaremos un código a tu correo para restablecerla.";
      case "otpValidation":
        return "Ingresa el código de 6 dígitos que enviamos a tu correo.";
      case "changePassword":
        return "Crea una nueva contraseña para tu cuenta.";
      default:
        return "";
    }
  };

  const isAuthMain = formType === "login" || formType === "register";

  const marketingBullets = [
    "Cobertura funcional automática",
    "Exporta e integra con tu equipo",
    "Gratis para estudiantes UNL",
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-20">
        <ToggleTheme />
      </div>

      <div className="flex min-h-screen">
        {/* Panel de marketing (login/registro, desde lg) */}
        {isAuthMain && (
          <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 p-12 text-white lg:flex">
            <Logo onDark />
            <div>
              <h2 className="text-4xl font-bold leading-tight">
                Casos de prueba en minutos, no en días.
              </h2>
              <p className="mt-4 max-w-sm text-white/80">
                Describe tus casos de uso y deja que la IA genere los casos de
                prueba funcionales por ti.
              </p>
              <ul className="mt-8 space-y-3">
                {marketingBullets.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-white/60">Universidad Nacional de Loja</p>
          </div>
        )}

        {/* Panel del formulario */}
        <div
          className={cn(
            "flex w-full items-center justify-center bg-card p-6",
            isAuthMain ? "lg:w-1/2" : ""
          )}
        >
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center lg:justify-start">
              <Logo />
            </div>

            {formType === "register" && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Gratis para siempre
              </div>
            )}

            <h1 className="text-2xl font-bold text-foreground">
              {getFormTitle()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getFormSubtitle()}
            </p>

            <div className="mt-6">{renderForm()}</div>

            {isAuthMain ? (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {formType === "login"
                  ? "¿No tienes cuenta? "
                  : "¿Ya tienes cuenta? "}
                <button
                  onClick={() =>
                    setFormType(formType === "login" ? "register" : "login")
                  }
                  className="font-semibold text-primary hover:underline"
                >
                  {formType === "login"
                    ? "Crear cuenta gratis"
                    : "Inicia sesión"}
                </button>
              </p>
            ) : (
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => setFormType("login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio de sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
