import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(10),
  entries: z.array(z.string()),
  preconditions: z.array(z.string()),
  postconditions: z.array(z.string()),
  mainFlow:z.array(z.string()),
  alternateFlows: z.array(z.string())
});
