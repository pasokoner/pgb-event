"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type RouterOutputs } from "@/trpc/shared";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Focus, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

type AllEventOutput = RouterOutputs["event"]["getReport"]["events"];

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
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      // Too lazy to make ths into another component LOL
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const searchParams = useSearchParams();

      const utils = api.useContext();

      const id = row.getValue("id");

      function onDelete() {
        utils.event.getReport.setData(
          {
            fromDate: new Date(searchParams.get("fromDate")!),
            toDate: new Date(searchParams.get("toDate")!),
          },
          (prev) => {
            return {
              ...prev!,
              events: prev!.events.filter((e) => e.id !== id),
              employees: prev!.employees.map((e) => {
                e.eventAttendance = e.eventAttendance.filter(
                  (a) => a.eventId !== id,
                );

                return e;
              }),
            };
          },
        );
      }

      return (
        <div className="flex items-center gap-x-2">
          <Button
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="h-4 w-4"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
