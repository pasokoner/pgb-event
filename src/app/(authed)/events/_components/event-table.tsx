"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { NewEvent } from "./new-event";
import { api } from "@/trpc/react";

export default function EventTable() {
  const { data } = api.event.all.useQuery(undefined, {
    initialData: [],
  });

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">LIST OF EVENTS</h1>
          <p className="text-gray-500">Manage your events</p>
        </div>

        <div className="space-x-2">
          <NewEvent />
          <NewEvent isFlagCeremony />
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}
