"use client";
import { useSession } from "next-auth/react";
import { getProjectById } from "../../projects.api";
import { redirect } from "next/navigation";
import {ExternalLink } from 'lucide-react'
import { Header } from "@/components/Header";
import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";

const item = {
  icon: ExternalLink ,
  name: "Open Project",
  href: "/projects",
};

export default async function OpenProject({
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
      <Header key={item.name} item={item} />
      <HeaderUseCases projectId={project.id}/>
      <ListUseCases projectId={project.id} />
    </div>
  );
}
