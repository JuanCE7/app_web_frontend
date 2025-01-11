"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUsers } from "./UsersContext";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleCheck = ({ children, allowedRoles }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { getUserLogged } = useUsers();
  
  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);
          // Ensure the user and user.role exist before accessing the role
          if (user?.role?.name) {
            setUserRole(user.role.name);
          } else {
            console.warn("User role is undefined or malformed:", user);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    }

    if (status === "authenticated") {
      fetchUserRole();
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      userRole &&
      !allowedRoles.includes(userRole)
    ) {
      // Redirect user if their role is not in the allowedRoles list
      router.push("/unauthorized");
    }
  }, [status, userRole, allowedRoles, router]);

  if (status === "loading" || !userRole) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

const SessionRoleProvider = ({ children, allowedRoles }: Props) => {
  return <RoleCheck allowedRoles={allowedRoles}>{children}</RoleCheck>;
};

export default SessionRoleProvider;
