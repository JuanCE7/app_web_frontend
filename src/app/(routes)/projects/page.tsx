import SessionRoleProvider from "@/context/RoleProvider";
import { HeaderProjects } from "./components/HeaderProjects";
import ListProjects from "./components/ListProjects/ListProjects";

export function page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={['Tester']}>
        <HeaderProjects />
        <ListProjects />
        <div className="space-y-4"></div>
      </SessionRoleProvider>
    </div>
  );
}

export default page;
