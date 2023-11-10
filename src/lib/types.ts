import { z } from "zod";

import { isPast, isToday } from "date-fns";
import { EmploymentStatus } from "@prisma/client";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;

export const newEmployeeSchema = z.object({
  firstName: z.string().trim().min(2, { message: "Please enter a name" }),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, { message: "Please enter a name" }),
  extensionName: z.string().trim().optional(),
  position: z.string().trim().min(2, { message: "Please enter a position" }),
  genericPosition: z
    .string()
    .trim()
    .min(2, { message: "Please enter a position" }),
  employmentStatus: z.nativeEnum(EmploymentStatus),
  officeAcronym: z
    .string()
    .trim()
    .min(2, { message: "Please enter an office" }),
  officeAssignmentAcronym: z
    .string()
    .trim()
    .min(2, { message: "Please enter an office" }),
});

export type TNewEmployeeSchema = z.infer<typeof newEmployeeSchema>;

export const editEmployeeSchema = newEmployeeSchema.extend({
  id: z.string(),
});

export type TEditEmployeeSchema = z.infer<typeof editEmployeeSchema>;

export const newEventSchema = z.object({
  name: z.string().trim().min(5, { message: "Please be descriptive" }),
  date: z.date().refine(
    (d) => {
      return !isPast(d) || isToday(d);
    },
    { message: "Past date is not a valid input" },
  ),
  type: z.string().trim(),
});

export type TNewEventSchema = z.infer<typeof newEventSchema>;

export const newUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, { message: "Please enter your full name" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
  fullName: z
    .string()
    .trim()
    .min(5, { message: "Please enter your full name" }),
});

export type TNewUserSchema = z.infer<typeof newUserSchema>;

export const newOfficeSchema = z.object({
  acronym: z.string().trim().min(2, { message: "Please enter an acronym" }),
  name: z.string().trim().optional(),
});

export type TNewOfficeSchema = z.infer<typeof newOfficeSchema>;

export const newReportSchema = z.object({
  title: z.string().trim().min(5, { message: "Please be descriptive" }),
  subtitle: z.string().trim().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  preparedBy: z.string().trim().min(5, { message: "Please enter your name" }),
  position: z.string().trim().min(5, { message: "Please enter your position" }),
  notedBy: z.string().trim().min(5, { message: "Please enter a name" }),
  officerPosition: z
    .string()
    .trim()
    .min(5, { message: "Please enter a position" }),
});

export type TNewReportSchema = z.infer<typeof newReportSchema>;
