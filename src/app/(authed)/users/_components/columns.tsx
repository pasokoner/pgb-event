"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type RouterOutputs } from "@/trpc/shared";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Focus } from "lucide-react";
import Link from "next/link";
import DeleteUser from "./delete-user";

type AllEventOutput = RouterOutputs["user"]["all"];

type AllEvent = AllEventOutput[number];

export const columns: ColumnDef<AllEvent>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const formatted = format(
        new Date(row.getValue("updatedAt")),
        "MM/dd/yyyy",
      );

      return <div className="text-left font-bold">{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "id",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const id = row.getValue("id");

  //     return (
  //       <div className="flex items-center gap-x-2">
  //         <DeleteUser id={id as string} />
  //       </div>
  //     );
  //   },
  // },
];
