import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/server";

export default async function OfficesTable() {
  const data = await api.office.all.query();

  return <DataTable columns={columns} data={data} />;
}
