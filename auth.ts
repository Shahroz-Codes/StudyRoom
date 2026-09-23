import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateLogin } from "@/lib/authLogic";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await validateLogin(credentials);
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const jwtToken = token as typeof token & {
          id?: string;
          email?: string | null;
          name?: string | null;
        };

        jwtToken.id = user.id;
        jwtToken.email = user.email;
        jwtToken.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          id: token.id,
          email: token.email,
          name: token.name,
        });
      }

      return session;
    },
  },
});