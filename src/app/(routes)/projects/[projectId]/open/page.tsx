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
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <HeaderUseCases projectId={project.id}/>
      <ListUseCases projectId={project.id} />
    </div>
  );
}
