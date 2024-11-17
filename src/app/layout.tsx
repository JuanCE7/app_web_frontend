import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import SessionAuthProvider from "../context/SessionAuthProvider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const noto = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["400", "700"], // Asegúrate de incluir los pesos que necesitas
  display: "swap", // Agrega esta opción para mejorar la carga
});

export const metadata: Metadata = {
  title: "CaseCraft",
  description: "System Case",
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
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
