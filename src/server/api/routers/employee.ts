import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.db.employee.findMany({});

    return employees.map((employee) => {
      const { firstName, middleName, lastName, extensionName, ...excess } =
        employee;

      return {
        fullName: [firstName, middleName, lastName, extensionName].join(" "),
        ...excess,
      };
    });
  }),
});


