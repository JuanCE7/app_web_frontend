export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!/api/auth|/session|/login|/signup|/api/auth/callback).*)",
  ],
};