import { Suspense } from "react";
import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";
import SessionRoleProvider from "@/context/RoleProvider";
import { UseCaseProvider } from "@/context/UseCaseContext";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <SessionRoleProvider allowedRoles={["Tester"]}>
        <UseCaseProvider projectId={params.projectId}>
          <Suspense fallback={<LoadingSpinner />}>
            <HeaderUseCases projectId={params.projectId} />
            <ListUseCases />
          </Suspense>
        </UseCaseProvider>
      </SessionRoleProvider>
    </div>
  );
}
