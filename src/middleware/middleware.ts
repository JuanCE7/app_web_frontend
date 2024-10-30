export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!api/auth|api/uploadthing|login|signup).*)"],
};
