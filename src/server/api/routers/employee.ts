import { editEmployeeSchema, newEmployeeSchema } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const employeeRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.db.employee.findMany({
      orderBy: {
        lastName: "asc",
      },
    });

    return employees.map((employee) => {
      const {
        firstName,
        middleName = "",
        lastName,
        extensionName = "",
        ...excess
      } = employee;

      return {
        fullName: [firstName, middleName, lastName, extensionName].join(" "),
        ...excess,
      };
    });
  }),
  create: protectedProcedure
    .input(newEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      if (session.user.userRole !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const employee = await db.employee.create({
        data: input,
      });

      return employee;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const deleteEmployee = await db.employee.delete({
        where: { id: input.id },
      });

      return deleteEmployee;
    }),
  update: protectedProcedure
    .input(editEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const employee = await db.employee.update({
        where: { id: input.id },
        data: input,
      });

      return employee;
    }),
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const employee = await ctx.db.employee.findUnique({
        where: {
          id: input,
        },
      });

      return employee;
    }),
});
