import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

const auth = NextAuth(authOptions as AuthOptions);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*", "/groups/:path*", "/sessions/:path*"],
};
