import { columns } from "./columns";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/Data-Table";
import { getServerSession } from "@/app/api/auth/[...nextauth]/auth";
import { getUsers } from "@/lib/users.api";

export default async function ListUsers() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");  
  }

  const users = await getUsers();  

  return (
    <DataTable
      columns={columns}
      data={users}
      placeholder="Filtro por correo..."
      filter="email"
    />
  );
}
