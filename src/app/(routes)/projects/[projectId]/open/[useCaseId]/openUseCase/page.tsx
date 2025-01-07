import { Suspense } from "react";
import SessionRoleProvider from "@/context/RoleProvider";
import { TestCaseProvider } from "@/context/TestCaseContext";
import { HeaderTestCases } from "./components/HeaderTestCases";
import ListTestCases from "./components/ListTestCases/ListTestCases";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function OpenProject({
  params,
}: {
  params: { useCaseId: string; projectId: string };
}) {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <Suspense
        fallback={<LoadingSpinner/>}
      >
        <SessionRoleProvider allowedRoles={["Tester"]}>
          <TestCaseProvider
            projectId={params.projectId}
            useCaseId={params.useCaseId}
          >
            <HeaderTestCases
              useCaseId={params.useCaseId}
              projectId={params.projectId}
            />
            <ListTestCases useCaseId={params.useCaseId} />
          </TestCaseProvider>
        </SessionRoleProvider>
      </Suspense>
    </div>
  );
}
