"use client";
import { type RouterOutputs } from "@/trpc/shared";
import { columns } from "./columns";
import { DataTableEmployees } from "./data-table-employees";
import { api } from "@/trpc/react";

type EmployeeTableProps = {
  initialData: RouterOutputs["employee"]["all"];
};

export default function EmployeeTable({ initialData }: EmployeeTableProps) {
  const { data } = api.employee.all.useQuery(undefined, {
    initialData: initialData,
  });

  return (
    <>
      <DataTableEmployees columns={columns} data={data} />
    </>
  );
}
