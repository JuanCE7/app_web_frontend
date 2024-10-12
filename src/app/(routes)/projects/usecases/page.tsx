

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info } from "lucide-react"

export default function Component() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects/UseCase/..</h1>
        <Button variant="outline" className="flex items-center gap-2">
          Info Example <Info className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name-project">
            Name Project
          </label>
          <Input id="name-project" placeholder="Value" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="entries">
            Entries
          </label>
          <Select>
            <option>Value</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <Input id="name" placeholder="Value" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="preconditions">
            Preconditions
          </label>
          <Select>
            <option>Value</option>
          </Select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Description
          </label>
          <Input id="description" placeholder="Value" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">MainFlow</h2>
          <Button>ADD</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">AlternateFlows</h2>
          <Button>ADD</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

    </div>
  )
}