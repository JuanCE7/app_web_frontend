'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getUserLogged } from "@/app/api/users/login.api"
import { getProjects } from "@/app/api/projects/projects.api"
import { columns } from "./columns"
import { DataTable } from "@/components/Data-Table"

export default function ListProjects() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email)
          const projectsData = await getProjects(user.id)
          setProjects(projectsData)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (session) {
      fetchData()
    }
  }, [session, projects])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <DataTable
      columns={columns}
      data={projects}
      placeholder="Filtro por nombre..."
      filter="name"
    />
  )
}

