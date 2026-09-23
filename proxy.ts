export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/groups/:path*", "/sessions/:path*", "/rsvp/:path*"],
};
