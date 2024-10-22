"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { HeaderProps } from "./Header.types";

export function Header(props: HeaderProps) {
  const { item } = props;
  const { href, name } = item;
  const router = useRouter();

  return (
    <div className="flex items-center text-xl">
      <ArrowLeft
        className="w-5 h-5 mr-2 cursor-pointer"
        onClick={() => router.push(`${href}`)}
      />
      {name}
    </div>
  );
}
