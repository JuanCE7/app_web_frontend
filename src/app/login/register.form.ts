import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(3, "El Nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El Apellido debe tener al menos 3 caracteres"),
  email: z.string().email("Correo No válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});