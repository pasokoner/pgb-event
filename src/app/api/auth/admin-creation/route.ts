// app/api/signup/route.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

export const POST = async () => {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("UNAUTHORIZED");
    }

    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: "admin", // unique id when using "username" auth method
        password: process.env.ADMIN_PASSWORD!, // hashed by Lucia
      },
      attributes: {
        username: "admin",
        role: "ADMIN",
        fullName: "admin",
      },
    });

    return new Response(null, {
      status: 302,
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
