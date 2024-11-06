import { z } from "zod";
import { FormSchema } from "./UseCaseForm.form";

type FormData = z.infer<typeof FormSchema>;

export type UseCaseFormProps = {
  projectId: string;
  initialData?: FormData;
  mode: "create" | "edit";
  useCaseId: string;
};
