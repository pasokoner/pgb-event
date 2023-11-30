"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/shared";
import { Check, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { usePathname } from "next/navigation";

type EmployeesOutput = RouterOutputs["employee"]["all"];

export type Employee = EmployeesOutput[number];

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("id");

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const { mutate, isLoading } = api.attendance.create.useMutation({
        onSuccess: (data) => {
          toast.custom(
            <div className="w-full max-w-md rounded-sm border-2 border-l-4 border-green-500 bg-white p-1.5 shadow-sm">
              <div className="text-lg font-bold">Attendance recorded</div>
              <div className="text-sm text-gray-500">
                <span className="text-semibold text-black">
                  {data.fullName}
                </span>{" "}
                has been recorded as attended.
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
        <div className="flex items-center gap-x-3 text-green-500">
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
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Check />
            )}
          </Button>
        </div>
      );
    },
  },
];
