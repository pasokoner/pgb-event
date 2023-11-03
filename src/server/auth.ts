import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
// import "lucia/polyfill/node";

import { cache } from "react";
import * as context from "next/headers";

import { db } from "./db";

export const auth = lucia({
  adapter: prisma(db),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => {
    return {
      userId: data.id,
      username: data.username,
      userRole: data.role,
      userFullName: data.fullName,
    };
  },
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
