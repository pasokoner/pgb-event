import { api } from "@/trpc/server";
import EventControl from "./_components/event-control";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  const event = await api.event.eventById.query(params.eventId);

  if (!event) {
    return <div>Event does not exist</div>;
  }

  return <EventControl initialData={event} eventId={params.eventId} />;
}
