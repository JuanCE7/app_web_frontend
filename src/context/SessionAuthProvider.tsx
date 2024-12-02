"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthCheck = ({ children }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  console.log(status)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
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
