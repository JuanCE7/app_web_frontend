"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();
  return (
    <div
      className="min-h-20 h-20 flex items-center px-6 border-r cursor-pointer"
      onClick={() => router.push("/")}
    >
      <Image src="./Image/logo.png" alt="logo" width={30} height={30} priority />
      <h1 className="font-bold">Universidad Nacional de Loja</h1>
    </div>
  );
}
