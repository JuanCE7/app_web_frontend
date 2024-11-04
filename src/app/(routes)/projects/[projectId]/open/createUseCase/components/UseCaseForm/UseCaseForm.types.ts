type Step = {
  number: number;
  step: string; // O el nombre que desees para representar el paso
};

type Flow = {
  name: string;
  steps: Step[];
};

type UseCase = {
  name: string;
  id: string;
  description: string;
  entries: string[]; // Especifica el tipo de elementos que contendrá
  preconditions: string[]; // Asegúrate de que sea un arreglo de strings
  postconditions: string[]; // Asegúrate de que sea un arreglo de strings
  mainFlow: Flow; // Un arreglo de flujos, donde cada flujo tiene un nombre y un arreglo de pasos
  alternateFlows: Flow[]; // Similar al flujo principal
};

export type UseCaseFormProps = {
  useCase: UseCase;
  projectId: string;
};
