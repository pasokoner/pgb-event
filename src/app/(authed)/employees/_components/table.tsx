import { columns } from "./columns";
import { DataTableEmployees } from "./data-table";
import { api } from "@/trpc/server";

export default async function EmployeesTable() {
  const data = await api.employee.all.query();

  return <DataTableEmployees columns={columns} data={data} />;
}
