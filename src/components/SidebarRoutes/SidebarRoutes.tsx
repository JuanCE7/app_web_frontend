"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SidebarRoutesClient } from "./SidebarRoutesClient";
import { useUsers } from "@/context/UsersContext";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export function SidebarRoutes() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { getUserLogged } = useUsers();
  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);
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

    fetchUserRole();
  }, [session]);

  if (status === "loading" || !userRole) {
    return <div>
      <LoadingSpinner/>
    </div>;
  }

  if (status === "unauthenticated") {
    return null; 
  }

  return <SidebarRoutesClient userRole={userRole} />;
}
