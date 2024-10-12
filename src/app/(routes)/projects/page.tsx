import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Component() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Projects/..</h1>

      <Button className="mb-6 bg-[#b8c5b8] hover:bg-[#a7b3a7] text-black">NEW PROJECT</Button>

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
            <TableCell>121hkb1 kdwjk</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>test1</TableCell>
            <TableCell>project dev</TableCell>
            <TableCell>jfcastillo</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">JOIN</Button>
                <Button className="bg-red-600 hover:bg-red-700">DELETE</Button>
                <Button className="bg-green-600 hover:bg-green-700">SHARE</Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Creator</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">JOIN</Button>
                <Button className="bg-red-600 hover:bg-red-700">DELETE</Button>
                <Button className="bg-green-600 hover:bg-green-700">SHARE</Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Creator</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">JOIN</Button>
                <Button className="bg-red-600 hover:bg-red-700">DELETE</Button>
                <Button className="bg-green-600 hover:bg-green-700">SHARE</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

