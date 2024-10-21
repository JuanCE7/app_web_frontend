"use client";
import { useSession } from "next-auth/react";
import { getProjectById } from "../../projects.api";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { ProjectInformation } from "./components/ProjectInformation";
import { FooterProject } from "./components/FooterProject";

export default async function EditProject({
  params,
}: {
  params: { projectId: string };
}) {
  const { data: session } = useSession();

  if (!session) {
    return redirect("/");
  }

  const project = await getProjectById(params.projectId);
  if (!project) {
    return redirect("/");
  }

  return (
    <div>
      <Header />
      <ProjectInformation project={project} />
      <FooterProject projectId={project.id} />
    </div>
  );
}
