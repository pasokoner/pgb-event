import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { newOfficeSchema } from "@/lib/types";

import { Prisma } from "@prisma/client";
import { z } from "zod";

export const officeRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    if (session.user.userRole !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const offices = await db.office.findMany({
      include: {
        _count: {
          select: { employeesOffice: true, employeesOfficeAssignment: true },
        },
      },
      orderBy: {
        acronym: "asc",
      },
    });

    return offices.map((office) => ({
      acronym: office.acronym,
      name: office.name,
      employeeCount: office._count.employeesOffice,
      employeeAssignmentCount: office._count.employeesOfficeAssignment,
    }));
  }),
  create: protectedProcedure
    .input(newOfficeSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      if (session.user.userRole !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const office = await db.office.create({
          data: {
            acronym: input.acronym,
            name: input?.name,
          },
        });

        return office;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "office already exist",
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

      const deleteOffice = await db.office.delete({
        where: { acronym: input.id },
      });

      return deleteOffice;
    }),
  getAcronyms: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.office.findMany({
      select: {
        acronym: true,
      },
    });
  }),
});
