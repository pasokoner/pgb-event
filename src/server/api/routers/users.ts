import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const useRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    if (session.user.userRole !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return users;
  }),
});
