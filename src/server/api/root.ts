import { createTRPCRouter } from "@/server/api/trpc";
import { employeeRouter } from "@/server/api/routers/employee";
import { eventRouter } from "@/server/api/routers/event";
import { attendanceRouter } from "./routers/attendance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  employee: employeeRouter,
  event: eventRouter,
  attendance: attendanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
