"use client";

import { cn } from "@/lib/utils";
import Scanner from "./_components/scanner";

import { api } from "@/trpc/react";
import { Circle, LoaderIcon } from "lucide-react";
import { color } from "@/lib/config";

import { format } from "date-fns";
import ActivityDropdown from "./_components/activity-dropdown";
import { useState } from "react";

export default function ScannerPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [status, setStatus] = useState<
    "standby" | "loading" | "success" | "error"
  >("standby");

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [attendee, setAttendee] = useState<
    | undefined
    | {
        fullName: string;
        date: Date;
      }
  >(undefined);

  const event = api.event.eventById.useQuery(params.eventId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { mutateAsync } = api.attendance.create.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setAttendee(data);
    },
    onError(error) {
      setStatus("error");
      setErrorMessage(error.message);
    },
  });

  if (event.isLoading) {
    return null;
  }

  if (!event.data) {
    return <div>Event does not exist</div>;
  }

  const onScanResult = async (data: string) => {
    if (data === "" || status === "loading") {
      return;
    }

    setStatus("loading");
    await mutateAsync({ employeeId: data, eventId: params.eventId });
  };

  return (
    <div className="relative">
      <Circle
        className={cn(
          color[event.data.status],
          "absolute -top-5 right-0 h-4 w-4 rounded-full bg-none",
        )}
      />
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-gray-700">{event.data.name}</h1>
        <div className="flex h-full">
          <ActivityDropdown eventId={params.eventId} />
        </div>
      </div>

      {status === "standby" && (
        <div className="z-50 w-full rounded-t-sm bg-gray-400 p-3 text-center text-sm font-bold text-gray-800 shadow-sm">
          START SCANNING
        </div>
      )}

      {status === "loading" && (
        <div className="z-50 flex w-full items-center justify-center gap-2 rounded-t-sm bg-orange-300 p-3 font-bold text-orange-700 shadow-sm">
          <div>Please wait</div>
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      )}

      {status === "success" && attendee && (
        <div className="z-50 w-full rounded-t-sm bg-green-300 p-3 text-green-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Attendance Recorded</div>
            <div className="text-xs">{format(attendee.date, "HH:mm a")}</div>
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-semibold text-black">
              {attendee.fullName}
            </span>{" "}
            has been recorded as attended.
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="z-50 w-full rounded-t-sm bg-red-300 p-3 text-center text-sm font-bold text-red-700 shadow-sm">
          {errorMessage}
        </div>
      )}

      <Scanner onScanResult={onScanResult} />
    </div>
  );
}
