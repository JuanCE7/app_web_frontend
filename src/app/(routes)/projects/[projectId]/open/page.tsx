import { getProjectById } from "../../projects.api";
import { redirect } from "next/navigation";
import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";

export default async function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {

  const project = await getProjectById(params.projectId);

  if (!project) {
    return redirect("/projects");
  }

  return (
    <div>
      <HeaderUseCases projectId={project.id}/>
      <ListUseCases projectId={project.id} />
    </div>
  );
}
