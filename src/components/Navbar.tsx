"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-300 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-black font-semibold hover:text-blue-300">
          Test Use Case 
        </Link>
        <div className="flex space-x-4">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Signout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants()}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants()}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
