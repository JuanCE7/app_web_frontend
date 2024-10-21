import { z } from "zod";

export const formSchema = z.object({
  image: z.string(),
  name: z.string().min(5),
  description: z.string().min(10),
});
