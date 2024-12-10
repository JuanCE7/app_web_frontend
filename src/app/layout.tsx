import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import SessionAuthProvider from "../context/SessionAuthProvider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { UserProvider } from "@/context/UsersContext";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

const noto = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TestCaseCraft",
  description: "TestCase from Use Case IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={noto.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <SessionAuthProvider>
          <UserProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <ThemeProvider
                attribute="class"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </Suspense>
          </UserProvider>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
