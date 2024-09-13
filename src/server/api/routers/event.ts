import { editEventSchema, newEventSchema, newReportSchema } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EventStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
        date: "desc",
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
  edit: protectedProcedure
    .input(editEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      if (session.user.userRole !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const deleteEvent = await db.event.delete({
        where: { id: input.id },
      });

      return deleteEvent;
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(EventStatus),
      }),
    )
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
  updateLate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: {
          date: input.date,
        },
      });
    }),
  startEvent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(EventStatus),
        late: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [hours, minutes] = input.late.split(":");

      const dateWithSpecifiedTime = new Date();
      dateWithSpecifiedTime.setHours(parseInt(hours!, 10));
      dateWithSpecifiedTime.setMinutes(parseInt(minutes!, 10));

      return await ctx.db.event.update({
        where: {
          id: input.id,
          late: dateWithSpecifiedTime,
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
        present: z.boolean().default(true),
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
          id: employee.id,
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
  getReport: protectedProcedure
    .input(
      newReportSchema.omit({
        notedBy: true,
        preparedBy: true,
        title: true,
        subtitle: true,
        position: true,
        officerPosition: true,
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        where: {
          date: {
            gte: input.fromDate,
            lte: input.toDate,
          },
          status: "ENDED",
          ...(!!input.type ? { type: input.type } : {}),
        },
      });
      const employees = await ctx.db.employee.findMany({
        orderBy: {
          lastName: "asc",
        },
        include: {
          eventAttendance: {
            where: {
              event: {
                date: {
                  gte: input.fromDate,
                  lte: input.toDate,
                },
                status: "ENDED",
              },
            },
            include: {
              event: {
                select: {
                  late: true,
                },
              },
            },
          },
        },
      });

      return {
        events,
        employees: employees.map((e) => {
          const {
            firstName,
            middleName,
            lastName,
            extensionName,
            officeAcronym,
            officeAssignmentAcronym,
            eventAttendance,
          } = e;

          return {
            fullName: [`${lastName},`, firstName, middleName, extensionName].join(
              " ",
            ),
            eventAttendance,
            officeAcronym,
            officeAssignmentAcronym,
          };
        }),
      };
    }),
});
