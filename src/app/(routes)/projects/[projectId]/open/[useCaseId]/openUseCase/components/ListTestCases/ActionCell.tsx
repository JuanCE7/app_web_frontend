// ActionCell.tsx
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, ExternalLink, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormTestCase } from "../FormTestCase";
import { toast } from "@/hooks/use-toast";
import { TestCase } from "@/components/pdf/pdf.types";
import { useTestCases } from "@/context/TestCaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActionCellProps {
  testCase: TestCase;
}

type SchemaExplanation = {
  summary?: string;
  details?: string;
};

const ActionCell: React.FC<ActionCellProps> = ({ testCase }) => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalExplanation, setOpenModalExplanation] = useState(false);
  const [explanationData, setExplanationData] = useState<SchemaExplanation>();
  const router = useRouter();

  const handleEdit = useCallback(() => {
    setOpenModalCreate(true);
  }, []);

  const handleDelete = useCallback(() => {
    setOpenModalDelete(true);
  }, []);
  const { deleteTestCase, getExplanationById } = useTestCases();

  const handleExplanation = useCallback(async () => {
    try {
      const explanation = await getExplanationById(testCase.id || "");

      if (!explanation) {
        setExplanationData({
          summary: "No existe Explicación",
          details: "Este caso de prueba funcional no ha sido generado por IA",
        });
      } else {
        setExplanationData(explanation);
      }

      setOpenModalExplanation(true);
    } catch (error) {
      if (error.message === "Not Found") {
        setExplanationData({
          summary: "No existe Explicación",
          details: "Este caso de prueba funcional no ha sido generado por IA",
        });
        setOpenModalExplanation(true);
      } else {
        toast({
          title: "Error",
          description: "No se pudo obtener la explicación",
          variant: "destructive",
        });
      }
    }
  }, [testCase.id]);

  const confirmDeleteTestCase = useCallback(async () => {
    if (testCase.id) {
      await deleteTestCase(testCase.id);
      setOpenModalDelete(false);
      router.refresh();
      toast({
        title: "Caso de Prueba Eliminado Correctamente",
      });
    }
  }, [testCase.id, router]);

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
            <DialogDescription>
              Modifica la información del caso de prueba
            </DialogDescription>
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
            <DialogTitle className="text-center">
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Estás seguro de que deseas eliminar este elemento? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setOpenModalDelete(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTestCase}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de explicación */}
      <Dialog
        open={openModalExplanation}
        onOpenChange={setOpenModalExplanation}
      >
        <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] p-0 md:w-[70vw] md:max-w-[70vw] lg:w-[60vw] lg:max-w-[60vw] xl:w-[50vw] xl:max-w-[50vw] flex flex-col">
          <DialogHeader className="p-4 md:p-6">
            <DialogTitle>{testCase.name}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-full w-full">
            <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-4 h-full w-full">
              <div className="space-y-4 lg:w-1/4">
                <Card className="bg-green-100 dark:bg-[#0A7075]">
                  <CardHeader>
                    <CardTitle>Código</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{testCase.code}</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-100 dark:bg-[#0A7075]">
                  <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{explanationData?.summary}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="lg:w-3/4 ">
                <CardHeader>
                  <CardTitle>Detalle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p>{explanationData?.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionCell;
