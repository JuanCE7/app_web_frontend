import SessionRoleProvider from "@/context/RoleProvider";
import ListUsers from "./components/ListUsers/ListUsers";

export default function Page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Administrator"]}>
        <h2 className="text-2xl">Lista de Usuarios</h2>
        <ListUsers />
      </SessionRoleProvider>
    </div>
  );
}
