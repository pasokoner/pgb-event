import EventsTable from "./_components/table";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { NewEvent } from "./_components/new-event";
import { Suspense } from "react";
import TableSkeleton from "@/components/table-skeleton";

export default async function EventsPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
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
      <Suspense fallback={<TableSkeleton />}>
        <EventsTable />
      </Suspense>
    </div>
  );
}
