import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/server";

export default async function EventsTable() {
  const data = await api.event.all.query();

  return <DataTable columns={columns} data={data} />;
}
