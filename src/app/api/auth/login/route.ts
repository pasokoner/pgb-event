// app/api/signup/route.ts
import { auth } from "@/server/auth";
import * as context from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { Prisma } from "@prisma/client";
import { loginSchema } from "@/lib/types";

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
        Location: "/dashboard", // redirect to profile page
      },
    });
  } catch (e) {
    // this part depends on the database you're using
    // check for unique constraint error in user table

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return NextResponse.json(
          {
            error: "Username already taken",
          },
          {
            status: 400,
          },
        );
      }
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
