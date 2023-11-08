import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

import { type RouterOutputs } from "@/trpc/shared";

export default function EventsTable({
  data,
}: {
  data: RouterOutputs["event"]["getReport"]["events"];
}) {
  return <DataTable columns={columns} data={data} />;
}
