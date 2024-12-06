'use client'

import { useState, useEffect } from 'react'
import { columns } from "./columns"
import { DataTable } from "@/components/Data-Table"
import { getUseCases } from "@/app/api/useCases/useCases.api"

export default function ListUseCases({ projectId }: { projectId: string }) {
  const [listUseCases, setListUseCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUseCases() {
      try {
        const useCases = await getUseCases(projectId)
        setListUseCases(useCases)
      } catch (error) {
        console.error("Error fetching use cases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUseCases()
  }, [projectId, listUseCases])

  if (isLoading) {
    return <div>Cargando casos de uso...</div>
  }

  return (
    <DataTable
      columns={columns}
      data={listUseCases}
      placeholder="Filtro por código ..."
      filter="code"
    />
  )
}

