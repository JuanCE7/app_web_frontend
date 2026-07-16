import SessionRoleProvider from "@/context/RoleProvider";
import ListProjects from "./components/ListProjects/ListProjects";
import { ProjectProvider } from "@/context/ProjectsContext";
import { HeaderProjects } from "./components/HeaderProjects";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <SessionRoleProvider allowedRoles={["Tester"]}>
        <ProjectProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <HeaderProjects />
            <ListProjects />
          </Suspense>
        </ProjectProvider>
      </SessionRoleProvider>
    </div>
  );
}
