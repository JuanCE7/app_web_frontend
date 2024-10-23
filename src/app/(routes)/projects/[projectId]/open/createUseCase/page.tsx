"use client";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { useEffect } from "react";
import { UseCaseInformation } from "./components/UseCaseInformation";
import { getUseCaseById } from "../useCases.api";

export default async function OpenProject({
  params,
}: {
  params: { useCaseId: string };
}) {
  const { status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const useCase = await getUseCaseById(params.useCaseId);
  if (!useCase) {
    return redirect("/");
  }
  const item = {
    icon: ExternalLink,
    name: "Use Case Create",
    href: `/projects/${params.useCaseId}/open`, 
  };

  return (
    <div>
      <Header key={item.name} item={item} />
      <UseCaseInformation useCase={useCase}/>
    </div>
  );
}
