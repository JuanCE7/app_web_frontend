// auth.ts
import { NextAuthOptions } from "next-auth";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { GET } from "./route";

const authOptions: NextAuthOptions = GET as unknown as NextAuthOptions;

export const getServerSession = async () => {
  return await nextAuthGetServerSession(authOptions);
};
