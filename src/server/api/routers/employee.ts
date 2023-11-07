import { newEmployeeSchema } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
});
