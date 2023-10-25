import { api } from "@/trpc/server";

import EventTable from "./_components/event-table";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  const data = await api.event.all.query();

  return (
    <div>
      <EventTable initialData={data} />
    </div>
  );
}
