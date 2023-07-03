import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import KeycloakProvider from "next-auth/providers/keycloak";


import { serverEnv } from "../../env/schema.mjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: serverEnv.KEYCLOAK_CLIENT_ID ?? "",
      clientSecret: serverEnv.KEYCLOAK_CLIENT_SECRET ?? "",
      issuer: serverEnv.KEYCLOAK_CLIENT_ISSUER ?? "",
      name: 'Steedos ID'
    }),

    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID ?? "",
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: serverEnv.GITHUB_CLIENT_ID ?? "",
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    // DiscordProvider({
    //   clientId: serverEnv.DISCORD_CLIENT_ID ?? "",
    //   clientSecret: serverEnv.DISCORD_CLIENT_SECRET ?? "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],
  pages: {
    signIn: "/signin",
  }
};
