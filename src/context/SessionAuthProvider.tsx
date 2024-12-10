"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthCheck = ({ children }: Props) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
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
