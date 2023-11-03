import { newEventSchema } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EventStatus } from "@prisma/client";

import z from "zod";

export const eventRouter = createTRPCRouter({
  eventById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.db.event.findUnique({
        where: {
          id: input,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  }),
  create: protectedProcedure
    .input(newEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.create({
        data: input,
      });
    }),
  updateStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.nativeEnum(EventStatus) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  attendees: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attendees = await ctx.db.eventAttendance.findMany({
        where: {
          eventId: input.eventId,
        },
        include: {
          employee: true,
        },
      });

      return attendees.map((attendee) => {
        const { date, employee } = attendee;

        const {
          firstName,
          middleName = "",
          lastName,
          extensionName = "",
          officeAcronym,
          officeAssignmentAcronym,
          employmentStatus,
        } = employee;

        return {
          date,
          fullName: [firstName, middleName, lastName, extensionName].join(" "),
          employmentStatus,
          officeAcronym,
          officeAssignmentAcronym,
        };
      });
    }),
  activity: protectedProcedure
    .input(z.object({ eventId: z.string(), onlyUser: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      const attendees = await ctx.db.eventAttendance.findMany({
        where: {
          eventId: input.eventId,
          userId: input.onlyUser ? ctx.session.user.userId : undefined,
        },
        orderBy: {
          date: "desc",
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              extensionName: true,
              middleName: true,
              officeAssignmentAcronym: true,
            },
          },
        },
      });

      return attendees.map((attendee) => {
        const { date, employeeId, employee } = attendee;

        const {
          firstName,
          middleName = "",
          lastName,
          extensionName = "",
          officeAssignmentAcronym,
        } = employee;

        return {
          date,
          employeeId,
          fullName: [firstName, middleName, lastName, extensionName].join(" "),
          office: officeAssignmentAcronym,
        };
      });
    }),
});
