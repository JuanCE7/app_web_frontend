import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";
import SessionRoleProvider from "@/context/RoleProvider";

export default async function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Tester"]}>
        <HeaderUseCases projectId={params.projectId} />
        <ListUseCases projectId={params.projectId} />
      </SessionRoleProvider>
    </div>
  );
}
