import { getProjectById } from "../../projects.api";
import { redirect } from "next/navigation";
import { ProjectInformation } from "./components/ProjectInformation";
import { FooterProject } from "./components/FooterProject";
import { Header } from "@/components/Header";
import { getServerSession } from "@/app/api/auth/[...nextauth]/auth";

const item = {
  name: "Edit Project",
  href: "/projects",
};

export default async function EditProject({
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
      <Header key={item.name} item={item}/>
      <ProjectInformation project={project} />
      <FooterProject projectId={project.id} />
    </div>
  );
}
