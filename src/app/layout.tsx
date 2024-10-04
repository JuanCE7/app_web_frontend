import type { Metadata } from "next";
import "./globals.css";
import SessionAuthProvider from "../context/SessionAuthProvider";
import { Noto_Sans_Display } from "next/font/google";

const noto = Noto_Sans_Display({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test Use Case ",
  description: "System Case",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <SessionAuthProvider>
          <main>{children}</main>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
