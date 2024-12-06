'use client'

import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { getUserLogged } from "@/app/api/users/login.api"
import { SidebarRoutesClient } from "./SidebarRoutesClient"

export function SidebarRoutes() {
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user?.email) {
        try {
          console.log(session)
          const user = await getUserLogged(session.user.email)

          // Validar que 'user' y 'user.role' existan antes de usar 'role.name'
          if (user?.role?.name) {
            setUserRole(user.role.name)
          } else {
            console.warn("User role is undefined or malformed:", user)
            setUserRole(null) // Asigna null o un valor predeterminado si no existe
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      }
    }

    fetchUserRole()
  }, [session])

  if (status === "loading" || !userRole) {
    return <div>Loading...</div> // Puedes usar un componente de loading más robusto
  }

  if (status === "unauthenticated") {
    return null // O redirigir a la página de login
  }

  return <SidebarRoutesClient userRole={userRole} />
}
