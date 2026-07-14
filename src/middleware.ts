import { withAuth } from "next-auth/middleware";

// Protección de rutas del lado del servidor: cualquier ruta que coincida con
// el matcher exige una sesión válida de NextAuth; si no, redirige a /login.
// (Antes este archivo vivía en src/middleware/middleware.ts, ruta que Next NO
// reconoce, por lo que la protección server-side nunca se ejecutaba.)
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Excluye: rutas de API, assets internos de Next, el favicon, la página de
  // login y cualquier archivo estático con extensión (imágenes de /public).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
