"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type RouterOutputs } from "@/trpc/shared";

import DeleteOffice from "./delete-office";

type AllEventOutput = RouterOutputs["office"]["all"];

type AllEvent = AllEventOutput[number];

export const columns: ColumnDef<AllEvent>[] = [
  {
    accessorKey: "acronym",
    header: "Office",
  },
  {
    accessorKey: "name",
    header: "Office Name",
  },
  {
    accessorKey: "employeeCount",
    header: "Employees",
  },
  {
    accessorKey: "employeeAssignmentCount",
    header: "Employees Assignment",
  },
  {
    id: "action",
    accessorKey: "acronym",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("acronym");

      return (
        <div className="flex items-center gap-x-2">
          <DeleteOffice id={id as string} />
        </div>
      );
    },
  },
];
