"use client";

import { cn } from "@/lib/utils";
import Scanner from "./_components/scanner";

import { api } from "@/trpc/react";
import { Circle } from "lucide-react";
import { color } from "@/lib/config";

import toast from "react-hot-toast";
import RecentButton from "./_components/recent-button";
import UserRecentButton from "./_components/user-recent-button";

import { format } from "date-fns";

export default function ScannerPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = api.event.eventById.useQuery(params.eventId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { mutate } = api.attendance.create.useMutation({
    onSuccess: (data) => {
      toast.custom(
        <div className="w-full max-w-md rounded-sm border-2 border-l-4 border-green-500 bg-white p-1.5 shadow-sm">
          <div className="text-lg font-bold">Attendance recorded</div>
          <div className="text-sm text-gray-500">
            <span className="text-semibold text-black">{data.fullName}</span>{" "}
            has been recorded as attended.
          </div>

          <div className="flex text-xs">
            <div className="ml-auto">{format(data.date, "hh:mm a")}</div>
          </div>
        </div>,
      );
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (event.isLoading) {
    return null;
  }

  if (!event.data) {
    return <div>Event does not exist</div>;
  }

  const onScanResult = (data: string) => {
    if (data === "") {
      return;
    }

    mutate({ employeeId: data, eventId: params.eventId });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">EVENT SCANNER</h1>
          <p className="text-sm text-gray-500">{event.data.name}</p>
        </div>

        <Circle
          className={cn(
            color[event.data.status],
            "h-4 w-4 rounded-full bg-none",
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <RecentButton eventId={params.eventId} />
        <UserRecentButton eventId={params.eventId} />
      </div>

      <Scanner onScanResult={onScanResult} />
    </div>
  );
}
