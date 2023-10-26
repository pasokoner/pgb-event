import EventTable from "./_components/event-table";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <EventTable />
    </div>
  );
}
