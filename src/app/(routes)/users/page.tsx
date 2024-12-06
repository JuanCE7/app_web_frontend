'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserLogged } from '@/app/api/users/login.api';
import ListUsers from './components/ListUsers/ListUsers';

export default function Page() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user?.email) {
        try {
          const user = await getUserLogged(session.user.email);

          // Validar que 'user' y 'user.role' existan
          if (user?.role?.name) {
            setUserRole(user.role.name);
          } else {
            console.warn('User role is undefined or malformed:', user);
            setUserRole(null); // Asigna null o un valor predeterminado si no existe
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    }

    fetchUserRole();
  }, [session]);

  if (status === 'loading' || !userRole) {
    return <div>Loading...</div>; // Muestra un spinner o similar
  }

  if (status === 'unauthenticated') {
    return null; // O redirige al login
  }

  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <h2 className="text-2xl">Lista de Usuarios</h2>
      {/* Condicional para mostrar o no la lista basada en el rol */}
      {userRole === 'Administrator' ? (
        <ListUsers />
      ) : (
        <div>No tienes permisos para ver esta sección.</div>
      )}
    </div>
  );
}
