import SessionRoleProvider from "@/context/RoleProvider";
import { FormUser } from "./components/FormUser";

export default function Settings() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <SessionRoleProvider allowedRoles={["Administrator", "Tester"]}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl animate-fadeInDown delay-[150ms]">
            Configuración de Perfil
          </h2>
        </div>
        <FormUser />
      </SessionRoleProvider>
      
    </div>
  );
}
