import { z } from "zod";

export const formSchema = z.object({
  displayId: z.string().min(2),
  name: z.string().min(5),
  description: z.string().min(10),
  entries: z.string(),
  preconditions: z.string(),
  postconditions: z.string(),
  mainFlow:z.string(),
  alternateFlows: z.string(),
});
