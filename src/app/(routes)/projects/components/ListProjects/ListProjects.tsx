'use client'
import { columns } from "./columns"
import { DataTable } from "@/components/Data-Table"
import { useProjects } from '@/context/ProjectsContext'

export default function ListProjects() {
  const { projects, isLoading } = useProjects()

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

