import { api } from "@/trpc/server";

import AddEmployee from "./_components/add-employee";
import EmployeeTable from "./_components/employee-table";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await api.employee.all.query();

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-4 sm:mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">EMPLOYEE</h1>
          <p className="text-gray-500">Manage your employees</p>
        </div>

        <div>
          <AddEmployee />
        </div>
      </div>
      <EmployeeTable initialData={data} />
    </div>
  );
}
