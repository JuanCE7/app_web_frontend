import SessionRoleProvider from "@/context/RoleProvider";
import ListUsers from "./components/ListUsers/ListUsers";
import { UserProvider } from "@/context/UsersContext";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <SessionRoleProvider allowedRoles={["Administrator"]}>
        <UserProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold sm:text-3xl">Usuarios</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona las cuentas y roles del sistema.
              </p>
            </div>
            <ListUsers />
          </Suspense>
        </UserProvider>
      </SessionRoleProvider>
    </div>
  );
}
