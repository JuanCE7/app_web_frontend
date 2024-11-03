import { z } from "zod";

const FlowSchema = z.object({
  id: z.string(),
  steps: z.array(z.string().min(1, "El paso no puede estar vacío"))
})

export const FormSchema = z.object({
  id: z.string().min(1, "El ID es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  inputs: z.array(z.string().min(1, "La entrada no puede estar vacía")).min(1, "Se requiere al menos una entrada"),
  preconditions: z.array(z.string().min(1, "La precondición no puede estar vacía")).min(1, "Se requiere al menos una precondición"),
  postconditions: z.array(z.string().min(1, "La postcondición no puede estar vacía")).min(1, "Se requiere al menos una postcondición"),
  normalFlow: FlowSchema,
  alternateFlows: z.array(FlowSchema)
})
