type Project = {
  image: string;
  name: string;
  id: string;
  description: string;
  creatorId: string;
};

export type ProjectFormProps = {
  project: Project
};
