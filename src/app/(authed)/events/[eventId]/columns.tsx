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
    accessorKey: "office",
    header: "Office",
  },
  {
    accessorKey: "officeAssignment",
    header: "Office Assignment",
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date arrived",
    cell: ({ row }) => {
      const formatted = format(new Date(row.getValue("date")), "MM/dd/yyyy");

      return <div className="text-left font-bold">{formatted}</div>;
    },
  },
];
