import { getProjectById } from "../../projects.api";
import { redirect } from "next/navigation";
import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";
import { getServerSession } from "@/app/api/auth/[...nextauth]/auth";

export default async function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  const project = await getProjectById(params.projectId);
  if (!project) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderUseCases projectId={project.id}/>
      <ListUseCases projectId={project.id} />
    </div>
  );
}
