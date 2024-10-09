// import type { Metadata } from "next";
// import "./globals.css";
// import SessionAuthProvider from "../context/SessionAuthProvider";
// import { Noto_Sans_Display } from "next/font/google";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar/Sidebar";
// import { ThemeProvider } from "@/components/theme-provider";

// const noto = Noto_Sans_Display({
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Test Use Case ",
//   description: "System Case",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={noto.className}>
//         <div className="flex w-full h-full">
//           <SessionAuthProvider>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <div className="hidden xl:block w-80 h-full xl:fixed">
//                 <Sidebar />
//               </div>
//               <main className="w-full xl:ml-80">
//                 <Navbar />
//                 <div className="p-6 bg-[#fafbfc] dark:bg-secondary">
//                   {children}
//                 </div>
//               </main>
//             </ThemeProvider>
//           </SessionAuthProvider>
//         </div>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import SessionAuthProvider from "../context/SessionAuthProvider";

import "./globals.css";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Companies | TarreDev",
  description: "Course Tarredev ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionAuthProvider>
      <html lang="en">
        <body className={noto.className}>
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionAuthProvider>
  );
}