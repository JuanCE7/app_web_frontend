import Image from "next/image";
import { ProjectInformationProps } from "./ProjectInformation.types";
import { ProjectForm } from "../ProjectForm";

export function ProjectInformation(props: ProjectInformationProps) {
  const { project } = props;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
      <div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
        <div>
          <Image
            src={
              typeof project.image === "string" ? project.image : "/logo.png"
            }
            alt="Project Image"
            width={50}
            height={50}
            className="mb-3 rounded-lg"
          />

          <ProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}
