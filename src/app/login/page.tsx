"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

type FormType = "login" | "register" | "forgotUsername" | "forgotPassword";

export default function AuthCard() {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("test@test.com");
  const [name, setName] = useState<string>("test");
  const [password, setPassword] = useState<string>("123123");
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  const handleSubmit2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const responseAPI = await res.json();

    if (!res.ok) {
      setErrors(responseAPI.message);
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

    router.push("/dashboard");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/dashboard");
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
                  onClick={() => setFormType("forgotUsername")}
                  className="text-blue-600 hover:underline"
                >
                  Olvidé mi usuario
                </button>
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
            <form onSubmit={handleGoogleLogin}>
              <Button
                type="submit"
                className="w-full mt-6 bg-[#3586ff] text-cyan-50 hover:bg-[#3a64a1]"
              >
                Inicia con Google
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
            <form onSubmit={handleSubmit2}>
              <div className="space-y-2">
                <Label htmlFor="newUsername">Nombre</Label>
                <Input
                  id="newUsername"
                  placeholder="Escriba su nombre"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUsername">Email</Label>
                <Input
                  id="newUsername"
                  placeholder="Escriba su email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Elige una contraseña"
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                />
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
            <Label htmlFor="usernameOrEmail">
              Usuario o Correo Electrónico
            </Label>
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
      case "forgotUsername":
        return "Recuperar Usuario";
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
      case "forgotUsername":
        return "Recuperar Usuario";
      case "forgotPassword":
        return "Recuperar Contraseña";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>
      <Card className="w-full max-w-md">
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
            <Button
              variant="default"
              className="w-full"
              onClick={() => setFormType("login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio de sesión
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
