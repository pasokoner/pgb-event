"use client";
import { columns } from "./columns";
import { DataTableEmployees } from "./data-table-employees";
import { api } from "@/trpc/react";

export default function EmployeeTable() {
  const { data } = api.employee.all.useQuery(undefined, {
    initialData: [],
  });

  return (
    <>
      <DataTableEmployees columns={columns} data={data} />
    </>
  );
}
