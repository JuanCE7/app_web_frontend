"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserLogged } from '@/app/login/login.api';
import { getProjects } from '../../projects.api';
import { DataTable } from './data-table';
import { columns } from './columns';
import { redirect } from 'next/navigation';

export default function ListProjects() {
  const { data: session } = useSession();
  const [listProjects, setListProjects] = useState([]);

  if(!session){
    return redirect("/")
  }
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (session?.user?.email) {
          const user = await getUserLogged(session.user.email);
          const projects = await getProjects(user.id);
          setListProjects(projects);
        } else {
          throw new Error("User session not available");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [session]);

  return (
    <DataTable columns={columns} data={listProjects} />
  );
}
