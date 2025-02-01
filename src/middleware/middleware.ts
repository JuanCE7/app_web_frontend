export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/tcc((?!/api/auth|/session|/login|/signup|/api/auth/callback).*)",
  ],
};