"use client";

import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import EventButtons from "./event-buttons";
import { id } from "date-fns/locale";
import { Focus } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function EventControl({
  params,
}: {
  params: { eventId: string };
}) {
  const event = api.event.eventById.useQuery(params.eventId, {
    refetchOnWindowFocus: false,
  });

  const attendance = api.event.attendees.useQuery(
    {
      eventId: params.eventId,
    },
    {
      initialData: [],
      refetchInterval: 5000,
    },
  );

  if (event.isLoading) {
    return null;
  }

  if (!event.data) {
    return <div>Event does not exist</div>;
  }

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-3xl font-bold text-gray-700">EVENT SETTINGS</h1>
        <p className="text-sm text-gray-500">{event.data.name}</p>
      </div>

      <div className="flex justify-between gap-2">
        <Button variant="ghost" size="icon">
          <Link href={`/events/${event.data.id}/scanner`}>
            <Focus />
          </Link>
        </Button>

        <div className="space-x-2">
          <EventButtons status={event.data.status} id={event.data.id} />
        </div>
      </div>
      {/* <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="h-40 w-full bg-white shadow-sm"></div>
        <div className="h-40 w-full bg-white shadow-sm"></div>
      </div> */}

      <DataTable data={attendance.data} columns={columns} />
    </div>
  );
}
