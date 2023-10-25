import { api } from "@/trpc/server";

import EventTable from "./event-table";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await api.event.all.query();

  return (
    <div>
      <EventTable initialData={data} />
    </div>
  );
}
