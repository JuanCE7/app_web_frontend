import SessionRoleProvider from "@/context/RoleProvider";
import ListProjects from "./components/ListProjects/ListProjects";
import { ProjectProvider } from "@/context/ProjectsContext";
import { HeaderProjects } from "./components/HeaderProjects";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export function page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Tester"]}>
        <ProjectProvider>
        <Suspense fallback={<LoadingSpinner />}>  
          <HeaderProjects />
          <ListProjects />
          <div className="space-y-4"></div>
        </Suspense>
        </ProjectProvider>
      </SessionRoleProvider>
    </div>
  );
}

export default page;
