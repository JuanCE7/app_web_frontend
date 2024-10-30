import Image from "next/image";
import { ProjectInformationProps } from "./ProjectInformation.types";
import { ProjectForm } from "../ProjectForm";

export function ProjectInformation(props: ProjectInformationProps) {
  const { project } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-10 gap-y-4">
      <div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
        <div>
          <div className="flex items-center justify-center w-full">
            <Image
              src={
                typeof project.image === "string" ? project.image : "/logo.png"
              }
              alt="Project Image"
              width={150}
              height={50}
              className="mb-3 rounded-lg"
            />
          </div>

          <ProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}
