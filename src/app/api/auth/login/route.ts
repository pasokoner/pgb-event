// app/api/signup/route.ts
import { auth } from "@/server/auth";
import * as context from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { loginSchema } from "@/lib/types";
import { LuciaError } from "lucia";

export const POST = async (request: NextRequest) => {
  const response = loginSchema.safeParse(await request.json());

  if (!response.success) {
    return NextResponse.json(
      {
        error: "Bad input",
      },
      {
        status: 400,
      },
    );
  }

  const { username, password } = response.data;

  try {
    const user = await auth.useKey(
      "username",
      username.toLowerCase(),
      password,
    );
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/events", // redirect to profile page
      },
    });
  } catch (e) {
    // this part depends on the database you're using
    // check for unique constraint error in user table

    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist
      // or invalid password
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      },
    );
  }
};
