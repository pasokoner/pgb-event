"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type RouterOutputs } from "@/trpc/shared";
import { format } from "date-fns";

type AttendeesOutput = RouterOutputs["event"]["attendees"];

type Attendees = AttendeesOutput[number];

export const columns: ColumnDef<Attendees>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "officeAcronym",
    header: "Office",
  },
  {
    accessorKey: "officeAssignmentAcronym",
    header: "Office Assignment",
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date & Time Arrived",
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.getValue("date")),
        "MM/dd/yyyy",
      );
      const formattedTime = format(new Date(row.getValue("date")), "HH:mm a");

      return (
        <div className="flex flex-col">
          <div className="text-left font-bold">{formattedDate}</div>
          <div className="text-left">{formattedTime}</div>
        </div>
      );
    },
  },
];
