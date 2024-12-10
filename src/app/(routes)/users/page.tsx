import SessionRoleProvider from "@/context/RoleProvider";
import ListUsers from "./components/ListUsers/ListUsers";
import { UserProvider } from "@/context/UsersContext";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function Page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Administrator"]}>
        <UserProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <h2 className="text-2xl">Lista de Usuarios</h2>
            <ListUsers />
          </Suspense>
        </UserProvider>
      </SessionRoleProvider>
    </div>
  );
}
