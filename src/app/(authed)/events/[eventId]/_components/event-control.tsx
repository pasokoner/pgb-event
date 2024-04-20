"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns as employeesColumns } from "./employees-column";
import { columns } from "./columns";
import EventButtons from "./event-buttons";
import Link from "next/link";
import { DataTableEmployees } from "./employees-table";
import ExportAttendance from "./export-attendance";
import AdjustLate from "./adjust-late";

type EventControlProps = {
  eventId: string;
  initialData: RouterOutputs["event"]["eventById"];
};

export default function EventControl({
  eventId,
  initialData,
}: EventControlProps) {
  const event = api.event.eventById.useQuery(eventId, {
    initialData,
  });

  const attendance = api.event.attendees.useQuery(
    {
      eventId: eventId,
    },
    {
      initialData: [],
    },
  );

  const employees = api.employee.all.useQuery(undefined, {
    initialData: [],
  });

  const attendeesId = attendance.data.map((a) => a.id);

  if (!event.data) {
    return <></>;
  }

  const absentees = employees.data.filter(
    (employee) => !attendeesId.includes(employee.id),
  );

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

      <Tabs defaultValue="present">
        <TabsList className="flex">
          <div>
            <TabsTrigger value="present">Present</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </div>

          <div className="ml-auto flex gap-x-2">
            {event.data.status === "ONGOING" && (
              <AdjustLate id={event.data.id} defaultLate={event.data.date} />
            )}
            <ExportAttendance
              employees={absentees}
              eventName={event.data.name}
              attendees={attendance.data}
              eventDate={event.data.date}
            />
          </div>
        </TabsList>
        <TabsContent value="present">
          <DataTableEmployees data={attendance.data} columns={columns} />
        </TabsContent>
        <TabsContent value="employees">
          <DataTableEmployees data={absentees} columns={employeesColumns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
