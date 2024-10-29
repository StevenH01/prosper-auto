// @types/next-auth.d.ts or lib/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Adding the accessToken property
  }

  interface Token {
    accessToken?: string; // Adding the accessToken property for the Token interface
  }
}
