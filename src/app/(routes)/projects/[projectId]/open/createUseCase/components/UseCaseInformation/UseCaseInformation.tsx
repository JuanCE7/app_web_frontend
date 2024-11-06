import { z } from "zod";
import { UseCaseForm } from "../UseCaseForm";
import { FormSchema } from "../UseCaseForm/UseCaseForm.form";
import { UseCaseInformationProps } from "./UseCaseInformation.types";

type FormData = z.infer<typeof FormSchema>;

export function UseCaseInformation(props: UseCaseInformationProps) {
  const { useCase, projectId, useCaseId } = props;

  const initialData: FormData = {
    displayId: useCase.displayId || "",
    name: useCase.name || "",
    description: useCase.description || "",
    entries: Array.isArray(useCase.entries) ? useCase.entries : [""],
    preconditions: useCase.preconditions || [""],
    postconditions: useCase.postconditions || [""],
    mainFlow: {
      name: useCase.mainFlow?.name || Date.now().toString(),
      steps: [...(useCase.mainFlow?.steps || [{ number: 1, description: "" }])],
    },
    alternateFlows: useCase.alternateFlows || [],
    projectId,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-10 gap-y-4">
      <div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
        <div>
          <UseCaseForm
            mode="create"
            initialData={initialData}
            projectId={projectId}
            useCaseId={useCase.id}
          />
        </div>
      </div>
    </div>
  );
}
