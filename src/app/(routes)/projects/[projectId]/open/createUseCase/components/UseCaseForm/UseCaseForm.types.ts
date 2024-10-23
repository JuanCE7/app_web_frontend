type UseCase = {
  name: string;
  id: string;
  description: string;
  entries: [];
  preconditions: [];
  postconditions: [];
  mainFlow: [];
  alternateFlows: [];
};

export type UseCaseFormProps = {
  useCase: UseCase;
};
