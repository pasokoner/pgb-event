import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const attendanceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        employeeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const eventStatus = await ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
        select: {
          status: true,
        },
      });

      if (eventStatus?.status === "UPCOMING") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is not started yet",
        });
      }

      if (eventStatus?.status === "CANCELLED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is cancelled",
        });
      }

      if (eventStatus?.status === "ENDED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is ended",
        });
      }

      try {
        const attendee = await ctx.db.eventAttendance.create({
          data: {
            eventId: input.eventId,
            employeeId: input.employeeId,
            userId: ctx.session.user.userId,
          },

          select: {
            date: true,
            employee: {
              select: {
                firstName: true,
                lastName: true,
                extensionName: true,
                middleName: true,
                office: true,
              },
            },
          },
        });

        const { date, employee } = attendee;

        const {
          firstName,
          middleName = "",
          lastName,
          extensionName = "",
          office,
        } = employee;

        return {
          date,
          fullName: [firstName, middleName, lastName, extensionName].join(" "),
          office,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Already checked in",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        employeeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const eventStatus = await ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
        select: {
          status: true,
        },
      });

      if (eventStatus?.status === "UPCOMING") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is not started yet",
        });
      }

      if (eventStatus?.status === "CANCELLED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is cancelled",
        });
      }

      if (eventStatus?.status === "ENDED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Event is ended",
        });
      }

      try {
        const attendee = await ctx.db.eventAttendance.delete({
          where: {
            eventId_employeeId: {
              employeeId: input.employeeId,
              eventId: input.eventId,
            },
          },

          select: {
            date: true,
            employee: {
              select: {
                firstName: true,
                lastName: true,
                extensionName: true,
                middleName: true,
                office: true,
              },
            },
          },
        });

        const { date, employee } = attendee;

        const {
          firstName,
          middleName = "",
          lastName,
          extensionName = "",
          office,
        } = employee;

        return {
          date,
          fullName: [firstName, middleName, lastName, extensionName].join(" "),
          office,
        };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
