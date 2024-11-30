import { getUserLogged } from "@/lib/login.api";
import { getProjects } from "@/lib/projects.api";
import { columns } from "./columns";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/Data-Table";
import { getServerSession } from "@/app/api/auth/[...nextauth]/auth";

export default async function ListProjects() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");  
  }

  const user = await getUserLogged(session.user.email);
  const projects = await getProjects(user.id);
  
  return (
    <DataTable
      columns={columns}
      data={projects}
      placeholder="Filtro por nombre..."
      filter="name"
    />
  );
}
