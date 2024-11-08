"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect} from "react";

interface Props {
  children: React.ReactNode;
}

const AuthCheck = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return <>{children}</>;
};

const SessionAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <AuthCheck>{children}</AuthCheck>
    </SessionProvider>
  );
};

export default SessionAuthProvider;
