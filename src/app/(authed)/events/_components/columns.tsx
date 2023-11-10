"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type EventStatus } from "@prisma/client";

import { type RouterOutputs } from "@/trpc/shared";

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { color } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Focus, Settings } from "lucide-react";
import Link from "next/link";
import DeleteEvent from "./delete-event";

type AllEventOutput = RouterOutputs["event"]["all"];

type AllEvent = AllEventOutput[number];

export const columns: ColumnDef<AllEvent>[] = [
  {
    accessorKey: "name",
    header: "Event Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: "Scheduled Date",
    cell: ({ row }) => {
      const formatted = format(new Date(row.getValue("date")), "MM/dd/yyyy");

      return <div className="text-left font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <Badge className={color[status as keyof typeof EventStatus]}>
          {row.getValue("status")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("id");

      return (
        <div className="flex items-center gap-x-3">
          <DeleteEvent id={id as string} />
          <Button variant="ghost" size="icon" className="h-4 w-4" asChild>
            <Link href={`/events/${id as string}`}>
              <Settings />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-4 w-4" asChild>
            <Link href={`/events/${id as string}/scanner`}>
              <Focus />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
