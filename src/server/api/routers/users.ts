import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { newUserSchema } from "@/lib/types";

import { auth } from "@/server/auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    if (session.user.userRole !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const users = await db.user.findMany({
      where: {
        role: "MEMBER",
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        updatedAt: true,
      },
    });

    return users;
  }),
  create: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;

      if (session.user.userRole !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const user = await auth.createUser({
          key: {
            providerId: "username", // auth method
            providerUserId: input.username.toLowerCase(), // unique id when using "username" auth method
            password: input.password, // hashed by Lucia
          },
          attributes: {
            username: input.username.toLowerCase(),
            role: "MEMBER",
            fullName: input.fullName.toUpperCase(),
          },
        });

        return user;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "username already taken",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      if (session.user.userRole !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.$transaction([
        db.user.delete({ where: { id: input.id } }),
        db.key.deleteMany({ where: { user_id: input.id } }),
        db.session.deleteMany({ where: { user_id: input.id } }),
      ]);
    }),
});
