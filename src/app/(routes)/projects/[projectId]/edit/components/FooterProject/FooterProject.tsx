"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FooterProjectProps } from "./FooterProject.types";
import { toast } from "@/hooks/use-toast";
import { deleteProject } from "@/app/(routes)/projects/projects.api";

export function FooterProject(props: FooterProjectProps) {
  const { projectId } = props;
  const router = useRouter();

  const onDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      toast({
        title: "Project deleted",
      });
      router.push("/projects");
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end mt-5">
      <Button variant="destructive" onClick={onDeleteProject}>
        <Trash className="w-4 h-4 mr-2" />
        Remove project
      </Button>
    </div>
  );
}
