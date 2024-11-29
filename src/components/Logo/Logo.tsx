"use client";

import Image from "next/image";

export function Logo() {
  return (
    <div
      className="min-h-20 h-20 flex items-center px-6 border-b cursor-pointer"      
    >
      <Image src="/logo.png" alt="logo" width={30} height={30} priority />
      <h1 className="font-bold p-2">TestCaseCraft</h1>
    </div>
  );
}
