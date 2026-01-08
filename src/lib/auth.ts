import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, accounts, sessions } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow @lumalabs.ai emails
      const email = user.email || profile?.email;
      if (!email?.endsWith("@lumalabs.ai")) {
        return false;
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Get user role from database
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        session.user.role = dbUser?.role || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

// Extend the session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
