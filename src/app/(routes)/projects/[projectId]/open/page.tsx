import { Suspense } from "react";
import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";
import SessionRoleProvider from "@/context/RoleProvider";
import { UseCaseProvider } from "@/context/UseCaseContext";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import SessionAuthProvider from "@/context/SessionAuthProvider";

export default function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
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
