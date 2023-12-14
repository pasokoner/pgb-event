"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Check, Cross, Loader2, X } from "lucide-react";

import { type RouterOutputs } from "@/trpc/shared";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

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
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("id");

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const { mutate, isLoading } = api.attendance.delete.useMutation({
        onSuccess: (data) => {
          toast.custom(
            <div className="w-full max-w-md rounded-sm border-2 border-l-4 border-green-500 bg-white p-1.5 shadow-sm">
              <div className="text-lg font-bold">Attendance deleted</div>
              <div className="text-sm text-gray-500">
                <span className="text-semibold text-black">
                  {data.fullName}
                </span>
              </div>

              <div className="flex text-xs">
                <div className="ml-auto">{format(data.date, "HH:mm a")}</div>
              </div>
            </div>,
          );
        },
        onError(error) {
          toast.error(error.message);
        },
      });

      return (
        <div className="flex items-center gap-x-3 text-red-500">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() =>
              mutate({
                employeeId: id as string,
                eventId: pathname.split("/")[pathname.split("/").length - 1]!,
              })
            }
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <X />}
          </Button>
        </div>
      );
    },
  },
];
