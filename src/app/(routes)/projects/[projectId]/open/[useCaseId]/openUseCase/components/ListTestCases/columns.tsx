import { ArrowUpDown } from 'lucide-react'
import ActionCell from './ActionCell'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table';
import { TestCase } from '@/components/pdf/pdf.types';

const removeHtmlTags = (text: string) => {
  return text?.replace(/<[^>]*>/g, "\n") || "";
};

export const columns: ColumnDef<TestCase>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Código
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'description', header: 'Descripción' },
  {
    accessorKey: 'steps',
    header: 'Pasos',
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue('steps'))}</span>,
  },
  {
    accessorKey: 'inputData',
    header: 'Datos de Entrada',
    cell: ({ row }) => <span>{removeHtmlTags(row.getValue('inputData'))}</span>,
  },
  { accessorKey: 'expectedResult', header: 'Resultado esperado' },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionCell testCase={row.original} />,
  },
]
