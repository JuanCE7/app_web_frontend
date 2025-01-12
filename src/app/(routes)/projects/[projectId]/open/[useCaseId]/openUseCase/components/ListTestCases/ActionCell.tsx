// ActionCell.tsx
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Pencil, Trash2, ExternalLink, MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { FormTestCase } from '../FormTestCase'
import { toast } from '@/hooks/use-toast'
import { TestCase } from '@/components/pdf/pdf.types'
import { useTestCases } from '@/context/TestCaseContext'

interface ActionCellProps {
  testCase: TestCase
}

type SchemaExplanation = {
  summary?: string
  details?: string
}

const ActionCell: React.FC<ActionCellProps> = ({ testCase }) => {
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [openModalExplanation, setOpenModalExplanation] = useState(false)
  const [explanationData, setExplanationData] = useState<SchemaExplanation>()
  const router = useRouter()

  const handleEdit = useCallback(() => {
    setOpenModalCreate(true)
  }, [])

  const handleDelete = useCallback(() => {
    setOpenModalDelete(true)
  }, [])
  const { deleteTestCase, getExplanationById } = useTestCases();

  const handleExplanation = useCallback(async () => {
    try {
      const explanation = await getExplanationById(testCase.id || '')
      
      if (!explanation) {
        setExplanationData({
          summary: 'No existe Explicación',
          details: 'Este caso de prueba funcional no ha sido generado por IA',
        })
      } else {
        setExplanationData(explanation)
      }

      setOpenModalExplanation(true)
    } catch (error) {
      if (error.message === 'Not Found') {
        setExplanationData({
          summary: 'No existe Explicación',
          details: 'Este caso de prueba funcional no ha sido generado por IA',
        })
        setOpenModalExplanation(true)
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo obtener la explicación',
          variant: 'destructive',
        })
      }
    }
  }, [testCase.id])

  const confirmDeleteTestCase = useCallback(async () => {
    if (testCase.id) {
      await deleteTestCase(testCase.id)
      setOpenModalDelete(false)
      router.refresh()
      toast({
        title: 'Caso de Prueba Eliminado Correctamente',
      })
    }
  }, [testCase.id, router])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" name="Open" className="w-8 h-8 p-0">
            <span className="sr-only">Open</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExplanation}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Explicación
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de edición */}
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Caso de Prueba</DialogTitle>
            <DialogDescription>Modifica la información del caso de prueba</DialogDescription>
          </DialogHeader>
          <FormTestCase
            testCaseId={testCase.id}
            useCaseId={testCase.useCaseId}
            setOpenModalCreate={setOpenModalCreate}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de eliminación */}
      <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
        <DialogContent className="sm:max-w-[625px] flex flex-col items-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-center">
              ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full space-x-4 mt-6">
            <Button variant="outline" onClick={() => setOpenModalDelete(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTestCase} className="flex-1">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de explicación */}
      <Dialog open={openModalExplanation} onOpenChange={setOpenModalExplanation}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">{testCase.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[50vh] pr-4">
            <div className="space-y-4">
              <div className="flex flex-col justify-center items-center text-center space-y-2">
                <h3 className="font-semibold">Código</h3>
                <Badge variant="secondary">{testCase.code}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-center">Explicación</h3>
                <p>
                  <strong>Resumen:</strong> {explanationData?.summary}
                </p>
                <p>
                  <strong>Detalles:</strong> {explanationData?.details}
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionCell
