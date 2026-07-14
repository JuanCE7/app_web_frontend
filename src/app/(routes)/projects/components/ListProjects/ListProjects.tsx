'use client'
import { columns } from "./columns"
import { DataTable } from "@/components/Data-Table"
import { useProjects } from '@/context/ProjectsContext'
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner"

export default function ListProjects() {
  const { projects, isLoading } = useProjects()

  if (isLoading) {
    return <LoadingSpinner label="Cargando proyectos…" />
  }

  return (
    <DataTable
      columns={columns}
      data={projects}
      placeholder="Filtro por nombre..."
      filter="name"
      emptyTitle="Aún no tienes proyectos"
      emptyDescription="Crea un proyecto nuevo o únete a uno con su código para empezar."
    />
  )
}

