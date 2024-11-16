import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { db } from "../db/db";
import { players } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateUsername } from "unique-username-generator";
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
    
      id: string
      name: string
      walletAddress: string | null
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account, credentials, profile }) {
      console.log("singing in baby");
      const userName = generateUsername();
      await db
        .insert(players)
        .values({
          id: user.id,
          name: userName,
        })
        .onConflictDoNothing()
        .catch((e) => {
          console.error("error inserting player", e);
        });
      return true;
    },
    async session({ session }) {
      console.log("session", session);
      const player = await db.query.players.findFirst({
        where: eq(players.id, session.user?.name ?? ""),
      });
      if (!player) return session;
      return {
        ...session,
        user: {
          ...session.user,
          id: player.id,
          name: player.name,
          walletAddress:player.walletAddress
        },
      };
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler };
