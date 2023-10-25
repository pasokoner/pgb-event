"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";

import { Loader2 } from "lucide-react";

import { format } from "date-fns";

type ActivityProps = {
  eventId: string;
  onlyUser?: boolean;
};

export default function Activity({ eventId, onlyUser }: ActivityProps) {
  const { data, isLoading } = api.event.activity.useQuery({
    eventId,
    onlyUser,
  });

  return (
    <ScrollArea className="w-full flex-1 rounded-md border p-2">
      {isLoading && (
        <div className="flex w-full items-center justify-center py-2">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex w-full items-center justify-center py-2 text-red-600">
          No recent activity
        </div>
      )}

      {data &&
        data.length > 0 &&
        data.map(({ employeeId, date, fullName, office }) => (
          <div
            key={employeeId}
            className="flex items-center border-t-2 p-1 text-sm"
          >
            <div className="flex-1">
              <div>{fullName}</div>
              <div>{office}</div>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div>{format(date, "MM/dd/yy")}</div>
              <div>{format(date, "hh:mm a")}</div>
            </div>
          </div>
        ))}
    </ScrollArea>
  );
}
