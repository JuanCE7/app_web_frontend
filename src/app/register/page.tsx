"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("test@test.com");
  const [name, setName] = useState<string>("test");
  const [password, setPassword] = useState<string>("123123");
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <div className="hidden lg:block lg:w-[55%] bg-[#3b5167] transform -skew-x-12 origin-top-right absolute inset-y-0 left-0 z-0">
        <div className="transform skew-x-12 h-full flex items-center justify-center p-12">
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold">Aprende casos de prueba</h1>
            <h2 className="text-5xl font-bold text-[#00cbff]">funcionales</h2>
            <h2 className="text-5xl font-bold text-[#00cbff]">con</h2>
            <h2 className="text-5xl font-bold text-[#00cbff]">Test Use Case</h2>
          </div>
        </div>
      </div>

      {/* Right side with forms */}
      <div className="w-full lg:w-[60%] p-8 flex items-center justify-center ml-auto relative z-10 bg-white">
        <div className="w-full max-w-md space-y-8">
          <Tabs defaultValue="register">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Registrarse</TabsTrigger>
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            </TabsList>
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSubmit2}>
                <Input
                  name="name"
                  placeholder="Nombre completo"
                  onChange={(event) => setName(event.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" />
                  <label htmlFor="marketing" className="text-sm text-gray-600">
                    Acepto que Test Use Case use mi información con fines
                    exploratorios.
                  </label>
                </div>

                <Button
                  className="w-full bg-[#8e1e5f] hover:bg-[#7a1a51]"
                  type="submit"
                >
                  Crea una cuenta
                </Button>
              </form>
              {errors.length > 0 && (
                <div className="alert alert-danger mt-2">
                  <ul className="mb-0">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#8e1e5f] hover:bg-[#7a1a51]"
                >
                  Iniciar sesión
                </Button>
              </form>
              {errors.length > 0 && (
                <div className="alert alert-danger mt-2">
                  <ul className="mb-0">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
