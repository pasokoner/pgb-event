import { z } from "zod";

import { isPast, isToday } from "date-fns";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;

export const newEventSchema = z.object({
  name: z.string().min(5, { message: "Please be descriptive" }),
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
  username: z.string().min(5, { message: "Please enter your full name" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  fullName: z.string().min(5, { message: "Please enter your full name" }),
});

export type TNewUserSchema = z.infer<typeof newUserSchema>;
