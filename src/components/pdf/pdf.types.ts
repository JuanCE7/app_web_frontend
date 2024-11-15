export type Project = {
  id?: string;
  code?: string;
  image?: string;
  name: string;
  description?: string;
  role?: string;
};
export type UseCase = {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
};
export type TestCase = {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
};

export type pdfProps = {
  project: Project;
  useCases: UseCase[];
  testCases: TestCase[];
};
