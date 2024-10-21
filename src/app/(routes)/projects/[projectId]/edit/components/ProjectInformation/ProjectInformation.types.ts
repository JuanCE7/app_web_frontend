type Project = {
  image: string;
  name: string;
  id: string;
  description: string;
  creatorId: string;
};

export type ProjectInformationProps = {
  project: Project
};
